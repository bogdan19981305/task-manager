import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, UserPlanStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import type { Stripe as StripeTypes } from 'stripe/cjs/stripe.core';

import { STRIPE_API_VERSION } from '../constants/payments.constant';

type StripeClient = import('stripe/cjs/stripe.core').Stripe;

const StripeCJsConstructor = Stripe as unknown as new (
  key: string,
  config?: { apiVersion?: string },
) => StripeClient;

@Injectable()
export class PaymentsWebhookService {
  private readonly logger = new Logger(PaymentsWebhookService.name);
  private readonly stripe: StripeClient;
  private readonly webhookSecret: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new StripeCJsConstructor(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: STRIPE_API_VERSION,
      },
    );

    this.webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    let event: StripeTypes.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (error) {
      this.logger.error('Stripe webhook signature verification failed', error);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;

      default:
        this.logger.log(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  private periodBoundsFromSubscription(
    subscription: StripeTypes.Subscription,
  ): {
    start: Date | null;
    end: Date | null;
  } {
    const rows = subscription.items?.data ?? [];
    if (rows.length === 0) {
      return { start: null, end: null };
    }
    let minStart = Infinity;
    let maxEnd = -Infinity;
    for (const item of rows) {
      if (item.current_period_start != null) {
        minStart = Math.min(minStart, item.current_period_start);
      }
      if (item.current_period_end != null) {
        maxEnd = Math.max(maxEnd, item.current_period_end);
      }
    }
    if (minStart === Infinity || maxEnd === -Infinity) {
      return { start: null, end: null };
    }
    return {
      start: new Date(minStart * 1000),
      end: new Date(maxEnd * 1000),
    };
  }

  private async handleCheckoutSessionCompleted(
    session: StripeTypes.Checkout.Session,
  ) {
    const paymentId = Number(session.metadata?.paymentId);
    const userId = Number(session.metadata?.userId);
    const planId = Number(session.metadata?.planId);

    if (!paymentId || !userId || !planId) {
      this.logger.warn(
        `checkout.session.completed missing metadata: sessionId=${session.id}`,
      );
      return;
    }

    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : null;

    const customerId =
      typeof session.customer === 'string' ? session.customer : null;

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : null;

    const payment = await this.prismaService.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      this.logger.warn(
        `Payment not found for checkout.session.completed: paymentId=${paymentId}`,
      );
      return;
    }

    await this.prismaService.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.SUCCEEDED,
        stripeSessionId: session.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePaymentIntentId: paymentIntentId,
      },
    });

    let currentPeriodStart: Date | null = null;
    let currentPeriodEnd: Date | null = null;
    let cancelAtPeriodEnd = false;

    if (subscriptionId) {
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      const bounds = this.periodBoundsFromSubscription(subscription);
      currentPeriodStart = bounds.start;
      currentPeriodEnd = bounds.end;
      cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;
    }

    const existingUserPlan = await this.prismaService.userPlan.findFirst({
      where: {
        userId,
        status: {
          in: [UserPlanStatus.ACTIVE, UserPlanStatus.PAST_DUE],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existingUserPlan) {
      await this.prismaService.userPlan.update({
        where: { id: existingUserPlan.id },
        data: {
          planId,
          status: UserPlanStatus.ACTIVE,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          activatedAt: existingUserPlan.activatedAt ?? new Date(),
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd,
          canceledAt: null,
        },
      });
    } else {
      await this.prismaService.userPlan.create({
        data: {
          userId,
          planId,
          status: UserPlanStatus.ACTIVE,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          activatedAt: new Date(),
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd,
        },
      });
    }

    this.logger.log(
      `Subscription activated: paymentId=${paymentId}, userId=${userId}, planId=${planId}, subscriptionId=${subscriptionId}`,
    );
  }

  private async handleSubscriptionUpdated(
    subscription: StripeTypes.Subscription,
  ) {
    const subscriptionId = subscription.id;
    const customerId =
      typeof subscription.customer === 'string' ? subscription.customer : null;

    const bounds = this.periodBoundsFromSubscription(subscription);
    const currentPeriodStart = bounds.start;
    const currentPeriodEnd = bounds.end;

    const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;

    let status: UserPlanStatus = UserPlanStatus.ACTIVE;

    if (subscription.status === 'past_due') {
      status = UserPlanStatus.PAST_DUE;
    }

    if (
      subscription.status === 'canceled' ||
      subscription.status === 'unpaid' ||
      subscription.status === 'incomplete_expired'
    ) {
      status = UserPlanStatus.CANCELED;
    }

    await this.prismaService.userPlan.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        stripeCustomerId: customerId,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd,
        status,
      },
    });

    this.logger.log(`Subscription updated: ${subscriptionId}`);
  }

  private async handleSubscriptionDeleted(
    subscription: StripeTypes.Subscription,
  ) {
    const subscriptionId = subscription.id;

    await this.prismaService.userPlan.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        status: UserPlanStatus.CANCELED,
        canceledAt: new Date(),
        cancelAtPeriodEnd: false,
      },
    });

    this.logger.log(`Subscription deleted: ${subscriptionId}`);
  }
}
