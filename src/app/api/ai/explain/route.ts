import { NextRequest, NextResponse } from 'next/server';
import { explainMatchAction } from '@/app/api/ai/extract/route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Accept either the full match object or the facts structure
    let facts = body;
    if (body.match && !body.sourceProject) {
      // Extract facts from match object
      const match = body.match;
      const topMaterial = match.materialScores
        ? [...match.materialScores].sort((a: any, b: any) => b.score - a.score)[0]
        : null;
      
      if (topMaterial) {
        facts = {
          sourceProject: match.sourceProjectName || 'Source Project',
          destinationProject: match.project?.name || 'Destination Project',
          material: topMaterial.materialName || topMaterial.materialKey,
          availableQuantity: topMaterial.availableQuantity,
          neededQuantity: topMaterial.neededQuantity,
          distanceKm: match.distanceKm,
          condition: topMaterial.condition,
          urgencyStatus: topMaterial.urgencyStatus,
          overallScore: match.score,
        };
      }
    }
    
    const result = await explainMatchAction(facts);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Explain match error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}