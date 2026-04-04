import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import {
  NOTIFICATION_QUEUE_NAME,
  NOTIFICATION_QUEUE_SETTINGS,
} from './constants/queue.constants';
import { NotificationType } from './types/notification.type';
import { WelcomeEmailPayload } from './types/welcomeEmaiPayload.type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE_NAME)
    private readonly notificationQueue: Queue,
  ) {}

  async enqueueWelcomeEmail(payload: WelcomeEmailPayload) {
    await this.notificationQueue.add(
      NotificationType.WELCOME_EMAIL,
      payload,
      NOTIFICATION_QUEUE_SETTINGS,
    );
  }
}
