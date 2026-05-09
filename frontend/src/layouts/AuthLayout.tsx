import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-sm bg-tertiary flex items-center justify-center">
            <span className="text-on-primary font-display text-xl font-bold">L</span>
          </div>
          <span className="font-display text-2xl font-bold text-primary tracking-tight">
            LifeOS
          </span>
        </div>

        {/* Auth card */}
        <div className="bg-surface rounded-lg p-8 shadow-float">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-primary/40 font-body">
          © 2026 LifeOS. Built for your life.
        </p>
      </div>
    </div>
  );
}
