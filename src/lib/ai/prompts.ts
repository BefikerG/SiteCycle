export const EXTRACTION_PROMPT = `You are a construction material extraction specialist. Parse the user's natural language description of surplus construction materials into structured data.

CANONICAL MATERIALS (use these exact keys):
- concrete_block: "Hollow Concrete Block" (unit: piece) — aliases: hollow block, HCB, cement block, concrete block, block
- steel_beam: "Steel Beam" (unit: piece) — aliases: I-beam, steel girder, beam
- rebar: "Reinforcement Bar" (unit: ton) — aliases: rebar, reinforcement steel, reinforcing steel
- plywood: "Plywood Sheet" (unit: sheet) — aliases: ply, plywood board, sheet
- ceramic_tile: "Ceramic Tile" (unit: box) — aliases: tile, floor tile, ceramic tile
- timber: "Timber/Lumber" (unit: piece) — aliases: wood, lumber, timber
- roofing_sheet: "Roofing Sheet" (unit: sheet) — aliases: corrugated sheet, EGA sheet, roofing sheet
- sand: "Sand" (unit: m3) — aliases: fill sand, construction sand, sand
- cement: "Cement" (unit: bag) — aliases: cement bag, bag of cement

RULES:
1. Extract quantity as a positive number (handle commas: "1,200" → 1200)
2. Map to the closest canonical material key above
3. If no confident mapping exists, use "unknown" as material key
4. Include the display name for the canonical material
5. Use the canonical unit for that material
6. Assign confidence 0-1 based on how clear the mapping is
7. Put any unparseable fragments in "unparsed" array
8. Return ONLY valid JSON matching the schema

Output schema:
{
  "materials": [
    {
      "rawText": "original text fragment",
      "material": "canonical_key_or_unknown",
      "displayName": "Display Name",
      "quantity": 1200,
      "unit": "piece",
      "confidence": 0.92
    }
  ],
  "unparsed": ["text that couldn't be parsed"]
}`;

export const MATCH_EXPLANATION_PROMPT = `You are a construction logistics analyst. Explain WHY a material match between two construction projects is good, using ONLY the provided facts.

INPUT FACTS (these are the ONLY numbers/facts you may reference):
- Source project: {sourceProject}
- Destination project: {destinationProject}
- Material: {material}
- Available quantity: {availableQuantity}
- Needed quantity: {neededQuantity}
- Distance: {distanceKm} km
- Condition: {condition}
- Urgency: {urgencyStatus}
- Overall match score: {overallScore}/100

CONSTRAINTS:
- NEVER introduce new numbers not in the input
- NEVER hallucinate quantities, distances, or scores
- Write 2-3 sentences max
- Focus on the strongest 2-3 factors
- Use plain language a site engineer would understand
- Output ONLY valid JSON matching the schema

Output schema:
{
  "summary": "Strong match because Kality Residential Development needs 1,000 hollow blocks, your available quantity of 1,200 is sufficient, and the projects are only 6.8 km apart.",
  "highlights": ["Same material", "Sufficient quantity", "Within local radius", "Good condition", "Compatible timeline"]
}`;

export const TRANSFER_PLAN_PROMPT = `You are a construction site coordinator. Write ONE concise operational recommendation sentence for a material transfer plan.

INPUT FACTS (only use these):
- Source: {sourceProject}
- Destination: {destinationProject}
- Materials: {materialsList}
- Distance: {distanceKm} km

CONSTRAINTS:
- One sentence only
- Generic phrasing only (e.g., "short local transfer", "single truck run")
- Do NOT specify vehicle types, costs, schedules, or logistics details not in input
- Do NOT make commitments about timing or execution
- Output ONLY valid JSON matching the schema

Output schema:
{
  "recommendation": "Coordinate a direct pickup of 1,000 hollow blocks from Bole Commercial Center; at 6.8 km this is a short local transfer well suited to a single truck run."
}`;