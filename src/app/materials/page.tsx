'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, TrendingUp, ArrowRight, Layers } from 'lucide-react';
import { SEED_INVENTORY, SEED_DEMANDS, SEED_PROJECTS } from '@/lib/data/seed';
import { getMaterialDisplayName, getMaterialUnit } from '@/lib/materials/taxonomy';
import { MaterialCondition } from '@/lib/types';
import { cn } from '@/lib/utils';

const CONDITION_TONES: Record<MaterialCondition, string> = {
  good: 'bg-success',
  fair: 'bg-warning',
  poor: 'bg-destructive',
  unknown: 'bg-muted-foreground',
};

const CONDITION_LABELS: Record<MaterialCondition, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  unknown: 'Unknown',
};

export default function MaterialsPage() {
  const [filterType, setFilterType] = useState<'all' | 'surplus' | 'demand'>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const projects = SEED_PROJECTS;
  const inventory = SEED_INVENTORY;
  const demands = SEED_DEMANDS;

  const filteredInventory = inventory.filter((item) => {
    if (filterProject !== 'all' && item.projectId !== filterProject) return false;
    if (filterMaterial !== 'all' && item.materialKey !== filterMaterial) return false;
    return true;
  });

  const filteredDemands = demands.filter((demand) => {
    if (filterProject !== 'all' && demand.projectId !== filterProject) return false;
    if (filterMaterial !== 'all' && demand.materialKey !== filterMaterial) return false;
    return true;
  });

  const allMaterials = [...new Set([...inventory.map((i) => i.materialKey), ...demands.map((d) => d.materialKey)])];

  return (
    <div className="container-padded section-spacing">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="page-eyebrow">
            <Layers className="h-3.5 w-3.5" />
            Materials ledger
          </div>
          <h1 className="page-title">Materials</h1>
          <p className="page-description">
            Browse surplus inventory and material demands across the network.
          </p>
        </div>
        <Link href="/materials/new" className="self-start sm:self-auto">
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            Declare Surplus
          </Button>
        </Link>
      </div>

      <Card className="mt-8">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </span>
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as 'all' | 'surplus' | 'demand')}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="surplus">Surplus Only</SelectItem>
                  <SelectItem value="demand">Demand Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Project
              </span>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Material
              </span>
              <Select value={filterMaterial} onValueChange={setFilterMaterial}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  {allMaterials.map((m) => (
                    <SelectItem key={m} value={m}>
                      {getMaterialDisplayName(m as never)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filterType !== 'demand' && (
        <Card className="mt-6">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15">
                  <Package className="h-4 w-4 text-success" />
                </span>
                Surplus Inventory
              </CardTitle>
              <Badge variant="secondary" className="tabular-nums">
                {filteredInventory.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredInventory.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No surplus items match the current filters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => {
                      const project = projects.find((p) => p.id === item.projectId);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {getMaterialDisplayName(item.materialKey)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {item.quantity.toLocaleString()}{' '}
                            <span className="text-xs text-muted-foreground">
                              {getMaterialUnit(item.materialKey)}
                            </span>
                          </TableCell>
                          <TableCell>{project?.name ?? 'Unknown'}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5 text-sm">
                              <span
                                className={cn('h-1.5 w-1.5 rounded-full', CONDITION_TONES[item.condition])}
                              />
                              {CONDITION_LABELS[item.condition]}
                            </span>
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {item.availableDate
                              ? new Date(item.availableDate).toLocaleDateString()
                              : 'ASAP'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="success">Available</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {filterType !== 'surplus' && (
        <Card className="mt-6">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </span>
                Active Demands
              </CardTitle>
              <Badge variant="secondary" className="tabular-nums">
                {filteredDemands.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDemands.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No demands match the current filters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity Needed</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Needed By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDemands.map((demand) => {
                      const project = projects.find((p) => p.id === demand.projectId);
                      return (
                        <TableRow key={demand.id}>
                          <TableCell className="font-medium">
                            {getMaterialDisplayName(demand.materialKey)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {demand.quantity.toLocaleString()}{' '}
                            <span className="text-xs text-muted-foreground">
                              {getMaterialUnit(demand.materialKey)}
                            </span>
                          </TableCell>
                          <TableCell>{project?.name ?? 'Unknown'}</TableCell>
                          <TableCell className="tabular-nums">
                            {demand.neededBy
                              ? new Date(demand.neededBy).toLocaleDateString()
                              : 'Flexible'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Open</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {filterType === 'all' && (
        <div className="mt-8 flex items-center justify-between rounded-xl border border-dashed border-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Have surplus material on site?</p>
              <p className="text-sm text-muted-foreground">
                Add it to the ledger and let the match engine find it a home.
              </p>
            </div>
          </div>
          <Link href="/materials/new">
            <Button size="sm" className="gap-2">
              Declare Surplus
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}