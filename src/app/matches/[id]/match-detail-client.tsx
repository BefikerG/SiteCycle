'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  Ruler,
  Sparkles,
  Target,
} from 'lucide-react';

import { MatchCandidate, MatchExplanation } from '@/lib/types';
import { getMaterialDisplayName } from '@/lib/materials/taxonomy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MatchDetailClientProps {
  match: MatchCandidate;
}

function factorTone(value: number) {
  if (value >= 0.7) return 'bg-success';
  if (value >= 0.5) return 'bg-warning';
  return 'bg-destructive';
}

export function MatchDetailClient({ match }: MatchDetailClientProps) {
  const [explanation, setExplanation] = useState<MatchExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const loadExplanation = async () => {
    try {
      setIsExplaining(true);
      setExplanationError(null);

      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match }),
      });

      if (!response.ok) {
        throw new Error('Unable to generate explanation');
      }

      const data = await response.json();
      setExplanation(data);
    } catch (error) {
      console.error(error);
      setExplanationError(
        'AI explanation is unavailable. The deterministic match analysis above remains valid.'
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const topMaterial = [...match.materialScores].sort(
    (a, b) => b.score - a.score
  )[0];

  const factors = topMaterial
    ? [
        {
          label: 'Material compatibility',
          value: topMaterial.factorBreakdown.materialCompatibility,
          detail: 'Canonical material category match',
        },
        {
          label: 'Quantity coverage',
          value: topMaterial.factorBreakdown.quantityCoverage,
          detail: `${Math.round(topMaterial.coverage * 100)}% of requested quantity covered`,
        },
        {
          label: 'Distance',
          value: topMaterial.factorBreakdown.distanceFactor,
          detail: `${match.distanceKm.toFixed(1)} km between projects`,
        },
        {
          label: 'Condition',
          value: topMaterial.factorBreakdown.conditionFactor,
          detail: topMaterial.condition,
        },
        {
          label: 'Urgency',
          value: topMaterial.factorBreakdown.urgencyFactor,
          detail: topMaterial.urgencyStatus,
        },
      ]
    : [];

  return (
    <div className="container-padded section-spacing">
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </Link>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="page-eyebrow">
            <Target className="h-3.5 w-3.5" />
            Match analysis
          </div>
          <h1 className="page-title">{match.project.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {match.project.location}
            <span aria-hidden="true">·</span>
            {match.project.type.replace('_', ' ')}
            <span aria-hidden="true">·</span>
            {match.project.status.replace('_', ' ')}
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-card px-6 py-4 shadow-[var(--shadow-card)]">
            <div className="text-right">
              <div className="text-4xl font-bold leading-none tracking-tight tabular-nums">
                {match.score}
                <span className="text-lg text-muted-foreground">%</span>
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                Deterministic match score
              </div>
            </div>
            <div className="h-10 w-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'w-full rounded-full',
                  match.score >= 70 ? 'bg-success' : match.score >= 50 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ height: `${Math.min(match.score, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Why this match?</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The score is calculated from five deterministic factors. AI does not influence
                    the numeric result.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {factors.map((factor) => {
                  const percentage = Math.round(factor.value * 100);
                  return (
                    <div
                      key={factor.label}
                      className="flex items-center gap-4 rounded-lg border border-border/70 p-4"
                    >
                      <CheckCircle2
                        className={cn(
                          'h-5 w-5 shrink-0',
                          percentage >= 70 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-destructive'
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium">{factor.label}</span>
                          <span className="font-mono text-sm tabular-nums">{percentage}%</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full', factorTone(factor.value))}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">{factor.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold tracking-tight">Material coverage</h2>
              <div className="mt-6 space-y-3">
                {match.materialScores.map((material) => {
                  const tone = material.score >= 70 ? 'bg-success' : material.score >= 50 ? 'bg-warning' : 'bg-destructive';
                  const badgeTone =
                    material.score >= 70
                      ? 'bg-success/15 text-success'
                      : material.score >= 50
                        ? 'bg-warning/15 text-warning'
                        : 'bg-destructive/10 text-destructive';
                  return (
                    <div key={material.materialKey} className="rounded-lg border border-border/70 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate font-medium">
                            {material.materialName || getMaterialDisplayName(material.materialKey)}
                          </span>
                        </div>
                        <Badge className={cn(badgeTone)}>{material.score}%</Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Available</div>
                          <div className="mt-0.5 font-medium tabular-nums">
                            {material.availableQuantity.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Needed</div>
                          <div className="mt-0.5 font-medium tabular-nums">
                            {material.neededQuantity.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Coverage</div>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn('h-full rounded-full', tone)}
                                style={{ width: `${Math.round(material.coverage * 100)}%` }}
                              />
                            </div>
                            <span className="font-medium tabular-nums">
                              {Math.round(material.coverage * 100)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Condition</div>
                          <div className="mt-0.5 font-medium capitalize">{material.condition}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Sparkles className="h-4 w-4 text-primary" />
                AI explanation
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                AI explains the deterministic facts; it does not calculate them.
              </p>

              <div className="mt-5">
                {!explanation && !isExplaining && (
                  <Button onClick={loadExplanation} variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Explain this match
                  </Button>
                )}

                {isExplaining && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating explanation…
                  </div>
                )}

                {explanationError && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    {explanationError}
                  </div>
                )}

                {explanation && (
                  <div className="space-y-4">
                    <p className="leading-7 text-foreground">{explanation.summary}</p>
                    {explanation.highlights.length > 0 && (
                      <ul className="space-y-2">
                        {explanation.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold tracking-tight">Transfer opportunity</h2>
              <div className="mt-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Destination
                    </div>
                    <div className="font-medium">{match.project.name}</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Distance
                    </div>
                    <div className="font-medium tabular-nums">
                      {match.distanceKm.toFixed(1)} km
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium">Top material</div>
                  {topMaterial && (
                    <div className="mt-2 rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="font-medium">{topMaterial.materialName}</div>
                      <div className="mt-1 text-muted-foreground tabular-nums">
                        {topMaterial.availableQuantity.toLocaleString()} available
                        <span aria-hidden="true"> · </span>
                        {topMaterial.neededQuantity.toLocaleString()} needed
                      </div>
                    </div>
                  )}
                </div>

                <Link href={`/transfers/${match.project.id}`} className="block">
                  <Button className="w-full gap-2">
                    Create Transfer Plan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold tracking-tight">Score methodology</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  Match scores combine material compatibility, quantity coverage, distance,
                  condition, and urgency.
                </p>
                <p>Scores are deterministic and reproducible. The same inputs produce the same recommendation.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}