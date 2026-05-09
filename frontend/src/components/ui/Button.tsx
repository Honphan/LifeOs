import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

/* ── Variants ── */
const variants = {
  primary:
    'bg-tertiary text-on-primary hover:brightness-110 active:brightness-95',
  secondary:
    'bg-transparent text-primary border-2 border-secondary/30 hover:border-secondary hover:bg-secondary/5',
  ghost:
    'bg-transparent text-primary hover:bg-primary/5',
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-sm',
  md: 'px-5 py-3 text-body rounded-md',
  lg: 'px-7 py-4 text-body rounded-md font-semibold',
} as const;

/* ── Props ── */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

/* ── Component ── */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2',
          'font-body font-medium',
          'transition-base cursor-pointer',
          'disabled:opacity-50 disabled:pointer-events-none',
          'focus-visible:focus-ring',
          // Variant + Size
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export { Button };
