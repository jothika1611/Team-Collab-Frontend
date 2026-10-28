import api from './axios';
import { Team } from '../types';

export interface TeamMember {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  joinedAt: string;
}

export const teamApi = {
  getMyTeams: () => api.get<Team[]>('/teams'),
  createTeam: (data: { name: string; description: string }) => api.post<Team>('/teams', data),
  getTeamById: (id: number) => api.get<Team>(`/teams/${id}`),
  addMember: (teamId: number, userId: number) => api.post(`/teams/${teamId}/members/${userId}`),
  getTeamMembers: (teamId: number) => api.get<TeamMember[]>(`/teams/${teamId}/members`),
  updateMemberRole: (teamId: number, memberId: number, role: string) => api.put(`/teams/${teamId}/members/${memberId}/role?role=${role}`),
  removeMember: (teamId: number, memberId: number) => api.delete(`/teams/${teamId}/members/${memberId}`),
};
