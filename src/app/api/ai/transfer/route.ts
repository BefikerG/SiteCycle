import { NextRequest, NextResponse } from 'next/server';
import { generateTransferPlanAction } from '@/app/api/ai/extract/route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Accept either the facts structure or a match object with materials
    let facts = body;
    if (body.match && !body.sourceProject) {
      const match = body.match;
      facts = {
        sourceProject: match.sourceProjectName || 'Source Project',
        destinationProject: match.project?.name || 'Destination Project',
        materials: match.materialScores.map((ms: any) => ({
          material: ms.materialName || ms.materialKey,
          quantity: Math.min(ms.availableQuantity, ms.neededQuantity),
          unit: ms.availableQuantity === ms.neededQuantity ? 'requested' : 'available',
        })),
        distanceKm: match.distanceKm,
      };
    }
    
    const result = await generateTransferPlanAction(facts);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Transfer plan error:', error);
    return NextResponse.json(
      { error: 'Failed to generate transfer plan' },
      { status: 500 }
    );
  }
}