/**
 * 알림 관련 타입 정의
 */

export const NOTIFICATION_TYPES = {
  WORK_ORDER: 'WORK_ORDER',
  FACILITY: 'FACILITY',
  SYSTEM: 'SYSTEM',
  PATROL: 'PATROL',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}
