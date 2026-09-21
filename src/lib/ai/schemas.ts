import { z } from 'zod';
import { MaterialKey, MaterialUnit } from '@/lib/types';

export const MaterialExtractionItemSchema = z.object({
  rawText: z.string(),
  material: z.union([
    z.enum([
      'concrete_block',
      'steel_beam',
      'rebar',
      'plywood',
      'ceramic_tile',
      'timber',
      'roofing_sheet',
      'sand',
      'cement',
    ]),
    z.literal('unknown'),
  ]),
  displayName: z.string(),
  quantity: z.number().positive(),
  unit: z.enum(['piece', 'sheet', 'box', 'bag', 'ton', 'm3', 'm2', 'linear_m']),
  confidence: z.number().min(0).max(1),
});

export const MaterialExtractionResultSchema = z.object({
  materials: z.array(MaterialExtractionItemSchema),
  unparsed: z.array(z.string()),
});

export const MatchExplanationSchema = z.object({
  summary: z.string(),
  highlights: z.array(z.string()),
});

export const TransferRecommendationSchema = z.object({
  recommendation: z.string(),
});

export type MaterialExtractionItem = z.infer<typeof MaterialExtractionItemSchema>;
export type MaterialExtractionResult = z.infer<typeof MaterialExtractionResultSchema>;
export type MatchExplanation = z.infer<typeof MatchExplanationSchema>;
export type TransferRecommendation = z.infer<typeof TransferRecommendationSchema>;