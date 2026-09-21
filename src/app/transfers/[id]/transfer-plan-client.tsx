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
  Truck,
} from 'lucide-react';

import { MatchCandidate, Transfer } from '@/lib/types';
import { createTransferAction } from '@/app/actions';
import { SEED_PROJECTS } from '@/lib/data/seed';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TransferPlanClientProps {
  match: MatchCandidate;
}

export function TransferPlanClient({ match }: TransferPlanClientProps) {
  const sourceProject = SEED_PROJECTS.find((p) => p.id === match.sourceProjectId);
  const sourceProjectName = sourceProject?.name || 'Source Project';

  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isGettingRecommendation, setIsGettingRecommendation] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  const materials = match.materialScores.map((material) => ({
    materialKey: material.materialKey,
    quantity: Math.min(
      material.availableQuantity,
      material.neededQuantity
    ),
    name: material.materialName,
    unit:
      material.availableQuantity === material.neededQuantity
        ? 'requested'
        : 'available',
    available: material.availableQuantity,
    needed: material.neededQuantity,
  }));

  async function createPlan() {
    try {
      setIsCreating(true);
      setError(null);

      const created = await createTransferAction(
        match.sourceProjectId,
        match.project.id,
        materials.map((material) => ({
          materialKey: material.materialKey,
          quantity: material.quantity,
        })),
        match.score,
        match.distanceKm
      );

      setTransfer(created);
    } catch (err) {
      console.error(err);
      setError('Could not create the transfer plan. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  async function getAIRecommendation() {
    try {
      setIsGettingRecommendation(true);
      setRecommendationError(null);
      setRecommendation(null);

      const response = await fetch('/api/ai/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error(err);
      setRecommendationError(
        'AI recommendation unavailable. Using deterministic analysis above.'
      );
    } finally {
      setIsGettingRecommendation(false);
    }
  }

  if (transfer) {
    return (
      <div className="container-padded section-spacing">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/matches/${match.project.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to match
          </Link>

          <Card className="mt-6 overflow-hidden">
            <div className="h-1 bg-success" />
            <CardContent className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight">
                Transfer plan created
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                The proposed transfer has been created and is ready for review.
              </p>

              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link href={`/transfers/${match.project.id}`}>
                  <Button variant="outline">View plan</Button>
                </Link>
                <Link href="/impact">
                  <Button className="gap-2">
                    View impact
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 text-xs tabular-nums text-muted-foreground">
                Transfer ID: {transfer.id}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container-padded section-spacing">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/matches/${match.project.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to match
        </Link>

        <div className="mt-6">
          <div className="page-eyebrow">
            <Truck className="h-3.5 w-3.5" />
            Transfer planning
          </div>
          <h1 className="page-title">Proposed material transfer</h1>
          <p className="page-description">
            Review the proposed quantities before creating the transfer plan. SiteCycle uses the
            deterministic match data to prepare this plan.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold tracking-tight">Transfer route</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="rounded-lg border border-border/70 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Source
                    </div>
                    <div className="mt-1 font-medium">{sourceProjectName}</div>
                  </div>

                  <div className="hidden h-px w-8 bg-border sm:block" aria-hidden="true" />
                  <ArrowRight className="hidden h-5 w-5 text-muted-foreground sm:block" />
                  <div className="hidden h-px w-8 bg-border sm:block" aria-hidden="true" />

                  <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Destination
                    </div>
                    <div className="mt-1 font-medium">{match.project.name}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="gap-1.5">
                    <Ruler className="h-3.5 w-3.5" />
                    <span className="tabular-nums">{match.distanceKm.toFixed(1)} km</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1.5 tabular-nums">
                    {match.score}% match
                  </Badge>
                  <Badge variant="secondary">Proposed</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold tracking-tight">Materials to transfer</h2>
                <div className="mt-5 space-y-3">
                  {materials.map((material) => (
                    <div
                      key={material.materialKey}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border/70 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{material.name}</div>
                          <div className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                            {material.available.toLocaleString()} available
                            <span aria-hidden="true"> · </span>
                            {material.needed.toLocaleString()} needed
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-semibold tabular-nums">
                          {material.quantity.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">transfer quantity</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold tracking-tight">Recommendation</h2>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Transfer the available quantity up to the destination's current demand. This
                  proposal is based on the deterministic match calculation and can be reviewed
                  before confirmation.
                </p>

                <Separator className="my-5" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Match score</span>
                    <span className="font-medium tabular-nums">{match.score}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-medium tabular-nums">
                      {match.distanceKm.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Materials</span>
                    <span className="font-medium tabular-nums">{materials.length}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  className="mt-5 w-full gap-2"
                  onClick={createPlan}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating plan…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Create Transfer Plan
                    </>
                  )}
                </Button>

                <Separator className="my-5" />

                <div className="space-y-3">
                  {recommendation && (
                    <div className="rounded-lg border border-primary/20 bg-primary/[0.05] p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">AI Recommendation</span>
                      </div>
                      <p className="mt-2 text-sm leading-6">{recommendation}</p>
                    </div>
                  )}

                  {recommendationError && (
                    <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                      {recommendationError}
                    </div>
                  )}

                  {!recommendation && !isGettingRecommendation && !recommendationError && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={getAIRecommendation}
                      disabled={isGettingRecommendation}
                    >
                      {isGettingRecommendation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Getting recommendation…
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Get AI Recommendation
                        </>
                      )}
                    </Button>
                  )}

                  {isGettingRecommendation && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating recommendation…
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  No payment, order, or logistics commitment is made.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}