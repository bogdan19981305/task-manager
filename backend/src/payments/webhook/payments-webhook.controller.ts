import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { PaymentsWebhookService } from './payments-webhook.service';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  constructor(
    private readonly paymentsWebhookService: PaymentsWebhookService,
  ) {}

  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature?: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    await this.paymentsWebhookService.handleStripeWebhook(
      req.rawBody,
      signature,
    );

    return { received: true };
  }
}
