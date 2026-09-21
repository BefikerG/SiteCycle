'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', 'bg-background')}>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Leaf className="h-3 w-3" aria-hidden="true" />
            </span>
            <p>SiteCycle — Circular material intelligence for construction</p>
          </div>
          <p>
            Built for NextStep Hacks 2026
            <span className="mx-2 text-muted-foreground/60">•</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}