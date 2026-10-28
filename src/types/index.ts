export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  createdByUsername: string;
  memberCount: number;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  teamId: number;
  teamName: string;
  startDate: string;
  endDate: string;
  archived: boolean;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  assignedToId: number | null;
  assignedToUsername: string | null;
  createdByUsername: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentDto {
  id: number;
  content: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  relatedEntityId: number;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  user: User;
  action: string;
  entityType: string;
  entityId: number;
  details: string;
  createdAt: string;
}
