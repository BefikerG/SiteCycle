import {
  MaterialKey,
  MaterialCondition,
  InventoryItem,
  DemandItem,
  Project,
  FactorBreakdown,
  MaterialMatchScore,
  MatchCandidate,
} from '@/lib/types';
import {
  haversineDistance,
  calculateDistanceFactor,
  MAX_TRANSFER_RADIUS_KM,
  MIN_QUANTITY_COVERAGE,
  MIN_VIABLE_MATCH_SCORE,
} from '@/lib/geo/haversine';
import { getMaterial } from '@/lib/materials/taxonomy';

export function calculateConditionFactor(condition: MaterialCondition): number {
  switch (condition) {
    case 'good':
      return 1.0;
    case 'fair':
      return 0.75;
    case 'poor':
      return 0.3;
    case 'unknown':
    default:
      return 0.5;
  }
}

export function calculateUrgencyFactor(
  availableDate: Date | null,
  neededBy: Date | null
): number {
  if (!neededBy) return 0.9;
  if (!availableDate) return 0.7;

  const diffDays = Math.floor(
    (neededBy.getTime() - availableDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays >= 7) return 1.0;
  if (diffDays >= 0) return 0.85;
  if (diffDays >= -7) return 0.5;
  return 0.2;
}

export function calculateQuantityCoverage(
  available: number,
  needed: number
): number {
  if (needed <= 0) return 0;
  return Math.min(available / needed, 1.0);
}

export function calculateMaterialMatchScore(
  inventory: InventoryItem,
  demand: DemandItem,
  sourceProject: Project,
  destProject: Project
): MaterialMatchScore | null {
  if (inventory.materialKey !== demand.materialKey) return null;

  const coverage = calculateQuantityCoverage(inventory.quantity, demand.quantity);
  if (coverage < MIN_QUANTITY_COVERAGE) return null;

  const distanceKm = haversineDistance(
    sourceProject.latitude,
    sourceProject.longitude,
    destProject.latitude,
    destProject.longitude
  );

  if (distanceKm > MAX_TRANSFER_RADIUS_KM) return null;

  const distanceFactor = calculateDistanceFactor(distanceKm);
  const conditionFactor = calculateConditionFactor(inventory.condition);
  const urgencyFactor = calculateUrgencyFactor(inventory.availableDate, demand.neededBy);

  const factorBreakdown: FactorBreakdown = {
    materialCompatibility: 1.0,
    quantityCoverage: coverage,
    distanceFactor,
    conditionFactor,
    urgencyFactor,
  };

  const score = Math.round(
    100 *
      (0.30 * factorBreakdown.materialCompatibility +
        0.25 * factorBreakdown.quantityCoverage +
        0.20 * factorBreakdown.distanceFactor +
        0.15 * factorBreakdown.conditionFactor +
        0.10 * factorBreakdown.urgencyFactor)
  );

  const material = getMaterial(inventory.materialKey);
  let urgencyStatus = 'flexible';
  if (demand.neededBy && inventory.availableDate) {
    const diffDays = Math.floor(
      (demand.neededBy.getTime() - inventory.availableDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays >= 7) urgencyStatus = 'comfortable';
    else if (diffDays >= 0) urgencyStatus = 'tight';
    else if (diffDays >= -7) urgencyStatus = 'late';
    else urgencyStatus = 'very late';
  } else if (demand.neededBy) {
    urgencyStatus = 'deadline set';
  }

  return {
    materialKey: inventory.materialKey,
    materialName: material?.name ?? inventory.materialKey,
    availableQuantity: inventory.quantity,
    neededQuantity: demand.quantity,
    coverage,
    distanceKm,
    condition: inventory.condition,
    urgencyStatus,
    score,
    factorBreakdown,
  };
}

export function aggregateProjectScore(materialScores: MaterialMatchScore[]): number {
  if (materialScores.length === 0) return 0;

  const sorted = [...materialScores].sort((a, b) => b.score - a.score);
  const topScores = sorted.slice(0, 3);
  const base = topScores.reduce((sum, m) => sum + m.score, 0) / topScores.length;
  const bonus = Math.min((materialScores.length - 1) * 2, 6);
  return Math.min(Math.round(base + bonus), 100);
}

export function findMatches(
  sourceProjectId: string,
  inventoryItems: InventoryItem[],
  allProjects: Project[],
  allDemands: DemandItem[]
): MatchCandidate[] {
  const sourceProject = allProjects.find((p) => p.id === sourceProjectId);
  if (!sourceProject) return [];

  const candidates: MatchCandidate[] = [];

  for (const destProject of allProjects) {
    if (destProject.id === sourceProjectId) continue;

    const projectDemands = allDemands.filter((d) => d.projectId === destProject.id);
    if (projectDemands.length === 0) continue;

    const materialScores: MaterialMatchScore[] = [];

    for (const inventory of inventoryItems) {
      for (const demand of projectDemands) {
        const score = calculateMaterialMatchScore(
          inventory,
          demand,
          sourceProject,
          destProject
        );
        if (score) {
          materialScores.push(score);
        }
      }
    }

    if (materialScores.length === 0) continue;

    const projectScore = aggregateProjectScore(materialScores);

    if (projectScore >= MIN_VIABLE_MATCH_SCORE) {
      const avgDistance =
        materialScores.reduce((sum, m) => sum + m.distanceKm, 0) / materialScores.length;
      candidates.push({
        sourceProjectId,
        project: destProject,
        score: projectScore,
        materialScores,
        distanceKm: Math.round(avgDistance * 10) / 10,
      });
    }
  }

  return candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.distanceKm - b.distanceKm;
  });
}

export function findAllMatchesForInventory(
  inventoryItems: InventoryItem[],
  allProjects: Project[],
  allDemands: DemandItem[]
): MatchCandidate[] {
  const allCandidates: MatchCandidate[] = [];

  for (const project of allProjects) {
    const projectInventory = inventoryItems.filter((i) => i.projectId === project.id);
    if (projectInventory.length === 0) continue;

    const matches = findMatches(project.id, projectInventory, allProjects, allDemands);
    allCandidates.push(...matches);
  }

  return allCandidates.sort((a, b) => b.score - a.score);
}