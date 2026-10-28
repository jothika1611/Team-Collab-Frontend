import api from './axios';
import { User } from '../types';

export const userApi = {
  getAllUsers: () => api.get<User[]>('/users'),
};
