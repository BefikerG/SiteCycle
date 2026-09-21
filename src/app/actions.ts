'use server';

import { findMatches, findAllMatchesForInventory } from '@/lib/matching/engine';
import { calculateTransferImpact, calculateAggregateImpact, getImpactProvenance } from '@/lib/impact/calculate';
import {
  SEED_PROJECTS,
  SEED_INVENTORY,
  SEED_DEMANDS,
  getProjectById,
  getInventoryByProject,
  getDemandsByProject,
  getAllInventory,
  getAllDemands,
} from '@/lib/data/seed';
import { Project, InventoryItem, DemandItem, Transfer, TransferMaterial, MaterialKey, MaterialCondition } from '@/lib/types';
import { getMaterial } from '@/lib/materials/taxonomy';

let transfersStore: Transfer[] = [];

export async function findMatchesAction(sourceProjectId: string, inventoryIds: string[]) {
  const inventoryItems = SEED_INVENTORY.filter((i) => inventoryIds.includes(i.id));
  if (inventoryItems.length === 0) return [];

  const matches = findMatches(sourceProjectId, inventoryItems, SEED_PROJECTS, SEED_DEMANDS);
  return matches;
}

export async function findAllMatchesAction() {
  return findAllMatchesForInventory(SEED_INVENTORY, SEED_PROJECTS, SEED_DEMANDS);
}

export async function getProjectsAction() {
  return SEED_PROJECTS;
}

export async function getProjectAction(id: string) {
  return getProjectById(id);
}

export async function getInventoryAction(projectId?: string) {
  if (projectId) return getInventoryByProject(projectId);
  return SEED_INVENTORY;
}

export async function getDemandsAction(projectId?: string) {
  if (projectId) return getDemandsByProject(projectId);
  return SEED_DEMANDS;
}

export async function createInventoryAction(
  projectId: string,
  items: { materialKey: MaterialKey; quantity: number; condition: MaterialCondition; availableDate: string | null; rawDescription: string }[]
) {
  const newItems: InventoryItem[] = items.map((item, index) => ({
    id: `inv-${projectId}-${Date.now()}-${index}`,
    projectId,
    materialKey: item.materialKey,
    quantity: item.quantity,
    condition: item.condition,
    availableDate: item.availableDate ? new Date(item.availableDate) : null,
    rawDescription: item.rawDescription,
  }));

  SEED_INVENTORY.push(...newItems);
  return newItems;
}

export async function createTransferAction(
  sourceProjectId: string,
  destinationProjectId: string,
  materials: TransferMaterial[],
  matchScore: number,
  distanceKm: number
) {
  const sourceProject = getProjectById(sourceProjectId);
  const destProject = getProjectById(destinationProjectId);

  if (!sourceProject || !destProject) {
    throw new Error('Invalid project IDs');
  }

  const transfer: Transfer = {
    id: `transfer-${Date.now()}`,
    sourceProjectId,
    destinationProjectId,
    status: 'proposed',
    materials,
    matchScore,
    distanceKm,
    createdAt: new Date(),
  };

  transfersStore.push(transfer);
  return transfer;
}

export async function getTransfersAction() {
  return transfersStore;
}

export async function getTransferAction(id: string) {
  return transfersStore.find((t) => t.id === id);
}

export async function updateTransferStatusAction(id: string, status: Transfer['status']) {
  const transfer = transfersStore.find((t) => t.id === id);
  if (transfer) {
    transfer.status = status;
  }
  return transfer;
}

export async function getImpactAction(transferId?: string) {
  if (transferId) {
    const transfer = transfersStore.find((t) => t.id === transferId);
    if (!transfer) return null;

    const sourceProject = getProjectById(transfer.sourceProjectId);
    const destProject = getProjectById(transfer.destinationProjectId);
    if (!sourceProject || !destProject) return null;

    const impact = calculateTransferImpact(transfer, sourceProject.name, destProject.name);
    const provenance = getImpactProvenance();
    return { impact, provenance };
  }

  const allImpacts = transfersStore.map((transfer) => {
    const sourceProject = getProjectById(transfer.sourceProjectId);
    const destProject = getProjectById(transfer.destinationProjectId);
    if (!sourceProject || !destProject) return null;
    return calculateTransferImpact(transfer, sourceProject.name, destProject.name);
  }).filter(Boolean) as any[];

  const aggregate = calculateAggregateImpact(allImpacts);
  const provenance = getImpactProvenance();
  return { transfers: allImpacts, aggregate, provenance };
}

export async function getMaterialInfoAction(materialKey: MaterialKey) {
  return getMaterial(materialKey);
}