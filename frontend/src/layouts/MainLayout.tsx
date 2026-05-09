import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { cn } from '../utils/cn';

export function MainLayout() {
  const [sidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          sidebarCollapsed ? 'ml-[88px]' : 'ml-[256px]',
        )}
      >
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
