import api from './axios';
import { ActivityLog } from '../types';

export const activityApi = {
  getRecentActivity: () => api.get<ActivityLog[]>('/activity'),
};
