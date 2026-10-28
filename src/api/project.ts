import api from './axios';
import { Project } from '../types';

export const projectApi = {
  getAllProjects: () => api.get<Project[]>('/projects'),
  getProjectsByTeam: (teamId: number) => api.get<Project[]>(`/projects/team/${teamId}`),
  createProject: (data: any) => api.post<Project>('/projects', data),
};
