'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkMap, ProjectList, ProjectDetail } from '@/components/network/network-map';
import { SEED_PROJECTS } from '@/lib/data/seed';
import { MapPin, Package, TrendingUp, List, Globe2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NetworkPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    SEED_PROJECTS[0]?.id || null
  );
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const selectedProject =
    SEED_PROJECTS.find((p) => p.id === selectedProjectId) || null;

  return (
    <div className="container-padded section-spacing">
      <div>
        <div className="page-eyebrow">
          <Globe2 className="h-3.5 w-3.5" />
          Addis Ababa network
        </div>
        <h1 className="page-title">Network</h1>
        <p className="page-description">
          Explore the construction network geographically or as a list. Select a project to see
          its surplus inventory and material demands.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 pb-0">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Project Map
              </CardTitle>
              <div className="rounded-lg border border-border/70 p-0.5">
                <Button
                  variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-3.5 w-3.5" />
                  List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              {viewMode === 'map' ? (
                <NetworkMap
                  projects={SEED_PROJECTS}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                />
              ) : (
                <ProjectList
                  projects={SEED_PROJECTS}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <ProjectDetail project={selectedProject} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              <Link href="/materials/new" className="block">
                <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 transition-colors hover:border-primary/40 hover:bg-accent">
                  <span className="flex items-center gap-2.5 text-sm font-medium">
                    <Package className="h-4 w-4 text-primary" />
                    Declare Surplus
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/materials" className="block">
                <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 transition-colors hover:border-primary/40 hover:bg-accent">
                  <span className="flex items-center gap-2.5 text-sm font-medium">
                    <List className="h-4 w-4 text-primary" />
                    Browse All Materials
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/matches" className="block">
                <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 transition-colors hover:border-primary/40 hover:bg-accent">
                  <span className="flex items-center gap-2.5 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    View Matches
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}