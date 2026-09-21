import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';
import { MaterialExtractionResult } from '@/lib/ai/schemas';
import { resolveMaterialKey, getMaterial, getAllMaterials } from '@/lib/materials/taxonomy';
import { MaterialKey, MaterialUnit, MaterialCondition } from '@/lib/types';

export async function extractMaterialsAction(rawText: string): Promise<MaterialExtractionResult> {
  const provider = getAIProvider();
  const result = await provider.extractMaterials(rawText);

  const validatedMaterials = result.materials.map((item) => {
    let materialKey = item.material;
    if (materialKey === 'unknown') {
      const resolved = resolveMaterialKey(item.rawText);
      if (resolved !== 'unknown') {
        materialKey = resolved;
      }
    }

    const canonical = getMaterial(materialKey as MaterialKey);
    return {
      ...item,
      material: materialKey,
      displayName: canonical?.name ?? item.displayName,
      unit: (canonical?.unit ?? item.unit) as MaterialUnit,
      confidence: materialKey === 'unknown' ? Math.min(item.confidence, 0.5) : item.confidence,
    };
  });

  return {
    materials: validatedMaterials,
    unparsed: result.unparsed,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid text parameter' },
        { status: 400 }
      );
    }

    const result = await extractMaterialsAction(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract materials' },
      { status: 500 }
    );
  }
}

export async function explainMatchAction(facts: {
  sourceProject: string;
  destinationProject: string;
  material: string;
  availableQuantity: number;
  neededQuantity: number;
  distanceKm: number;
  condition: string;
  urgencyStatus: string;
  overallScore: number;
}) {
  const provider = getAIProvider();
  return provider.explainMatch(facts);
}

export async function generateTransferPlanAction(facts: {
  sourceProject: string;
  destinationProject: string;
  materials: { material: string; quantity: number; unit: string }[];
  distanceKm: number;
}) {
  const provider = getAIProvider();
  return provider.generateTransferPlan(facts);
}

export function getCanonicalMaterials() {
  return getAllMaterials();
}

export function validateMaterialKey(key: string): key is MaterialKey {
  const materials = getAllMaterials();
  return materials.some((m) => m.key === key);
}