import {
  MaterialExtractionResult,
  MatchExplanation,
  TransferRecommendation,
} from './schemas';

export interface AIProvider {
  extractMaterials(text: string): Promise<MaterialExtractionResult>;
  explainMatch(facts: MatchExplanationInput): Promise<MatchExplanation>;
  generateTransferPlan(facts: TransferPlanInput): Promise<TransferRecommendation>;
}

export interface MatchExplanationInput {
  sourceProject: string;
  destinationProject: string;
  material: string;
  availableQuantity: number;
  neededQuantity: number;
  distanceKm: number;
  condition: string;
  urgencyStatus: string;
  overallScore: number;
}

export interface TransferPlanInput {
  sourceProject: string;
  destinationProject: string;
  materials: { material: string; quantity: number; unit: string }[];
  distanceKm: number;
}