export type MaterialKey =
  | 'concrete_block'
  | 'steel_beam'
  | 'rebar'
  | 'plywood'
  | 'ceramic_tile'
  | 'timber'
  | 'roofing_sheet'
  | 'sand'
  | 'cement';

export type MaterialUnit = 'piece' | 'sheet' | 'box' | 'bag' | 'ton' | 'm3' | 'm2' | 'linear_m';

export type MaterialCondition = 'good' | 'fair' | 'poor' | 'unknown';

export type ProjectType = 'residential' | 'commercial' | 'infrastructure' | 'mixed_use';

export type ProjectStatus = 'active' | 'near_completion' | 'starting';

export type TransferStatus = 'proposed' | 'confirmed' | 'completed';

export interface Material {
  id: string;
  key: MaterialKey;
  name: string;
  category: string;
  unit: MaterialUnit;
  weightPerUnit: number;
  unitValue: number;
  co2eFactorPerKg: number;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  latitude: number;
  longitude: number;
  location: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  projectId: string;
  materialKey: MaterialKey;
  quantity: number;
  condition: MaterialCondition;
  availableDate: Date | null;
  rawDescription: string | null;
}

export interface DemandItem {
  id: string;
  projectId: string;
  materialKey: MaterialKey;
  quantity: number;
  neededBy: Date | null;
}

export interface Transfer {
  id: string;
  sourceProjectId: string;
  destinationProjectId: string;
  status: TransferStatus;
  materials: TransferMaterial[];
  matchScore: number;
  distanceKm: number;
  createdAt: Date;
}

export interface TransferMaterial {
  materialKey: MaterialKey;
  quantity: number;
}

export interface MaterialExtractionItem {
  rawText: string;
  material: MaterialKey | 'unknown';
  displayName: string;
  quantity: number;
  unit: MaterialUnit;
  confidence: number;
}

export interface MaterialExtractionResult {
  materials: MaterialExtractionItem[];
  unparsed: string[];
}

export interface MatchExplanation {
  summary: string;
  highlights: string[];
}

export interface TransferRecommendation {
  recommendation: string;
}

export interface MatchCandidate {
  sourceProjectId: string;
  project: Project;
  score: number;
  materialScores: MaterialMatchScore[];
  distanceKm: number;
}

export interface MaterialMatchScore {
  materialKey: MaterialKey;
  materialName: string;
  availableQuantity: number;
  neededQuantity: number;
  coverage: number;
  distanceKm: number;
  condition: MaterialCondition;
  urgencyStatus: string;
  score: number;
  factorBreakdown: FactorBreakdown;
}

export interface FactorBreakdown {
  materialCompatibility: number;
  quantityCoverage: number;
  distanceFactor: number;
  conditionFactor: number;
  urgencyFactor: number;
}

export interface ImpactSummary {
  transfers: TransferImpact[];
  aggregate: AggregateImpact;
}

export interface TransferImpact {
  transferId: string;
  sourceProject: string;
  destinationProject: string;
  distanceKm: number;
  materials: MaterialImpact[];
  totalMassKg: number;
  totalValueRecovered: number;
  totalWasteAvoidedKg: number;
  totalCo2eAvoidedKg: number;
  createdAt: Date;
}

export interface MaterialImpact {
  materialKey: MaterialKey;
  materialName: string;
  quantity: number;
  unit: MaterialUnit;
  massKg: number;
  valueRecovered: number;
  wasteAvoidedKg: number;
  co2eAvoidedKg: number;
  weightPerUnit: number;
  unitValue: number;
  co2eFactorPerKg: number;
}

export interface AggregateImpact {
  totalTransfers: number;
  totalMassKg: number;
  totalValueRecovered: number;
  totalWasteAvoidedKg: number;
  totalCo2eAvoidedKg: number;
  materials: Record<MaterialKey, { quantity: number; massKg: number }>;
}

export type ProvenanceLabel = 'Observed' | 'Calculated' | 'Estimated';

export interface ImpactProvenance {
  massKg: ProvenanceLabel;
  valueRecovered: ProvenanceLabel;
  wasteAvoidedKg: ProvenanceLabel;
  co2eAvoidedKg: ProvenanceLabel;
}