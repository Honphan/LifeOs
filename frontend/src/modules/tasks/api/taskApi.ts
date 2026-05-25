import { api, unwrapData } from '../../../api/client';
import type { TaskItem } from '../types/task.types';

export async function getTasks() {
  const response = await api.get('/tasks');
  return unwrapData<TaskItem[]>(response.data);
}

export async function createTask(title: string) {
  const response = await api.post('/tasks', null, {
    params: { title },
  });
  return unwrapData<TaskItem>(response.data);
}
