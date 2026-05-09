import { CheckSquare, Wallet, FileText, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

/* ── Mock data ── */
const stats = [
  { icon: <CheckSquare size={20} strokeWidth={1.8} />, label: 'Pending Tasks', value: 12, change: '3 this week', positive: true },
  { icon: <Wallet size={20} strokeWidth={1.8} />,      label: 'Balance',       value: '₫4.2M', change: '12%', positive: true },
  { icon: <FileText size={20} strokeWidth={1.8} />,     label: 'Notes',         value: 28, change: '5 new', positive: true },
  { icon: <TrendingUp size={20} strokeWidth={1.8} />,   label: 'Streak',        value: '7d' },
];

const recentActivities = [
  { id: 1, action: 'Completed task', detail: 'Design system setup', time: '2 hours ago', icon: <CheckSquare size={16} className="text-emerald-500" /> },
  { id: 2, action: 'Added expense', detail: '₫120,000 — Coffee', time: '4 hours ago', icon: <Wallet size={16} className="text-secondary" /> },
  { id: 3, action: 'Created note', detail: 'Meeting notes — Sprint 4', time: 'Yesterday', icon: <FileText size={16} className="text-tertiary" /> },
  { id: 4, action: 'Completed task', detail: 'API integration', time: 'Yesterday', icon: <CheckSquare size={16} className="text-emerald-500" /> },
];

/* ── Greeting helper ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ── Page ── */
export function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* ── Greeting ── */}
      <div>
        <h1 className="font-display text-h1 text-primary">
          {getGreeting()}, <span className="text-tertiary">User</span>
        </h1>
        <p className="text-body text-primary/50 font-body mt-1">
          Here's what's happening with your life today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <h2 className="font-display text-lg font-bold text-primary mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start w-full text-left">
              <Plus size={16} />
              <span>New Task</span>
            </Button>
            <Button variant="ghost" className="justify-start w-full text-left">
              <Plus size={16} />
              <span>Add Expense</span>
            </Button>
            <Button variant="ghost" className="justify-start w-full text-left">
              <Plus size={16} />
              <span>Write Note</span>
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-primary">Recent Activity</h2>
            <button className="flex items-center gap-1 text-sm text-secondary hover:text-tertiary transition-base font-body cursor-pointer">
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex flex-col divide-y divide-primary/5">
            {recentActivities.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-8 h-8 rounded-sm bg-primary/5 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-primary truncate">{item.action}</p>
                  <p className="text-sm font-body text-primary/40 truncate">{item.detail}</p>
                </div>
                <span className="font-mono text-label text-primary/30 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
