import { Project, InventoryItem, DemandItem, MaterialKey, MaterialCondition } from '@/lib/types';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'bole-commercial',
    name: 'Bole Commercial Center',
    type: 'commercial',
    status: 'active',
    latitude: 8.9908,
    longitude: 38.7875,
    location: 'Bole',
    description: 'Mid-size commercial office complex in Bole business district. Phase 2 structural work recently completed, leaving surplus masonry and structural materials.',
  },
  {
    id: 'kality-residential',
    name: 'Kality Residential Development',
    type: 'residential',
    status: 'active',
    latitude: 8.8872,
    longitude: 38.8125,
    location: 'Kality',
    description: 'Large-scale affordable housing project in Kality. Currently in wall construction phase with high demand for masonry units and structural materials.',
  },
  {
    id: 'cmc-office',
    name: 'CMC Office Complex',
    type: 'commercial',
    status: 'near_completion',
    latitude: 9.0092,
    longitude: 38.7536,
    location: 'CMC',
    description: 'Office tower near completion in CMC area. Finishing work underway with surplus finishing materials and some structural surplus.',
  },
  {
    id: 'summit-mixed',
    name: 'Summit Mixed-Use Development',
    type: 'mixed_use',
    status: 'active',
    latitude: 9.0256,
    longitude: 38.7689,
    location: 'Summit',
    description: 'Mixed-use retail and residential development. Early structural phase with demand for steel and concrete materials.',
  },
  {
    id: 'ayat-housing',
    name: 'Ayat Housing Project',
    type: 'residential',
    status: 'starting',
    latitude: 8.9542,
    longitude: 38.8321,
    location: 'Ayat',
    description: 'New residential development in Ayat. Site preparation complete, foundation and wall construction about to begin.',
  },
  {
    id: 'gerji-commercial',
    name: 'Gerji Commercial Development',
    type: 'commercial',
    status: 'active',
    latitude: 8.9825,
    longitude: 38.8456,
    location: 'Gerji',
    description: 'Commercial plaza development in Gerji. Superstructure phase with demand for steel beams and concrete materials.',
  },
  {
    id: 'lebu-industrial',
    name: 'Lebu Industrial Expansion',
    type: 'infrastructure',
    status: 'active',
    latitude: 8.8456,
    longitude: 38.8678,
    location: 'Lebu',
    description: 'Industrial facility expansion in Lebu. Heavy structural work with demand for reinforcement steel and structural steel.',
  },
];

export const SEED_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-bole-blocks',
    projectId: 'bole-commercial',
    materialKey: 'concrete_block',
    quantity: 1200,
    condition: 'good',
    availableDate: new Date('2026-01-20'),
    rawDescription: '1,200 hollow blocks from over-order on Phase 2',
  },
  {
    id: 'inv-bole-steel',
    projectId: 'bole-commercial',
    materialKey: 'steel_beam',
    quantity: 20,
    condition: 'good',
    availableDate: new Date('2026-01-20'),
    rawDescription: '20 steel beams (I-beam 300mm) from design change',
  },
  {
    id: 'inv-bole-plywood',
    projectId: 'bole-commercial',
    materialKey: 'plywood',
    quantity: 45,
    condition: 'fair',
    availableDate: new Date('2026-01-22'),
    rawDescription: '45 sheets plywood (18mm) formwork surplus',
  },
  {
    id: 'inv-bole-tile',
    projectId: 'bole-commercial',
    materialKey: 'ceramic_tile',
    quantity: 80,
    condition: 'good',
    availableDate: new Date('2026-01-25'),
    rawDescription: '80 boxes ceramic tile (60x60) - wrong color delivered',
  },
  {
    id: 'inv-cmc-plywood',
    projectId: 'cmc-office',
    materialKey: 'plywood',
    quantity: 30,
    condition: 'good',
    availableDate: new Date('2026-01-18'),
    rawDescription: '30 sheets plywood formwork no longer needed',
  },
  {
    id: 'inv-cmc-timber',
    projectId: 'cmc-office',
    materialKey: 'timber',
    quantity: 60,
    condition: 'fair',
    availableDate: new Date('2026-01-20'),
    rawDescription: '60 pieces timber formwork beams',
  },
  {
    id: 'inv-cmc-roofing',
    projectId: 'cmc-office',
    materialKey: 'roofing_sheet',
    quantity: 200,
    condition: 'good',
    availableDate: new Date('2026-01-22'),
    rawDescription: '200 corrugated roofing sheets - excess from roof completion',
  },
  {
    id: 'inv-summit-rebar',
    projectId: 'summit-mixed',
    materialKey: 'rebar',
    quantity: 5,
    condition: 'good',
    availableDate: new Date('2026-01-15'),
    rawDescription: '5 tons rebar (16mm) surplus from foundation phase',
  },
  {
    id: 'inv-gerji-sand',
    projectId: 'gerji-commercial',
    materialKey: 'sand',
    quantity: 100,
    condition: 'good',
    availableDate: new Date('2026-01-20'),
    rawDescription: '100 m³ construction sand - over-delivery',
  },
];

