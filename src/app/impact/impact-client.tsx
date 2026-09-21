'use client';

import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Leaf,
  MapPin,
  Package,
  Ruler,
  Scale,
  Sparkles,
  Truck,
  Weight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransferImpact, AggregateImpact, ImpactProvenance } from '@/lib/types';
import { IMPACT_METHODOLOGY } from '@/lib/impact/calculate';
import { cn } from '@/lib/utils';

interface ImpactData {
  transfers: TransferImpact[];
  aggregate: AggregateImpact;
  provenance: ImpactProvenance;
}

interface ImpactClientProps {
  data: ImpactData | null;
}

const PROVENANCE_COLORS: Record<string, string> = {
  Observed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Calculated: 'bg-success/15 text-success',
  Estimated: 'bg-warning/15 text-warning',
};

export function ImpactClient({ data }: ImpactClientProps) {
  if (!data || data.transfers.length === 0) {
    return (
      <div className="container-padded section-spacing">
        <ImpactPageHeader />
        <Card className="mt-8">
          <CardContent className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No transfers recorded</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Create your first transfer to see impact calculations.
            </p>
            <Link href="/matches" className="mt-5 inline-block">
              <Button className="gap-2">
                Find Matches
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { transfers, aggregate, provenance } = data;

  return (
    <div className="container-padded section-spacing">
      <ImpactPageHeader />

      <div className="mt-8">
        <Card>
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15">
                <Leaf className="h-4 w-4 text-success" />
              </span>
              Aggregate Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <MetricCard
                title="Total Transfers"
                value={aggregate.totalTransfers}
                icon={<Package className="h-[18px] w-[18px]" />}
                description="Completed transfers"
                accent="primary"
              />
              <MetricCard
                title="Mass Recovered"
                value={`${aggregate.totalMassKg.toLocaleString()} kg`}
                icon={<Weight className="h-[18px] w-[18px]" />}
                description="Material mass diverted"
                provenance={provenance.massKg}
                accent="primary"
              />
              <MetricCard
                title="Value Recovered"
                value={`ETB ${aggregate.totalValueRecovered.toLocaleString()}`}
                icon={<CircleDollarSign className="h-[18px] w-[18px]" />}
                description="Economic value recovered"
                provenance={provenance.valueRecovered}
                accent="success"
              />
              <MetricCard
                title="Waste Avoided"
                value={`${aggregate.totalWasteAvoidedKg.toLocaleString()} kg`}
                icon={<Truck className="h-[18px] w-[18px]" />}
                description="Estimated landfill diversion"
                provenance={provenance.wasteAvoidedKg}
                accent="warning"
              />
              <MetricCard
                title="CO₂e Avoided"
                value={`${(aggregate.totalCo2eAvoidedKg / 1000).toFixed(2)} t`}
                icon={<Leaf className="h-[18px] w-[18px]" />}
                description="Estimated emissions avoided"
                provenance={provenance.co2eAvoidedKg}
                accent="success"
              />
            </div>

            {Object.keys(aggregate.materials).length > 0 && (
              <div className="mt-8 border-t border-border/70 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  By material
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Mass (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(aggregate.materials)
                        .filter(([, value]) => value.quantity > 0)
                        .map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">
                              {key.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {value.quantity.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {value.massKg.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <div className="page-eyebrow">
            <Ruler className="h-3.5 w-3.5" />
            Transfer breakdown
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Detail per project</h2>
        </div>

        {transfers.map((transfer) => (
          <Card key={transfer.transferId} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary" />
                    {transfer.sourceProject}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    {transfer.destinationProject}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    Transfer ID: {transfer.transferId}
                    <span aria-hidden="true"> · </span>
                    Created: {new Date(transfer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="outline" className="gap-1.5">
                    <Ruler className="h-3.5 w-3.5" />
                    <span className="tabular-nums">{transfer.distanceKm.toFixed(1)} km</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <Weight className="h-3.5 w-3.5" />
                    <span className="tabular-nums">{transfer.totalMassKg.toLocaleString()} kg</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <CircleDollarSign className="h-3.5 w-3.5" />
                    <span className="tabular-nums">
                      ETB {transfer.totalValueRecovered.toLocaleString()}
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit</TableHead>
                      <TableHead className="text-right">Mass (kg)</TableHead>
                      <TableHead className="text-right">Value (ETB)</TableHead>
                      <TableHead className="text-right">Waste Avoided (kg)</TableHead>
                      <TableHead className="text-right">CO₂e Avoided (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfer.materials.map((material) => (
                      <TableRow key={material.materialKey}>
                        <TableCell className="font-medium">{material.materialName}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {material.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{material.unit}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {material.massKg.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {material.valueRecovered.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {material.wasteAvoidedKg.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {material.co2eAvoidedKg.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/40 font-medium">
                      <TableCell>Total</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell className="text-right tabular-nums">
                        {transfer.totalMassKg.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {transfer.totalValueRecovered.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {transfer.totalWasteAvoidedKg.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {transfer.totalCo2eAvoidedKg.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t border-border/70 p-5">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  Provenance
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(provenance).map(([key, label]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className={cn(PROVENANCE_COLORS[label], 'gap-1.5')}
                    >
                      <span className="uppercase tracking-wide text-[10px] opacity-80">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 overflow-hidden">
        <div className="h-1 bg-primary/40" />
        <CardHeader className="border-b border-border/70 pb-4">
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            Methodology &amp; Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm leading-6 text-muted-foreground">
            All impact figures are illustrative estimates for demo purposes. They are not certified
            measurements and should not be used for regulatory or financial reporting.
          </p>

          <div className="mt-6 space-y-3">
            {Object.entries(IMPACT_METHODOLOGY).map(([key, method]) => (
              <div key={key} className="rounded-lg border border-border/70 p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className={cn(PROVENANCE_COLORS[method.label], 'shrink-0')}>
                    {method.label}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{method.formula}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Key assumptions
          </h4>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Material weights, values, and CO₂e factors are illustrative demo values.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Waste avoided assumes 100% of transferred material would otherwise be landfilled.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              CO₂e avoided uses generic emission factors, not project-specific LCAs.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Values are in Ethiopian Birr (ETB) for demo purposes.
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              No transport emissions are subtracted from CO₂e avoided.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function ImpactPageHeader() {
  return (
    <div>
      <div className="page-eyebrow">
        <BarChart3 className="h-3.5 w-3.5" />
        Measurement
      </div>
      <h1 className="page-title">Impact</h1>
      <p className="page-description">
        Environmental and economic impact of material transfers. All figures are derived from
        deterministic calculations using demo factor tables.
      </p>
    </div>
  );
}

const accentStyles = {
  primary: { tile: 'bg-primary/10', icon: 'text-primary' },
  success: { tile: 'bg-success/15', icon: 'text-success' },
  warning: { tile: 'bg-warning/15', icon: 'text-warning' },
  destructive: { tile: 'bg-destructive/10', icon: 'text-destructive' },
} as const;

function MetricCard({
  title,
  value,
  icon,
  description,
  provenance,
  accent,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  provenance?: string;
  accent?: keyof typeof accentStyles;
}) {
  const styles = accentStyles[accent ?? 'primary'];
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums">{value}</p>
            {description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>}
            {provenance && (
              <Badge variant="secondary" className={cn('mt-2', PROVENANCE_COLORS[provenance])}>
                {provenance}
              </Badge>
            )}
          </div>
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', styles.tile)}>
            <span className={styles.icon}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}