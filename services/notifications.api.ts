import { api } from '@/lib/axios';
import {
  Notification,
  NotificationChannel,
  NotificationPreference,
  NotificationResponse,
  NotificationType,
  UnreadCountResponse,
  UpdateNotificationPreferenceDto,
  CreateNotificationPreferenceDto
} from '@/types';

export const notificationsApi = {
  // Notifications
  getNotifications: async (page = 1, limit = 10, unreadOnly = false) => {
    return api.get<NotificationResponse>(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`);
  },

  getUnreadCount: async () => {
    return api.get<UnreadCountResponse>('/notifications/unread-count');
  },

  markAsRead: async (id: string) => {
    return api.post<{ count: number }>(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return api.post<{ count: number }>('/notifications/read-all');
  },

  deleteNotification: async (id: string) => {
    return api.delete<{ success: boolean }>(`/notifications/${id}`);
  },

  // Notification Preferences
  getNotificationPreferences: async () => {
    return api.get<NotificationPreference[]>('/notification-preferences');
  },

  initializeDefaultPreferences: async () => {
    return api.get<NotificationPreference[]>('/notification-preferences/initialize');
  },

  getNotificationPreference: async (id: string) => {
    return api.get<NotificationPreference>(`/notification-preferences/${id}`);
  },

  getNotificationPreferenceByTypeAndChannel: async (type: NotificationType, channel: NotificationChannel) => {
    return api.get<NotificationPreference>(`/notification-preferences/type/${type}/channel/${channel}`);
  },

  createNotificationPreference: async (data: CreateNotificationPreferenceDto) => {
    return api.post<NotificationPreference>('/notification-preferences', data);
  },

  updateNotificationPreference: async (id: string, data: UpdateNotificationPreferenceDto) => {
    return api.patch<NotificationPreference>(`/notification-preferences/${id}`, data);
  },

  updateNotificationPreferenceByTypeAndChannel: async (
    type: NotificationType,
    channel: NotificationChannel,
    data: UpdateNotificationPreferenceDto
  ) => {
    return api.patch<NotificationPreference>(`/notification-preferences/type/${type}/channel/${channel}`, data);
  },

  deleteNotificationPreference: async (id: string) => {
    return api.delete<{ success: boolean }>(`/notification-preferences/${id}`);
  }
};

export default notificationsApi;
