export const NOTIFICATION_QUEUE_NAME = 'notification';

export const NOTIFICATION_QUEUE_SETTINGS = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: true,
  removeOnFail: 50,
};
