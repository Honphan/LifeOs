import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

/* ── Lazy-loaded pages ── */
const LoginPage     = lazy(() => import('../modules/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage  = lazy(() => import('../modules/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../modules/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TasksPage     = lazy(() => import('../modules/tasks/pages/TasksPage').then(m => ({ default: m.TasksPage })));
const FinancePage   = lazy(() => import('../modules/finance/pages/FinancePage').then(m => ({ default: m.FinancePage })));
const NotesPage     = lazy(() => import('../modules/notes/pages/NotesPage').then(m => ({ default: m.NotesPage })));

/* ── Loading fallback ── */
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin" />
    </div>
  );
}

/* ── Router ── */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Main app routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/notes" element={<NotesPage />} />
          </Route>

          {/* Catch-all → Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
