import api from './axios';
import { Notification } from '../types';

export const notificationApi = {
  getMyNotifications: () => api.get<Notification[]>('/notifications'),
  getUnreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),
  markAsRead: (id: number) => api.put<Notification>(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};
