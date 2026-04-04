import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from 'src/common/email/email.service';
import { buildWelcomeEmailHtml } from 'src/common/email/templates/welcome-email.template';

import { NOTIFICATION_QUEUE_NAME } from './constants/queue.constants';
import {
  NotificationType,
  NotificationTypeEnum,
} from './types/notification.type';
import { WelcomeEmailPayload } from './types/welcomeEmaiPayload.type';

const APP_URL = 'https://task-board.com';

@Processor(NOTIFICATION_QUEUE_NAME)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(
    job: Job<WelcomeEmailPayload, void, NotificationTypeEnum>,
  ): Promise<void> {
    switch (job.name) {
      case NotificationType.WELCOME_EMAIL:
        await this.handleWelcomeEmail(job.data);
        break;
      default:
        if (job.name) {
          this.logger.warn(`Unknown job: ${job.name as string}`);
        } else {
          this.logger.warn('Unknown job');
        }
    }
  }

  private async handleWelcomeEmail(payload: WelcomeEmailPayload) {
    const { email, name } = payload;

    await this.emailService.sendEmail({
      to: email,
      subject: 'Welcome to Task Board',
      html: buildWelcomeEmailHtml({ name, appUrl: APP_URL }),
    });
  }
}
