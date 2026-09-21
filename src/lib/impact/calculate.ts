import {
  MaterialKey,
  MaterialUnit,
  Transfer,
  TransferMaterial,
  MaterialImpact,
  TransferImpact,
  AggregateImpact,
  ImpactProvenance,
  ImpactSummary,
  ProvenanceLabel,
} from '@/lib/types';
import { getMaterial } from '@/lib/materials/taxonomy';

export function calculateMaterialImpact(
  materialKey: MaterialKey,
  quantity: number
): MaterialImpact {
  const material = getMaterial(materialKey);
  if (!material) {
    throw new Error(`Unknown material: ${materialKey}`);
  }

  const massKg = quantity * material.weightPerUnit;
  const valueRecovered = quantity * material.unitValue;
  const wasteAvoidedKg = massKg;
  const co2eAvoidedKg = massKg * material.co2eFactorPerKg;

  return {
    materialKey,
    materialName: material.name,
    quantity,
    unit: material.unit,
    massKg: Math.round(massKg * 100) / 100,
    valueRecovered: Math.round(valueRecovered),
    wasteAvoidedKg: Math.round(wasteAvoidedKg * 100) / 100,
    co2eAvoidedKg: Math.round(co2eAvoidedKg * 100) / 100,
    weightPerUnit: material.weightPerUnit,
    unitValue: material.unitValue,
    co2eFactorPerKg: material.co2eFactorPerKg,
  };
}

export function calculateTransferImpact(
  transfer: Transfer,
  sourceProjectName: string,
  destProjectName: string
): TransferImpact {
  const materialImpacts = transfer.materials.map((tm) =>
    calculateMaterialImpact(tm.materialKey, tm.quantity)
  );

  const totalMassKg = materialImpacts.reduce((sum, m) => sum + m.massKg, 0);
  const totalValueRecovered = materialImpacts.reduce((sum, m) => sum + m.valueRecovered, 0);
  const totalWasteAvoidedKg = materialImpacts.reduce((sum, m) => sum + m.wasteAvoidedKg, 0);
  const totalCo2eAvoidedKg = materialImpacts.reduce((sum, m) => sum + m.co2eAvoidedKg, 0);

  return {
    transferId: transfer.id,
    sourceProject: sourceProjectName,
    destinationProject: destProjectName,
    distanceKm: transfer.distanceKm,
    materials: materialImpacts,
    totalMassKg: Math.round(totalMassKg * 100) / 100,
    totalValueRecovered: Math.round(totalValueRecovered),
    totalWasteAvoidedKg: Math.round(totalWasteAvoidedKg * 100) / 100,
    totalCo2eAvoidedKg: Math.round(totalCo2eAvoidedKg * 100) / 100,
    createdAt: transfer.createdAt,
  };
}

export function calculateAggregateImpact(transfers: TransferImpact[]): AggregateImpact {
  const totalTransfers = transfers.length;
  const totalMassKg = transfers.reduce((sum, t) => sum + t.totalMassKg, 0);
  const totalValueRecovered = transfers.reduce((sum, t) => sum + t.totalValueRecovered, 0);
  const totalWasteAvoidedKg = transfers.reduce((sum, t) => sum + t.totalWasteAvoidedKg, 0);
  const totalCo2eAvoidedKg = transfers.reduce((sum, t) => sum + t.totalCo2eAvoidedKg, 0);

  const materials: Record<MaterialKey, { quantity: number; massKg: number }> = {} as Record<
    MaterialKey,
    { quantity: number; massKg: number }
  >;

  for (const transfer of transfers) {
    for (const material of transfer.materials) {
      if (!materials[material.materialKey]) {
        materials[material.materialKey] = { quantity: 0, massKg: 0 };
      }
      materials[material.materialKey].quantity += material.quantity;
      materials[material.materialKey].massKg += material.massKg;
    }
  }

  return {
    totalTransfers,
    totalMassKg: Math.round(totalMassKg * 100) / 100,
    totalValueRecovered: Math.round(totalValueRecovered),
    totalWasteAvoidedKg: Math.round(totalWasteAvoidedKg * 100) / 100,
    totalCo2eAvoidedKg: Math.round(totalCo2eAvoidedKg * 100) / 100,
    materials,
  };
}

export function getImpactProvenance(): ImpactProvenance {
  return {
    massKg: 'Calculated',
    valueRecovered: 'Calculated',
    wasteAvoidedKg: 'Estimated',
    co2eAvoidedKg: 'Estimated',
  };
}

export function getProvenanceLabel(provenance: ProvenanceLabel): string {
  return provenance;
}

export const IMPACT_METHODOLOGY = {
  massKg: {
    label: 'Calculated',
    formula: 'quantity × weightPerUnit[material]',
    description: 'Mass is calculated directly from the declared quantity and the standard weight per unit for each material type.',
  },
  valueRecovered: {
    label: 'Calculated',
    formula: 'quantity × unitValue[material]',
    description: 'Recovered value is calculated using illustrative unit values (ETB) assigned to each material in the demo factor table.',
  },
  wasteAvoidedKg: {
    label: 'Estimated',
    formula: 'massKg (assumes transferred material would otherwise be landfilled)',
    description: 'Waste avoided assumes 100% of transferred mass would have become waste. This is an illustrative estimate, not a measured diversion.',
  },
  co2eAvoidedKg: {
    label: 'Estimated',
    formula: 'massKg × co2eFactorPerKg[material]',
    description: 'CO2e avoided uses illustrative emission factors (kg CO2e per kg material) from the demo factor table. These are not independently verified measurements.',
  },
};