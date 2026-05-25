import { Outlet } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { FinanceNav } from '../components/FinanceNav';
import { ToastProvider } from '../components/Toast';

export function FinanceLayout() {
  return (
    <ToastProvider>
      <div className="max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-sm bg-tertiary/10 flex items-center justify-center">
            <Wallet size={20} className="text-tertiary" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-h1 text-primary">Finance</h1>
        </div>
        <FinanceNav />
        <Outlet />
      </div>
    </ToastProvider>
  );
}
