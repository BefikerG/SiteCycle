import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewStats } from '@/components/overview/stats-cards';
import {
  ArrowRight,
  Package,
  Search,
  MapPin,
  Sparkles,
  FileText,
  Crosshair,
  Scale,
} from 'lucide-react';
import Link from 'next/link';
import { getProjectsAction, getInventoryAction, getDemandsAction } from '@/app/actions';

async function getOverviewData() {
  const [projects, inventory, demands] = await Promise.all([
    getProjectsAction(),
    getInventoryAction(),
    getDemandsAction(),
  ]);

  const surplusItems = inventory.length;
  const activeDemands = demands.length;

  let potentialValue = 0;
  let potentialCo2e = 0;

  for (const item of inventory) {
    potentialValue += item.quantity * 100;
    potentialCo2e += item.quantity * 50;
  }

  return {
    projects: projects.length,
    surplusItems,
    activeDemands,
    potentialValue,
    potentialCo2e,
  };
}

const STEPS = [
  {
    icon: Package,
    title: 'Declare Surplus',
    body: 'Describe leftover materials in plain language. AI extracts structured, reviewable data.',
  },
  {
    icon: Crosshair,
    title: 'Match Demand',
    body: 'A deterministic engine ranks nearby projects by material, quantity, distance, condition, and urgency.',
  },
  {
    icon: FileText,
    title: 'Plan Transfer',
    body: 'Review proposed quantities and generate a transfer plan with an AI narrative.',
  },
  {
    icon: Scale,
    title: 'Measure Impact',
    body: 'See recovered value, waste avoided, and CO₂e — every figure labelled by provenance.',
  },
];

export default async function OverviewPage() {
  const stats = await getOverviewData();

  return (
    <div className="container-padded section-spacing">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
        <div className="grid-tint pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-success/10 blur-3xl" aria-hidden="true" />

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
          <div className="page-eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Circular material intelligence
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Put surplus materials to  <br />their next job.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Declare leftover construction materials, discover nearby demand before it becomes waste, and
            measure the value you keep in circulation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/materials/new">
              <Button size="lg" className="gap-2">
                <Package className="h-5 w-5" aria-hidden="true" />
                Declare Surplus
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/matches">
              <Button size="lg" variant="outline" className="gap-2">
                <Search className="h-4 w-4" aria-hidden="true" />
                View Matches
              </Button>
            </Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <dt className="font-medium text-foreground">{stats.projects}</dt>
              <dd>active projects</dd>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <dt className="font-medium text-foreground">{stats.surplusItems}</dt>
              <dd>surplus items</dd>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <dt className="font-medium text-foreground">{stats.activeDemands}</dt>
              <dd>active demands</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* KPIs */}
      <section className="mt-8">
        <OverviewStats stats={stats} />
      </section>

      {/* How it works + network snapshot */}
      <section className="mt-12 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-primary" />
              The following journey
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              From surplus pile to proven impact in four steps.
            </p>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-0">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative flex gap-4 pb-9 last:pb-0">
                  {index < STEPS.length - 1 && (
                    <span
                      className="absolute left-[19px] top-11 h-[calc(100%-2.5rem)] w-px bg-border"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background shadow-[var(--shadow-card)]">
                    <step.icon className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="flex items-center gap-2 font-medium text-foreground">
                      {step.title}
                      <span className="text-xs font-semibold text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </p>
                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Demo Network
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                A seeded Addis Ababa network spanning Bole, Kality, CMC, Summit, Ayat, Gerji, and Lebu.
              </p>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href="/network" className="block">
                <Button variant="outline" className="w-full justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    View Network Map
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Button>
              </Link>
              <Link href="/materials" className="block">
                <Button variant="outline" className="w-full justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Browse Materials
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Button>
              </Link>
              <Link href="/matches" className="block">
                <Button variant="outline" className="w-full justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    See All Matches
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/[0.04]">
            <CardContent className="pt-6">
              <div>
                <div className="page-eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Get started
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight">
                  Have material left on site?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start the journey and find the next project for your surplus before it becomes waste.
                </p>
                <Link href="/materials/new" className="mt-5 block">
                  <Button className="w-full gap-2">
                    <Package className="h-4 w-4" />
                    Declare Surplus
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}