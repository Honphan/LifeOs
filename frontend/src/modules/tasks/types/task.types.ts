export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskItem {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
}
