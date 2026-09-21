'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  MapPin,
  Package,
  GitBranch,
  Leaf,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Network', href: '/network', icon: MapPin },
  { name: 'Materials', href: '/materials', icon: Package },
  { name: 'Matches', href: '/matches', icon: GitBranch },
  { name: 'Impact', href: '/impact', icon: Leaf },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="SiteCycle Home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
              <Leaf className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                SiteCycle
              </span>
              <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
                Circular Intelligence
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 md:flex">
            {navigation.map((item) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon
                    className={cn('h-4 w-4', isActive ? 'text-primary' : 'opacity-70')}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                    <span className="absolute inset-x-2.5 -bottom-[9px] h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/materials/new" className="hidden md:block">
            <Button size="sm" className="gap-1.5">
              <Package className="h-3.5 w-3.5" aria-hidden="true" />
              Declare Surplus
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-200 border-t border-border/70',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {navigation.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link href="/materials/new" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full gap-1.5">
                <Package className="h-4 w-4" aria-hidden="true" />
                Declare Surplus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}