
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'inprogress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  userId: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
};

export type TaskState = {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: {
    status: Status | 'all';
    priority: Priority | 'all';
    search: string;
  };
};
