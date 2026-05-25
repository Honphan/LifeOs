import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { CheckSquare, CirclePlus, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { getApiErrorMessage } from '../../../api/client';
import { createTask, getTasks } from '../api/taskApi';
import type { TaskItem } from '../types/task.types';

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taskCount = useMemo(() => tasks.length, [tasks]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không thể tải danh sách tasks.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || submitting) return;

    setSubmitting(true);
    try {
      await createTask(nextTitle);
      setTitle('');
      await loadTasks();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không thể tạo task.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-tertiary/10 flex items-center justify-center">
            <CheckSquare size={20} className="text-tertiary" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-h1 text-primary">Tasks</h1>
        </div>
        <p className="text-body text-primary/50 font-body">
          Đồng bộ theo endpoint `GET /api/tasks` và `POST /api/tasks?title=...`.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <Card>
          <CardHeader>
            <h2 className="font-display text-lg font-bold text-primary">Tạo task</h2>
            <p className="text-sm text-primary/50 font-body mt-1">
              API hiện chỉ xác nhận tạo và danh sách tasks.
            </p>
          </CardHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Tiêu đề"
              placeholder="Ví dụ: Hoàn thành báo cáo tài chính"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <Button type="submit" className="w-full" disabled={submitting || !title.trim()}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <CirclePlus size={16} />}
              {submitting ? 'Đang tạo...' : 'Tạo task'}
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-primary">Danh sách task</h2>
              <p className="text-sm text-primary/50 font-body mt-1">
                {taskCount} task đang có trong hệ thống.
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={loadTasks} disabled={loading}>
              {loading ? 'Đang tải...' : 'Làm mới'}
            </Button>
          </CardHeader>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-primary/50">
              <Loader2 size={22} className="animate-spin text-tertiary" />
            </div>
          ) : error ? (
            <div className="rounded-md border border-red-400/20 bg-red-50 px-4 py-3 text-sm text-red-600 font-body">
              {error}
            </div>
          ) : !tasks.length ? (
            <div className="py-16 text-center text-primary/40 font-body">
              Chưa có task nào.
            </div>
          ) : (
            <div className="divide-y divide-primary/5">
              {tasks.map((task) => (
                <div key={task.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body font-medium text-primary">{task.title}</p>
                    <p className="text-sm text-primary/40 font-body mt-1">
                      Tạo lúc {formatDateTime(task.createdAt)}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 rounded-sm bg-tertiary/10 px-2.5 py-1 text-xs font-mono uppercase tracking-widest text-tertiary">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
