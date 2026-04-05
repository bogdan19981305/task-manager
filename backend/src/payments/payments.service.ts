import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, Provider } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

import { STRIPE_API_VERSION } from './constants/payments.constant';
import { CreateCheckoutSessionParams } from './types/create-checkout-session.type';

type StripeClient = import('stripe/cjs/stripe.core').Stripe;

const StripeCJsConstructor = Stripe as unknown as new (
  key: string,
  config?: { apiVersion?: string },
) => StripeClient;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: StripeClient;

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
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const { userId, email, planId } = params;

    const plan = await this.prismaService.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      throw new BadRequestException('Plan is not available');
    }

    if (!plan.stripePriceId || !plan.stripeProductId) {
      throw new BadRequestException(
        'Stripe price is not configured for this plan',
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    let stripeCustomerId = user.stripeCustomerId ?? null;

    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email,
        metadata: {
          userId: String(userId),
        },
      });

      stripeCustomerId = customer.id;

      await this.prismaService.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId,
        },
      });
    }

    await this.prismaService.payment.updateMany({
      where: {
        userId,
        status: PaymentStatus.PENDING,
      },
      data: {
        status: PaymentStatus.CANCELED,
      },
    });

    const payment = await this.prismaService.payment.create({
      data: {
        userId,
        planId: plan.id,
        provider: Provider.STRIPE,
        status: PaymentStatus.PENDING,
        amount: plan.price,
        currency: plan.currency,
        stripeCustomerId,
      },
    });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow<string>('STRIPE_CANCEL_URL'),
      metadata: {
        userId: String(userId),
        paymentId: String(payment.id),
        planId: String(plan.id),
      },
      subscription_data: {
        metadata: {
          userId: String(userId),
          paymentId: String(payment.id),
          planId: String(plan.id),
        },
      },
    });

    await this.prismaService.payment.update({
      where: { id: payment.id },
      data: {
        stripeSessionId: session.id,
        stripeSubscriptionId:
          typeof session.subscription === 'string'
            ? session.subscription
            : null,
      },
    });

    if (!session.url) {
      throw new BadRequestException('Stripe checkout URL was not created');
    }

    this.logger.log(
      `Checkout session created: paymentId=${payment.id}, sessionId=${session.id}, userId=${userId}, planId=${plan.id}`,
    );

    return {
      url: session.url,
    };
  }
}
