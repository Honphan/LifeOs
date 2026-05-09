import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

/* ── Props ── */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/* ── Component ── */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-label uppercase tracking-widest text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // Base
            'w-full px-4 py-3 rounded-md',
            'bg-surface text-primary font-body text-body',
            'border-2 border-primary/10',
            'placeholder:text-primary/30',
            // States
            'transition-base',
            'hover:border-secondary/40',
            'focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20',
            // Error
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className,
          )}
          {...props}
        />
        {error && (
          <span className="font-mono text-label text-red-500">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export { Input };
