import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

/* ── Card ── */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-lg p-6',
        'shadow-card hover:shadow-card-hover',
        'transition-base',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── CardHeader ── */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/* ── CardBody ── */
export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}
