import { getImpactAction } from '@/app/actions';
import { ImpactClient } from './impact-client';
import { TransferImpact, AggregateImpact, ImpactProvenance, MaterialKey } from '@/lib/types';

export default async function ImpactPage() {
  const impactData = await getImpactAction();
  
  // Normalize the data to always have transfers array and aggregate
  let normalizedData: { transfers: TransferImpact[]; aggregate: AggregateImpact; provenance: ImpactProvenance } | null = null;
  
  if (impactData) {
    if ('transfers' in impactData && impactData.transfers) {
      // Already has transfers array (aggregate view)
      normalizedData = {
        transfers: impactData.transfers,
        aggregate: impactData.aggregate,
        provenance: impactData.provenance,
      };
    } else if ('impact' in impactData && impactData.impact) {
      // Single transfer view - wrap in array
      const emptyMaterials: Record<MaterialKey, { quantity: number; massKg: number }> = {} as Record<
        MaterialKey,
        { quantity: number; massKg: number }
      >;
      const materialKeys: MaterialKey[] = [
        'concrete_block',
        'steel_beam',
        'rebar',
        'plywood',
        'ceramic_tile',
        'timber',
        'roofing_sheet',
        'sand',
        'cement',
      ];
      for (const key of materialKeys) {
        emptyMaterials[key] = { quantity: 0, massKg: 0 };
      }
      
      normalizedData = {
        transfers: [impactData.impact],
        aggregate: {
          totalTransfers: 1,
          totalMassKg: impactData.impact.totalMassKg,
          totalValueRecovered: impactData.impact.totalValueRecovered,
          totalWasteAvoidedKg: impactData.impact.totalWasteAvoidedKg,
          totalCo2eAvoidedKg: impactData.impact.totalCo2eAvoidedKg,
          materials: emptyMaterials,
        },
        provenance: impactData.provenance,
      };
    }
  }
  
  return <ImpactClient data={normalizedData} />;
}