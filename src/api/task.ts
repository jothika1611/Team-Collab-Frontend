import api from './axios';
import { Task } from '../types';

export const taskApi = {
  getTasksByProject: (projectId: number) => api.get<Task[]>(`/tasks/project/${projectId}`),
  getMyTasks: () => api.get<Task[]>('/tasks/my-tasks'),
  createTask: (data: any) => api.post<Task>('/tasks', data),
  updateTaskStatus: (taskId: number, status: string) => api.put<Task>(`/tasks/${taskId}/status`, { status }),
  getTaskById: (taskId: number) => api.get<Task>(`/tasks/${taskId}`),
};
