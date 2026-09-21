'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, ArrowRight, RefreshCw, Target, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { findAllMatchesAction } from '@/app/actions';
import { MatchCandidate, MaterialMatchScore } from '@/lib/types';
import { SEED_PROJECTS } from '@/lib/data/seed';

function getScoreTone(score: number) {
  if (score >= 70)
    return { badge: 'bg-success/15 text-success', bar: 'bg-success', label: 'Strong' };
  if (score >= 50)
    return { badge: 'bg-warning/15 text-warning', bar: 'bg-warning', label: 'Moderate' };
  return { badge: 'bg-destructive/10 text-destructive', bar: 'bg-destructive', label: 'Weak' };
}

function conditionTone(condition: string) {
  if (condition === 'good') return 'bg-success';
  if (condition === 'fair') return 'bg-warning';
  if (condition === 'poor') return 'bg-destructive';
  return 'bg-muted-foreground';
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterMinScore, setFilterMinScore] = useState<string>('0');

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const data = await findAllMatchesAction();
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) => {
    if (filterProject !== 'all' && match.project.id !== filterProject) return false;
    if (match.score < Number(filterMinScore)) return false;
    return true;
  });

  return (
    <div className="container-padded section-spacing">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="page-eyebrow">
            <Target className="h-3.5 w-3.5" />
            Deterministic matching
          </div>
          <h1 className="page-title">Matches</h1>
          <p className="page-description">
            Ranked by material compatibility, quantity coverage, distance, condition, and urgency.
            Scores are reproducible — AI never influences the result.
          </p>
        </div>
        <Button
          onClick={loadMatches}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto"
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-6 mt-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="mt-8">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Project
              </span>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {SEED_PROJECTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Min score
              </span>
              <Select value={filterMinScore} onValueChange={setFilterMinScore}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All scores</SelectItem>
                  <SelectItem value="50">50+ · Viable</SelectItem>
                  <SelectItem value="70">70+ · Strong</SelectItem>
                  <SelectItem value="85">85+ · Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground sm:text-right">
            {filteredMatches.length} of {matches.length} matches shown
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="mt-6">
          <CardContent className="py-16 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Loading matches…</p>
          </CardContent>
        </Card>
      ) : filteredMatches.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No matches found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {matches.length === 0
                ? 'No viable matches in the network yet. Declare surplus materials to generate matches.'
                : 'Adjust the filters to see more matches.'}
            </p>
            {matches.length === 0 && (
              <Link href="/materials/new" className="mt-5 inline-block">
                <Button className="gap-2">
                  Declare Surplus
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-6">
          {filteredMatches.map((match) => {
            const tone = getScoreTone(match.score);
            return (
              <Card key={match.project.id} className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/matches/${match.project.id}`}
                        className="truncate text-base font-semibold text-foreground hover:text-primary"
                      >
                        {match.project.name}
                      </Link>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {match.project.location}
                        <span aria-hidden="true">·</span>
                        {match.project.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <Badge className={cn('px-2.5 py-0.5 text-sm font-semibold', tone.badge)}>
                        {match.score}% match
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tone.label} · {match.project.status.replace('_', ' ')} ·{' '}
                        <span className="tabular-nums">{match.distanceKm.toFixed(1)} km</span>
                      </p>
                    </div>
                    <Link href={`/matches/${match.project.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead className="text-right">Needed</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead className="text-right">Distance</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {match.materialScores.map((ms: MaterialMatchScore) => {
                        const materialTone = getScoreTone(ms.score);
                        return (
                          <TableRow key={ms.materialKey}>
                            <TableCell className="font-medium">{ms.materialName}</TableCell>
                            <TableCell className="text-right tabular-nums">
                              {ms.availableQuantity.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {ms.neededQuantity.toLocaleString()}
                            </TableCell>
                            <TableCell className="min-w-[140px]">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className={cn('h-full rounded-full', tone.bar)}
                                    style={{ width: `${Math.round(ms.coverage * 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium tabular-nums">
                                  {Math.round(ms.coverage * 100)}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs tabular-nums">
                              {ms.distanceKm.toFixed(1)} km
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1.5 text-sm">
                                <span className={cn('h-1.5 w-1.5 rounded-full', conditionTone(ms.condition))} />
                                {ms.condition.charAt(0).toUpperCase() + ms.condition.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {ms.urgencyStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', materialTone.badge)}>
                                {ms.score}%
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}