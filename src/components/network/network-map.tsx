'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, TrendingUp } from 'lucide-react';
import { SEED_PROJECTS, getInventoryByProject, getDemandsByProject } from '@/lib/data/seed';
import { Project, ProjectType, ProjectStatus } from '@/lib/types';

const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  residential: 'bg-blue-500',
  commercial: 'bg-purple-500',
  infrastructure: 'bg-orange-500',
  mixed_use: 'bg-teal-500',
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  near_completion: 'Near Completion',
  starting: 'Starting',
};

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  infrastructure: 'Infrastructure',
  mixed_use: 'Mixed Use',
};

interface ProjectMarkerProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

function ProjectMarker({ project, isSelected, onClick, style }: ProjectMarkerProps) {
  const hasSupply = true;
  const hasDemand = true;

  let markerColor = 'bg-muted-foreground';
  if (hasSupply && hasDemand) markerColor = 'bg-warning';
  else if (hasSupply) markerColor = 'bg-success';
  else if (hasDemand) markerColor = 'bg-blue-500';

  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        'group relative z-10 flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-150',
        isSelected ? 'scale-125' : 'hover:scale-110'
      )}
      aria-label={project.name}
      aria-pressed={isSelected}
    >
      <span
        className={cn(
          'absolute inline-flex h-5 w-5 rounded-full opacity-40',
          isSelected ? 'animate-ping bg-primary/50' : 'hidden'
        )}
      />
      <span
        className={cn(
          'relative h-3 w-3 rounded-full ring-2 ring-background transition-colors',
          markerColor,
          isSelected && 'ring-primary'
        )}
      />
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] font-medium text-foreground shadow-[var(--shadow-popover)] transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        {project.name}
      </span>
    </button>
  );
}

export function NetworkMap({
  projects,
  selectedProjectId,
  onSelectProject,
}: {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current && !mapLoaded) {
      setMapLoaded(true);
    }
  }, [mapLoaded]);

  const lats = projects.map((p) => p.latitude);
  const lngs = projects.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const getPosition = (lat: number, lng: number) => {
    const width = 100;
    const height = 100;
    const padding = 10;
    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding) + padding;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * (height - 2 * padding) + padding;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div
      ref={mapRef}
      className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-muted/20"
    >
      {/* Faint grid backdrop */}
      <div className="grid-tint absolute inset-0 opacity-50" aria-hidden="true" />
      {/* Coordinate frame */}
      <div className="absolute inset-3 rounded-md border border-border/40" aria-hidden="true" />

      {projects.map((project) => {
        const pos = getPosition(project.latitude, project.longitude);
        return (
          <ProjectMarker
            key={project.id}
            project={project}
            isSelected={selectedProjectId === project.id}
            onClick={() => onSelectProject(project.id)}
            style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)' } as React.CSSProperties}
          />
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-border/60 bg-background/90 px-3 py-2 text-xs backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" />
          Supply
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Demand
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" />
          Both
        </span>
        <span className="hidden text-muted-foreground sm:inline">{projects.length} sites</span>
      </div>
    </div>
  );
}

export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
}: {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
}) {
  return (
    <div className="max-h-[440px] space-y-1.5 overflow-y-auto p-1">
      {projects.map((project) => {
        const isSelected = selectedProjectId === project.id;
        return (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={cn(
              'w-full rounded-lg border p-3 text-left transition-colors',
              isSelected
                ? 'border-primary bg-primary/[0.04]'
                : 'border-border/70 hover:bg-accent'
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', PROJECT_TYPE_COLORS[project.type])} />
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', isSelected ? 'text-foreground' : 'text-foreground')}>
                  {project.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {project.location} · {PROJECT_TYPE_LABELS[project.type]}
                </p>
              </div>
              <Badge variant={isSelected ? 'secondary' : 'outline'} className="text-[10px]">
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ProjectDetail({ project }: { project: Project | null }) {
  if (!project) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <MapPin className="mx-auto mb-4 h-12 w-12 opacity-40" />
        <p>Select a project to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white', PROJECT_TYPE_COLORS[project.type])}>
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.location}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{PROJECT_TYPE_LABELS[project.type]}</Badge>
            <Badge variant="secondary">{PROJECT_STATUS_LABELS[project.status]}</Badge>
          </div>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{project.description}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-border/70 p-3">
          <span className="text-xs text-muted-foreground">Latitude</span>
          <div className="mt-0.5 font-mono text-xs tabular-nums">{project.latitude.toFixed(4)}</div>
        </div>
        <div className="rounded-lg border border-border/70 p-3">
          <span className="text-xs text-muted-foreground">Longitude</span>
          <div className="mt-0.5 font-mono text-xs tabular-nums">{project.longitude.toFixed(4)}</div>
        </div>
      </div>
      <div className="space-y-2 border-t border-border/70 pt-4">
        <div className="flex items-center gap-3 text-sm">
          <Package className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Surplus inventory</span>
          <span className="ml-auto font-medium tabular-nums">
            {getInventoryByProject(project.id).length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Active demands</span>
          <span className="ml-auto font-medium tabular-nums">
            {getDemandsByProject(project.id).length}
          </span>
        </div>
      </div>
    </div>
  );
}