export const SEED_DEMANDS: DemandItem[] = [
  {
    id: 'dem-kality-blocks',
    projectId: 'kality-residential',
    materialKey: 'concrete_block',
    quantity: 1000,
    neededBy: new Date('2026-01-28'),
  },
  {
    id: 'dem-kality-steel',
    projectId: 'kality-residential',
    materialKey: 'steel_beam',
    quantity: 15,
    neededBy: new Date('2026-02-05'),
  },
  {
    id: 'dem-kality-plywood',
    projectId: 'kality-residential',
    materialKey: 'plywood',
    quantity: 40,
    neededBy: new Date('2026-01-30'),
  },
  {
    id: 'dem-kality-rebar',
    projectId: 'kality-residential',
    materialKey: 'rebar',
    quantity: 3,
    neededBy: new Date('2026-02-10'),
  },
  {
    id: 'dem-summit-steel',
    projectId: 'summit-mixed',
    materialKey: 'steel_beam',
    quantity: 25,
    neededBy: new Date('2026-02-01'),
  },
  {
    id: 'dem-summit-rebar',
    projectId: 'summit-mixed',
    materialKey: 'rebar',
    quantity: 8,
    neededBy: new Date('2026-02-15'),
  },
  {
    id: 'dem-ayat-blocks',
    projectId: 'ayat-housing',
    materialKey: 'concrete_block',
    quantity: 2000,
    neededBy: new Date('2026-02-15'),
  },
  {
    id: 'dem-ayat-plywood',
    projectId: 'ayat-housing',
    materialKey: 'plywood',
    quantity: 50,
    neededBy: new Date('2026-02-20'),
  },
  {
    id: 'dem-gerji-steel',
    projectId: 'gerji-commercial',
    materialKey: 'steel_beam',
    quantity: 30,
    neededBy: new Date('2026-01-25'),
  },
  {
    id: 'dem-gerji-rebar',
    projectId: 'gerji-commercial',
    materialKey: 'rebar',
    quantity: 10,
    neededBy: new Date('2026-02-01'),
  },
  {
    id: 'dem-lebu-rebar',
    projectId: 'lebu-industrial',
    materialKey: 'rebar',
    quantity: 15,
    neededBy: new Date('2026-02-01'),
  },
  {
    id: 'dem-lebu-steel',
    projectId: 'lebu-industrial',
    materialKey: 'steel_beam',
    quantity: 20,
    neededBy: new Date('2026-02-10'),
  },
  {
    id: 'dem-cmc-tile',
    projectId: 'cmc-office',
    materialKey: 'ceramic_tile',
    quantity: 100,
    neededBy: new Date('2026-01-25'),
  },
];

export function getProjectById(id: string): Project | undefined {
  return SEED_PROJECTS.find((p) => p.id === id);
}

export function getInventoryByProject(projectId: string): InventoryItem[] {
  return SEED_INVENTORY.filter((i) => i.projectId === projectId);
}

export function getDemandsByProject(projectId: string): DemandItem[] {
  return SEED_DEMANDS.filter((d) => d.projectId === projectId);
}

export function getAllInventory(): InventoryItem[] {
  return SEED_INVENTORY;
}

export function getAllDemands(): DemandItem[] {
  return SEED_DEMANDS;
}