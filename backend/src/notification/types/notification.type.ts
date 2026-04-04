export enum NotificationType {
  WELCOME_EMAIL = 'welcome-email',
}

export type NotificationTypeEnum =
  (typeof NotificationType)[keyof typeof NotificationType];
