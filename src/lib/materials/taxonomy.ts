import { Material, MaterialKey, MaterialUnit } from '@/lib/types';

export const CANONICAL_MATERIALS: Material[] = [
  {
    id: 'concrete_block',
    key: 'concrete_block',
    name: 'Hollow Concrete Block',
    category: 'Masonry',
    unit: 'piece',
    weightPerUnit: 8,
    unitValue: 15,
    co2eFactorPerKg: 0.09,
  },
  {
    id: 'steel_beam',
    key: 'steel_beam',
    name: 'Steel Beam',
    category: 'Structural Steel',
    unit: 'piece',
    weightPerUnit: 150,
    unitValue: 4500,
    co2eFactorPerKg: 1.85,
  },
  {
    id: 'rebar',
    key: 'rebar',
    name: 'Reinforcement Bar',
    category: 'Structural Steel',
    unit: 'ton',
    weightPerUnit: 1000,
    unitValue: 85000,
    co2eFactorPerKg: 1.85,
  },
  {
    id: 'plywood',
    key: 'plywood',
    name: 'Plywood Sheet',
    category: 'Timber & Sheet Goods',
    unit: 'sheet',
    weightPerUnit: 12,
    unitValue: 900,
    co2eFactorPerKg: 0.45,
  },
  {
    id: 'ceramic_tile',
    key: 'ceramic_tile',
    name: 'Ceramic Tile',
    category: 'Finishes',
    unit: 'box',
    weightPerUnit: 20,
    unitValue: 600,
    co2eFactorPerKg: 0.30,
  },
  {
    id: 'timber',
    key: 'timber',
    name: 'Timber/Lumber',
    category: 'Timber & Sheet Goods',
    unit: 'piece',
    weightPerUnit: 15,
    unitValue: 500,
    co2eFactorPerKg: 0.35,
  },
  {
    id: 'roofing_sheet',
    key: 'roofing_sheet',
    name: 'Roofing Sheet',
    category: 'Roofing',
    unit: 'sheet',
    weightPerUnit: 5,
    unitValue: 300,
    co2eFactorPerKg: 0.40,
  },
  {
    id: 'sand',
    key: 'sand',
    name: 'Sand',
    category: 'Aggregates',
    unit: 'm3',
    weightPerUnit: 1600,
    unitValue: 800,
    co2eFactorPerKg: 0.01,
  },
  {
    id: 'cement',
    key: 'cement',
    name: 'Cement',
    category: 'Binders',
    unit: 'bag',
    weightPerUnit: 50,
    unitValue: 600,
    co2eFactorPerKg: 0.85,
  },
];

export const MATERIAL_ALIASES: Record<string, MaterialKey> = {
  'hollow block': 'concrete_block',
  'hollow blocks': 'concrete_block',
  'hcb': 'concrete_block',
  'cement block': 'concrete_block',
  'cement blocks': 'concrete_block',
  'concrete block': 'concrete_block',
  'concrete blocks': 'concrete_block',
  'block': 'concrete_block',
  'blocks': 'concrete_block',
  'i-beam': 'steel_beam',
  'i beam': 'steel_beam',
  'steel girder': 'steel_beam',
  'steel girders': 'steel_beam',
  'girder': 'steel_beam',
  'girders': 'steel_beam',
  'beam': 'steel_beam',
  'beams': 'steel_beam',
  'rebar': 'rebar',
  'reinforcement bar': 'rebar',
  'reinforcement bars': 'rebar',
  'reinforcement steel': 'rebar',
  'reinforcing steel': 'rebar',
  'steel reinforcement': 'rebar',
  'ply': 'plywood',
  'plywood board': 'plywood',
  'plywood boards': 'plywood',
  'sheet': 'plywood',
  'sheets': 'plywood',
  'tile': 'ceramic_tile',
  'tiles': 'ceramic_tile',
  'floor tile': 'ceramic_tile',
  'floor tiles': 'ceramic_tile',
  'ceramic tiles': 'ceramic_tile',
  'wood': 'timber',
  'lumber': 'timber',
  'timber': 'timber',
  'lumbers': 'timber',
  'corrugated sheet': 'roofing_sheet',
  'corrugated sheets': 'roofing_sheet',
  'ega sheet': 'roofing_sheet',
  'ega sheets': 'roofing_sheet',
  'roofing sheet': 'roofing_sheet',
  'roofing sheets': 'roofing_sheet',
  'corrugated': 'roofing_sheet',
  'fill sand': 'sand',
  'construction sand': 'sand',
  'sand': 'sand',
  'cement bag': 'cement',
  'cement bags': 'cement',
  'bag of cement': 'cement',
  'bags of cement': 'cement',
};

export function resolveMaterialKey(input: string): MaterialKey | 'unknown' {
  const normalized = input.toLowerCase().trim();
  if (MATERIAL_ALIASES[normalized]) {
    return MATERIAL_ALIASES[normalized];
  }
  for (const [alias, key] of Object.entries(MATERIAL_ALIASES)) {
    if (normalized.includes(alias)) {
      return key;
    }
  }
  return 'unknown';
}

export function getMaterial(key: MaterialKey): Material | undefined {
  return CANONICAL_MATERIALS.find((m) => m.key === key);
}

export function getMaterialById(id: string): Material | undefined {
  return CANONICAL_MATERIALS.find((m) => m.id === id);
}

export function getAllMaterials(): Material[] {
  return CANONICAL_MATERIALS;
}

export function getMaterialUnit(key: MaterialKey): MaterialUnit {
  const material = getMaterial(key);
  return material?.unit ?? 'piece';
}

export function getMaterialDisplayName(key: MaterialKey): string {
  const material = getMaterial(key);
  return material?.name ?? key;
}