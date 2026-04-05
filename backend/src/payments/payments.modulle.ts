import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsWebhookController } from './webhook/payments-webhook.controller';
import { PaymentsWebhookService } from './webhook/payments-webhook.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [PaymentsService, PaymentsWebhookService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
