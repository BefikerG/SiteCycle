'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Tabs = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }
>(({ className, children, defaultValue, value, onValueChange, ...props }, ref) => {
  const [activeValue, setActiveValue] = React.useState(defaultValue || '');
  
  const handleValueChange = (newValue: string) => {
    setActiveValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div ref={ref} className={cn('', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { 
          value: activeValue || value, 
          onValueChange: handleValueChange 
        } as any);
      })}
    </div>
  );
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const [isActive, setIsActive] = React.useState(false);
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
          className
        )}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={() => {
          props.onClick?.(props as any);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const [isActive, setIsActive] = React.useState(false);
  
  return (
    <div
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive ? '' : 'hidden',
        className
      )}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };