import { PaginationMeta } from "./utils";

export enum NotificationType {
  ORDER = 'ORDER',
  OFFER = 'OFFER',
  DEAL = 'DEAL',
  SERVICE = 'SERVICE',
  SYSTEM = 'SYSTEM'
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH'
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  data: Notification[];
  meta: PaginationMeta;
}

export interface UnreadCountResponse {
  count: number;
}

export interface CreateNotificationPreferenceDto {
  type: NotificationType;
  channel: NotificationChannel;
  enabled?: boolean;
}

export interface UpdateNotificationPreferenceDto {
  enabled: boolean;
}
