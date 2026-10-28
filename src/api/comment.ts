import api from './axios';
import { CommentDto } from '../types';

export const commentApi = {
  getComments: (taskId: number) => api.get<CommentDto[]>(`/comments/task/${taskId}`),
  addComment: (taskId: number, content: string) => api.post<CommentDto>(`/comments/task/${taskId}`, { content }),
};
