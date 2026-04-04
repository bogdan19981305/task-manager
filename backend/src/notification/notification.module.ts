import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailService } from 'src/common/email/email.service';

import { NOTIFICATION_QUEUE_NAME } from './constants/queue.constants';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE_NAME,
    }),
  ],
  providers: [NotificationService, NotificationProcessor, EmailService],
  exports: [NotificationService],
})
export class NotificationModule {}
