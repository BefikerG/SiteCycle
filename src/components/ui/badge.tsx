'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          {
            'border-transparent bg-primary/10 text-primary': variant === 'default',
            'border-transparent bg-secondary text-secondary-foreground': variant === 'secondary',
            'border-transparent bg-destructive/10 text-destructive': variant === 'destructive',
            'border-border/80 text-foreground': variant === 'outline',
            'border-transparent bg-success/15 text-success': variant === 'success',
            'border-transparent bg-warning/15 text-warning': variant === 'warning',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };