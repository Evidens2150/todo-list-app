export type TaskStatus = 'all' | 'active' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITaskData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
}

export interface ITaskStatusOption {
  label: string;
  value: TaskStatus;
}
