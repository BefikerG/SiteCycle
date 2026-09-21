'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Package, MapPin, TrendingUp, Leaf, Truck } from 'lucide-react';

type Accent = 'primary' | 'success' | 'warning' | 'destructive';

const accentStyles: Record<Accent, { tile: string; icon: string }> = {
  primary: { tile: 'bg-primary/10', icon: 'text-primary' },
  success: { tile: 'bg-success/15', icon: 'text-success' },
  warning: { tile: 'bg-warning/15', icon: 'text-warning' },
  destructive: { tile: 'bg-destructive/10', icon: 'text-destructive' },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  accent?: Accent;
}

export function StatCard({ title, value, icon, description, trend, trendUp, accent = 'primary' }: StatCardProps) {
  const styles = accentStyles[accent];
  return (
    <Card className="transition-shadow hover:shadow-[0_2px_8px_-2px_rgb(24_29_58/0.12)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums">
              {value}
            </p>
            {description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  'mt-1 text-xs font-medium',
                  trendUp ? 'text-success' : 'text-destructive'
                )}
              >
                {trend}
              </p>
            )}
          </div>
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', styles.tile)}>
            {icon && <span className={cn(styles.icon, '[&>svg]:h-[18px] [&>svg]:w-[18px]')}>{icon}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewStats({ stats }: { stats: { projects: number; surplusItems: number; activeDemands: number; potentialValue: number; potentialCo2e: number } }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Active Projects"
        value={stats.projects}
        icon={<MapPin className="h-[18px] w-[18px]" />}
        description="Construction sites in network"
        accent="primary"
      />
      <StatCard
        title="Surplus Items"
        value={stats.surplusItems}
        icon={<Package className="h-[18px] w-[18px]" />}
        description="Materials declared as surplus"
        accent="warning"
      />
      <StatCard
        title="Active Demands"
        value={stats.activeDemands}
        icon={<TrendingUp className="h-[18px] w-[18px]" />}
        description="Materials needed by projects"
        accent="primary"
      />
      <StatCard
        title="Potential Value"
        value={`ETB ${stats.potentialValue.toLocaleString()}`}
        icon={<Leaf className="h-[18px] w-[18px]" />}
        description="Estimated recoverable value"
        accent="success"
      />
      <StatCard
        title="Potential CO₂e Avoided"
        value={`${(stats.potentialCo2e / 1000).toFixed(1)} t`}
        icon={<Truck className="h-[18px] w-[18px]" />}
        description="Estimated emissions avoided"
        accent="success"
      />
    </div>
  );
}