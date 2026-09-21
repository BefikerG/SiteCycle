# SiteCycle — Product Requirements Document (PRD)

**Version:** 1.0 (Hackathon MVP)
**Status:** Authoritative source of truth for implementation
**Audience:** Solo developer + coding agent (e.g. Claude Code)
**Tagline:** "Find the next project for materials before they become waste."

---

## 1. Executive Summary

SiteCycle is an intelligence layer for circular construction. It takes messy, natural-language descriptions of surplus construction materials from one project, converts them into structured inventory using AI, and deterministically matches that surplus against the material demand of nearby construction projects. It explains *why* a match is good, lets a user turn a match into a proposed transfer plan, and estimates the environmental/circularity impact of that transfer.

SiteCycle is not a marketplace, not a logistics platform, and not an ERP. It is a demonstration of a specific technical pipeline: **messy input → AI understanding → structured data → deterministic matching → explainable recommendation → transfer plan → impact estimate.** Every one of the 50 sections below exists to keep that pipeline sharp, buildable by one person in a hackathon window, and free of scope creep.

---

## 2. Product Vision

A world where surplus materials on one construction site are visible, immediately, to every nearby project that could use them — so that materials move to their next use before they become waste. SiteCycle is the first, minimal expression of that vision: a local intelligence layer that surfaces the match and explains it, without pretending to solve procurement, logistics, or payments.

---

## 3. Problem Statement

Construction generates enormous volumes of surplus and demolition material — much of it structurally sound (blocks, beams, plywood, tile, rebar) — that ends up landfilled or informally discarded simply because:

- No one on-site has time to catalog surplus materials in a structured way.
- There is no visibility into which nearby projects currently need those exact materials.
- Matching supply to demand today is entirely relationship-based and word-of-mouth.
- There is no way to quickly estimate whether reuse is even worth pursuing (distance, quantity, condition, timing all matter).

The result: usable materials are wasted not because they're unusable, but because the *information problem* of matching supply to demand is never solved at the site level.

---

## 4. Environmental Context

Construction and demolition (C&D) waste is one of the largest waste streams globally by volume, and a substantial share of it is materials that are dimensionally and structurally still usable (masonry units, dimensional lumber/plywood, structural steel, tile, fixtures). Diverting even a fraction of this stream through direct project-to-project reuse:

- Avoids landfill volume.
- Avoids the embodied-carbon cost of manufacturing replacement materials (production of steel and cement-based products is particularly carbon-intensive).
- Reduces demand-side procurement cost for the receiving project.

SiteCycle does not claim to have measured any of this scientifically for a given city or country. It claims to demonstrate the *product mechanism* by which this kind of diversion becomes discoverable, with all environmental figures clearly labeled as **illustrative estimates** (see Section 25).

---

## 5. Opportunity

The gap is not "another materials marketplace" — several exist and struggle with liquidity and trust. The gap is the **intelligence step before a marketplace could ever work**: turning unstructured site knowledge into structured, matchable inventory, and doing the matching + explanation automatically. SiteCycle demonstrates that step convincingly, which is exactly the layer a hackathon can build credibly in the available time — a real marketplace with logistics, payments, and trust infrastructure is not.

---

## 6. Target User

**Primary user:** Construction project manager or site engineer responsible for a single active construction project, who has informal knowledge of surplus materials sitting on their site.

They are not a procurement specialist, not a sustainability officer, and not necessarily technical. They think in terms of "what's sitting around that we don't need," not in terms of inventory management systems.

---

## 7. User Persona

**Yohannes T., Site Engineer, Bole Commercial Center**
Age 34. Manages day-to-day execution on a mid-size commercial build in Addis Ababa. Tracks materials mentally and in WhatsApp messages to his procurement contact, not in a formal system. Knows his site has leftover blocks and steel from over-ordering, but has no channel to find out who nearby might want them — so they sit in a yard corner until someone decides to scrap or dump them. He would use a five-minute tool if it could tell him, concretely, who wants what he has and how far away they are.

---

## 8. User Jobs-to-be-Done

1. "When I notice I have surplus material, help me quickly record what it is without filling out a form."
2. "When I've recorded surplus, tell me if anyone nearby actually needs it — don't make me search or ask around."
3. "When there's a potential match, tell me *why* it's a good match in plain language I can act on or forward to my PM."
4. "When I decide to pursue a match, give me a clean plan I can reference/share, not just a chat message."
5. "When I've moved material, show me some sense of the impact — for my own reporting and for the story I can tell my company."

---

## 9. Product Positioning

**SiteCycle is an intelligence layer for circular construction — not a marketplace.**

The marketplace/network view is a *byproduct* of the intelligence layer, not the product itself. The differentiated technical value is the pipeline: messy information → material intelligence → spatial matching → explainable recommendation → transfer planning → impact measurement. A CRUD app with an LLM bolted on would stop at "extract materials into a table." SiteCycle's value is everything *after* that: deterministic, explainable, geospatially aware matching, and a measurement layer that treats its own numbers honestly.

---

## 10. Value Proposition

- **For site engineers:** turn 30 seconds of typing into a ranked, explained list of nearby projects that want what you have.
- **For the receiving project:** discover supply you didn't know existed, for materials you already need.
- **For the environment/company reporting:** a defensible, clearly-labeled estimate of what reuse is worth, without pretending to certified measurement.

---

## 11. Product Principles

1. **AI interprets. Software calculates. AI explains.** No AI call ever produces a number that decides a match or an impact figure.
2. **Deterministic and reproducible.** The same inputs always produce the same match score.
3. **Honest about uncertainty.** Every estimated figure is labeled as an estimate, with its formula inspectable.
4. **Hackathon-real, not hackathon-fake.** No feature exists purely to look impressive; every screen supports the core journey.
5. **Degrade gracefully.** If AI is unavailable, the core value (matching, browsing, impact) still works.
6. **No invented facts.** AI is never allowed to state a distance, quantity, or score it wasn't given.

---

## 12. Goals

- Demonstrate the full DECLARE → UNDERSTAND → MATCH → EVALUATE → TRANSFER → MEASURE journey working end-to-end, live.
- Make the AI role and the deterministic role visibly distinct in both the code and the UI.
- Produce a demo-ready seeded network of Addis Ababa construction projects with real supply/demand tension.
- Ship on Vercel, on free-tier infrastructure, with no paid API dependency.

## 13. Non-Goals

- Real transactions, payments, or logistics.
- Real user accounts / production authentication.
- Verified real-world project data.
- Scientifically certified environmental accounting.
- Mobile app.
- Multi-tenant SaaS architecture.

---

## 14. Core User Journey

```
DECLARE   → User types a messy natural-language surplus description.
UNDERSTAND→ AI extracts structured material records (material, quantity, unit).
MATCH     → Deterministic engine scans the network for compatible demand.
EVALUATE  → Ranked, scored, explained candidate matches are shown.
TRANSFER  → User selects a match; a transfer plan is generated.
MEASURE   → Impact panel shows estimated mass/value/CO2e avoided.
```

This sequence is literally the primary navigation-adjacent flow of the app and the backbone of the demo.

---

## 15. Detailed User Stories

1. As a site engineer, I can type a free-text description of surplus materials and see it converted into an editable structured list within seconds.
2. As a site engineer, I can correct a misinterpreted quantity or unit before confirming inventory.
3. As a site engineer, once I confirm inventory, I can see a ranked list of nearby projects that could use it, each with a numeric match score.
4. As a site engineer, I can open a match and see the specific factors that produced its score (material, quantity, distance, condition, timing).
5. As a site engineer, I can read a short AI-generated explanation of the match in plain language.
6. As a site engineer, I can create a transfer plan from a match, specifying which materials/quantities are involved.
7. As a site engineer, I can view an impact summary for a created transfer, with every number labeled observed/calculated/estimated.
8. As any visitor, I can browse the Network map and see which projects have surplus vs. demand without declaring anything myself.
9. As any visitor, I can browse Materials and Matches without needing to log in.
10. As a developer/judge, I can see, on the Match Detail screen, a visible breakdown proving the score is deterministic and not an AI guess.

---

## 16. Functional Requirements

- FR1: Natural-language material intake with AI extraction into a structured schema (Section 19).
- FR2: Manual edit/confirm step for extracted materials before they are saved to inventory.
- FR3: Persisted network of 5–8 seeded construction projects with supply and demand data (Section 26).
- FR4: Deterministic matching engine producing a 0–100 score per candidate project (Sections 20–21).
- FR5: Match explanation combining deterministic facts with AI-generated natural-language reasoning (Section 22).
- FR6: Transfer plan creation from a selected match (Section 23).
- FR7: Impact calculation and display per transfer, with observed/calculated/estimated labeling (Section 24).
- FR8: Map-based Network view showing supply/demand geographically.
- FR9: Full core journey achievable without authentication.
- FR10: Graceful fallback for all AI-dependent features when the AI provider is unavailable.

---

## 17. AI Requirements

AI is used in exactly three places:

1. **Material extraction** — natural language → structured JSON (Section 19).
2. **Match explanation** — structured match facts → natural-language reasoning (Section 22).
3. **Transfer plan narrative** — structured transfer facts → a short operational recommendation (Section 23).

AI is never used for: match scoring, distance calculation, mass/value/CO2e calculation, or any numeric output that appears elsewhere as a "calculated" or "observed" figure.

---

## 18. AI Responsibilities vs. Deterministic Responsibilities

| Responsibility | Owner |
|---|---|
| Parsing free text into material candidates | AI |
| Normalizing a material name to a canonical taxonomy entry | Deterministic (alias table), AI only proposes, code resolves |
| Match scoring (all five factors) | Deterministic |
| Distance calculation | Deterministic (Haversine) |
| Explaining *why* a score is what it is, in prose | AI (fed only the deterministic facts) |
| Mass / value / CO2e calculation | Deterministic (formula + factor table) |
| Writing the short transfer recommendation sentence | AI (fed only structured transfer facts) |
| Deciding whether a transfer is a "match" at all (threshold) | Deterministic |

---

## 19. Material Understanding Specification

**Input:** free-text string, e.g. *"We've got about 1,200 hollow blocks, 20 steel beams and around 45 sheets of plywood left over."*

**AI output schema (`MaterialExtractionResult`):**

```json
{
  "materials": [
    {
      "rawText": "1,200 hollow blocks",
      "material": "concrete_block",
      "displayName": "Hollow Concrete Block",
      "quantity": 1200,
      "unit": "piece",
      "confidence": 0.92
    }
  ],
  "unparsed": []
}
```

- `material`: must be one of the canonical taxonomy keys (Section 20 alias table) or `"unknown"` if no confident mapping exists.
- `unit`: constrained enum — `piece | sheet | box | bag | ton | m3 | m2 | linear_m`.
- `confidence`: 0–1, informational only; UI shows a subtle "low confidence — please check" flag under 0.6.
- `unparsed`: array of text fragments the model could not confidently map; surfaced to the user as "we couldn't identify this — add it manually."

**Validation requirements:**
- Response must be valid JSON matching the schema (validate with a schema validator, e.g. Zod).
- `quantity` must be a positive number; reject/flag otherwise.
- If `material` is not in the canonical taxonomy and not `"unknown"`, coerce to `"unknown"` rather than trusting an invented category.

**Retry / fallback behavior:**
- One retry on malformed JSON (re-prompt with the parse error).
- If the second attempt also fails, or the AI provider errors/times out (>8s), fall back to a **manual entry form**: the user types quantity/unit/material directly using a searchable dropdown of the canonical taxonomy. The app must never block on AI.
- AI unavailability must never crash the app or block inventory creation.

**What AI must never do:** invent a material category outside the canonical taxonomy without flagging it as `"unknown"`; invent a quantity not present in the text; silently drop unparsed fragments.

---

## 20. Matching Engine Specification

### Canonical material taxonomy (MVP set)

| Canonical key | Display name | Unit | Aliases (non-exhaustive) |
|---|---|---|---|
| `concrete_block` | Hollow Concrete Block | piece | hollow block, HCB, cement block |
| `steel_beam` | Steel Beam | piece | I-beam, steel girder |
| `rebar` | Reinforcement Bar | ton | rebar, reinforcement steel |
| `plywood` | Plywood Sheet | sheet | ply, plywood board |
| `ceramic_tile` | Ceramic Tile | box | tile, floor tile |
| `timber` | Timber/Lumber | piece | wood, lumber |
| `roofing_sheet` | Roofing Sheet | sheet | corrugated sheet, EGA sheet |
| `sand` | Sand | m3 | fill sand, construction sand |
| `cement` | Cement | bag | cement bag |

Alias resolution is a deterministic lookup table in code (`lib/materials/taxonomy.ts`), not an AI call.

### Matching algorithm (pseudocode)

```
function findMatches(sourceProjectId, inventoryItems):
  candidates = []
  for demandProject in allProjects where demandProject.id != sourceProjectId:
    materialScores = []
    for item in inventoryItems:
      for demand in demandProject.demands:
        if !materialsCompatible(item.material, demand.material): continue
        coverage = min(item.quantity / demand.quantity, 1.0)
        if coverage < MIN_QUANTITY_COVERAGE (0.2): continue
        distanceKm = haversine(sourceProjectId.coords, demandProject.coords)
        if distanceKm > MAX_TRANSFER_RADIUS_KM (50): continue
        score = computeMatchScore(item, demand, distanceKm)
        materialScores.push({ item, demand, distanceKm, score })
    if materialScores.length == 0: continue
    projectScore = aggregateProjectScore(materialScores)
    if projectScore >= MIN_VIABLE_MATCH_SCORE (50):
      candidates.push({ project: demandProject, score: projectScore, materialScores })
  return sortDescending(candidates, by: score)
```

### Edge cases explicitly handled

- No demand anywhere for a material → material excluded from results, surfaced in UI as "no current demand for this material."
- Quantity available far below what's needed (coverage < 20%) → excluded as not meaningfully useful.
- Distance beyond 50 km → excluded (out of "local" transfer radius for this MVP).
- Unknown condition → scored at a neutral/penalized default (Section 21), never excluded outright.
- No deadline on demand → treated as flexible, not penalized.
- Multiple materials matching the same destination → aggregated per Section 21's multi-material rule.
- Two projects with identical scores → sorted by distance ascending as tiebreaker.

---

## 21. Match Scoring Specification

**Per-material score** (0–100), computed deterministically from five weighted factors:

```
Score = 100 × (
    0.30 × MaterialCompatibility +
    0.25 × QuantityCoverage +
    0.20 × DistanceFactor +
    0.15 × ConditionFactor +
    0.10 × UrgencyFactor
  )
```

**MaterialCompatibility** — 1.0 if same canonical material (via alias resolution); MVP does not implement partial cross-category substitution (e.g. "hollow block" vs. "solid block") — that is a Nice-to-Have (Section 43). Non-matches are excluded before scoring, never scored at 0 and shown.

**QuantityCoverage** — `min(available / needed, 1.0)`. Below 0.2 (20%), the pair is excluded (Section 20).

**DistanceFactor** — piecewise linear on straight-line (Haversine) distance in km:
```
distance <= 5km        → 1.0
5km  < distance <= 25km → linear interpolation from 1.0 down to 0.6
25km < distance <= 50km → linear interpolation from 0.6 down to 0.2
distance > 50km        → excluded (not scored)
```

**ConditionFactor** — from the inventory item's declared condition:
```
good    → 1.0
fair    → 0.75
poor    → 0.3
unknown → 0.5   (penalized but not excluded)
```

**UrgencyFactor** — compares inventory `availableDate` to demand `neededBy`:
```
no neededBy set                          → 0.9 (flexible demand, mildly rewarded)
available at least 7 days before needed  → 1.0
available 0–7 days before needed         → 0.85
available 1–7 days after needed (late)   → 0.5
available >7 days after needed           → 0.2
availableDate missing                    → 0.7 (neutral default)
```

**Multi-material aggregation to a single project score:**
```
sort materialScores descending
top = materialScores[0..2]  (at most top 3)
base = average(top.score)
bonus = min((materialScores.length - 1) × 2, 6)   // reward genuine multi-material fit
projectScore = min(round(base + bonus), 100)
```

**Minimum viable match threshold:** 50. Candidates scoring below 50 are hidden by default; a "show weaker matches" toggle can reveal 30–49 as "low compatibility." Below 30 is never surfaced.

**Determinism guarantee:** given identical project/inventory/demand records, the score is always identical — no randomness, no AI in the numeric path. Acceptance tests must assert this (Section 49).

**Note on the illustrative "94 MATCH" example in the spec:** this is a product-story illustration, not a fixed constant. With seed data set to `condition: good`, comfortable timing, and ~6.8 km distance, the formula above naturally lands in the low-to-high 90s, which is why that number was chosen for the demo script — it does not need to be hard-coded.

---

## 22. Match Explanation Specification

**Input to AI (structured, deterministic facts only):**

```json
{
  "sourceProject": "Bole Commercial Center",
  "destinationProject": "Kality Residential Development",
  "material": "Hollow Concrete Block",
  "availableQuantity": 1200,
  "neededQuantity": 1000,
  "distanceKm": 6.8,
  "condition": "good",
  "urgencyStatus": "comfortable",
  "overallScore": 94
}
```

**AI output schema (`MatchExplanation`):**

```json
{
  "summary": "Strong match because Kality Residential Development needs 1,000 hollow blocks, your available quantity of 1,200 is sufficient, and the projects are only 6.8 km apart.",
  "highlights": [
    "Same material",
    "Destination needs sufficient quantity",
    "Within local transfer radius",
    "Condition acceptable",
    "Demand deadline compatible"
  ]
}
```

**Constraints:**
- AI may only restate numbers/facts present in the input JSON — never introduce a new number.
- Output is validated against the schema; any numeric value in `summary` is checked (string match) against the input facts, and if a hallucinated number is detected, the summary is discarded and replaced with a deterministic template string built from the same facts (fallback below).
- `highlights` are chosen by the AI from the actual factor values, but the deterministic checklist in the UI (Section 29, Match Detail) is generated by code independently — the AI's `highlights` are supplementary color, not the source of truth.

**Fallback if AI unavailable:** a deterministic template generates the summary, e.g.:
`"{score}% match: {destinationProject} needs {neededQuantity} {material}, you have {availableQuantity} available, {distanceKm} km away."`

---

## 23. Transfer Planning Specification

When a user clicks "Create Transfer Plan" on a match:

**Input to AI (structured only):**
```json
{
  "sourceProject": "Bole Commercial Center",
  "destinationProject": "Kality Residential Development",
  "materials": [{ "material": "Hollow Concrete Block", "quantity": 1000, "unit": "piece" }],
  "distanceKm": 6.8
}
```

**AI output schema (`TransferRecommendation`):**
```json
{
  "recommendation": "Coordinate a direct pickup of 1,000 hollow blocks from Bole Commercial Center; at 6.8 km this is a short local transfer well suited to a single truck run."
}
```

AI supplies only the narrative sentence. The actual `Transfer` record (source, destination, materials, quantities, status, timestamps) is created and persisted by deterministic server logic, never by the AI response. AI must not invent a transportation method claim beyond generic phrasing ("a short local transfer") — it must not assert vehicle types, costs, or schedules not derivable from the input.

**Transfer statuses (MVP):** `proposed → confirmed → completed` (simple manual status field the user can advance; no real logistics execution).

---

## 24. Impact Measurement Specification

**Observed** (directly from the transfer record):
- Quantity transferred, material type, source/destination coordinates, distance.

**Calculated / Estimated** (deterministic formulas over observed data + a static factor table `lib/impact/factors.ts`):

```
mass_kg        = quantity × weightPerUnit[material]
valueRecovered = quantity × unitValue[material]
wasteAvoided_kg = mass_kg   (assumption: transferred material would otherwise be landfilled)
co2eAvoided_kg = mass_kg × co2eFactorPerKg[material]
```

**Illustrative default factor table (clearly labeled as demo assumptions, not measured data):**

| Material | weightPerUnit | unitValue (ETB, illustrative) | CO2e factor (kg CO2e / kg material) |
|---|---|---|---|
| concrete_block | 8 kg | 15 | 0.09 |
| steel_beam | 150 kg | 4500 | 1.85 |
| plywood | 12 kg | 900 | 0.45 |
| ceramic_tile (box) | 20 kg | 600 | 0.30 |
| rebar (ton) | 1000 kg | 85000 | 1.85 |
| timber | 15 kg | 500 | 0.35 |

**UI requirement:** every impact figure is rendered with a badge — `Observed`, `Calculated`, or `Estimated` — and an info affordance that shows the exact formula and factor used. No number is ever presented without this provenance label.

---

## 25. Environmental Claims / Evidence Policy

- SiteCycle never states that it has "measured" emissions reductions. All CO2e, mass, and value figures are labeled **"Estimated — illustrative factor, not independently verified"** in the UI, in the demo video narration, and in the written project description.
- The factor table (Section 24) is presented transparently and is inspectable from the Impact screen ("View methodology").
- Aggregate dashboard totals (e.g., "12.4 tons kept in circulation") are always shown with the same estimate labeling as the individual transfer figures they're summed from.
- The written project description for judging must include one explicit paragraph stating these are demo/illustrative factors chosen for transparency, not sourced from a specific verified emissions database.

---

## 26. Construction Network Model

5–8 seeded, fictionalized Addis Ababa construction projects, each with:

```
id, name, type (residential | commercial | infrastructure | mixed_use),
status (active | near_completion | starting),
latitude, longitude, location (neighborhood label), description,
inventory[] (surplus materials, via Inventory records),
demands[] (needed materials, via Demand records)
```

Seed set must include at minimum: **Bole Commercial Center** (primary demo source, surplus-heavy) and **Kality Residential Development** (primary demo destination, demand-heavy), plus 3–6 more spanning a realistic geographic spread across Addis Ababa (e.g. CMC, Summit, Ayat, Gerji, Lebu) so the map shows genuine spatial variety and at least 2–3 plausible secondary matches beyond the headline demo pair.

---

## 27. Data Model

```
Project
  id: string (uuid)
  name: string
  type: enum(residential, commercial, infrastructure, mixed_use)
  status: enum(active, near_completion, starting)
  latitude: number
  longitude: number
  location: string
  description: string

Material (canonical taxonomy entries)
  id: string
  key: string (canonical key, e.g. "concrete_block")
  name: string (display name)
  category: string
  unit: enum(piece, sheet, box, bag, ton, m3, m2, linear_m)
  weightPerUnit: number (kg)
  unitValue: number (illustrative currency)
  co2eFactorPerKg: number

Inventory
  id: string
  projectId: string (FK -> Project)
  materialKey: string (FK -> Material.key)
  quantity: number
  condition: enum(good, fair, poor, unknown)
  availableDate: date | null
  rawDescription: string | null   // original free text, for traceability

Demand
  id: string
  projectId: string (FK -> Project)
  materialKey: string (FK -> Material.key)
  quantity: number
  neededBy: date | null

Transfer
  id: string
  sourceProjectId: string (FK -> Project)
  destinationProjectId: string (FK -> Project)
  status: enum(proposed, confirmed, completed)
  materials: [{ materialKey: string, quantity: number }]
  matchScore: number
  distanceKm: number
  createdAt: datetime
```

Relationships: Project 1—N Inventory; Project 1—N Demand; Project 1—N Transfer (as source or destination); Material 1—N Inventory/Demand/Transfer-line-items.

---

## 28. Application Information Architecture

```
/ (Overview)
/network        (map-centric view)
/materials      (inventory browser + intake)
/materials/new  (declaration / intake flow)
/matches        (match results for a selected inventory batch)
/matches/[id]   (match detail)
/transfers/[id] (transfer plan)
/impact         (aggregate + per-transfer impact)
```

Primary nav: **Overview · Network · Materials · Matches · Impact** (as specified).

---

## 29. Screen-by-Screen UX Requirements

### 1. Overview
- **Purpose:** orient the user, surface the "declare surplus" CTA, show network-level stats.
- **Primary user:** first-time visitor / judge.
- **Key info:** total projects, active surplus items, total estimated impact so far.
- **Components:** hero stat cards, "Declare Surplus" CTA, mini network map preview.
- **Primary action:** Declare Surplus. **Secondary:** browse Network.
- **Loading:** skeleton stat cards. **Empty:** first-run message inviting a declaration. **Error:** retry banner, non-blocking.
- **Responsive:** stat cards stack to 1 column under 640px.

### 2. Network
- **Purpose:** geospatial view of supply/demand across all projects.
- **Key info:** map markers color-coded by supply/demand/both; project list synced to map.
- **Components:** map (markers + optional radius circle), filterable project list, project detail popover.
- **Primary action:** select a project to view its inventory/demand.
- **Data dependency:** Project, Inventory, Demand.
- **Empty:** if no seed data loaded, show explicit "no projects seeded" state (should not occur in shipped build).
- **Responsive:** map collapses to top 40% height with list below on mobile.

### 3. Materials
- **Purpose:** browse structured inventory across the network (or scoped to "my project").
- **Components:** filterable/sortable table or card list, material taxonomy filter, condition/date filters.
- **Primary action:** Declare new surplus. **Secondary:** open a material's source project.
- **Empty:** "No surplus declared yet."

### 4. Material declaration / intake
- **Purpose:** the DECLARE + UNDERSTAND steps of the journey.
- **Components:** free-text textarea, "Extract with AI" button, editable extracted-materials table (material/quantity/unit/condition/available date, each editable), confirm button.
- **Primary action:** Confirm & Save Inventory. **Secondary:** add material manually (AI fallback path).
- **Loading:** inline spinner on the textarea while extraction runs (target <5s perceived).
- **Error:** if AI fails, silently drop to manual entry form with a small notice, never a hard error page.
- **State transitions:** raw text → extracted (editable) → confirmed (persisted) → (auto) redirected to Matches for this batch.

### 5. Match results
- **Purpose:** the MATCH + EVALUATE steps.
- **Components:** ranked list of candidate projects, each as a card with score badge, top matched material, distance, one-line AI summary.
- **Primary action:** open a match. **Secondary:** toggle "show weaker matches."
- **Empty:** "No current demand nearby for these materials" with the specific materials named.
- **Loading:** skeleton cards while matching engine + AI explanation run (matching engine returns instantly; AI explanation may lag — show score immediately, stream in the explanation).

### 6. Match detail
- **Purpose:** the trust/EVALUATE moment — prove the score is deterministic and explainable.
- **Components:** large score badge, deterministic checklist (✓/✗ per factor as in the spec mockup), factor breakdown (material/quantity/distance/condition/timing with raw values), AI explanation paragraph.
- **Primary action:** Create Transfer Plan. **Secondary:** back to results.

### 7. Transfer plan
- **Purpose:** the TRANSFER step.
- **Components:** source → destination summary, materials/quantities table (editable before confirming), AI recommendation text, status control.
- **Primary action:** Confirm Transfer Plan. **Secondary:** edit quantities, cancel.
- **State transitions:** proposed → confirmed → completed (manual, user-driven).

### 8. Impact
- **Purpose:** the MEASURE step; both per-transfer and aggregate.
- **Components:** per-transfer impact card (mass/value/waste/CO2e, each badged observed/calculated/estimated), "View methodology" expandable panel, aggregate totals across all completed transfers.
- **Empty:** "No transfers completed yet — impact will appear here."

*(All screens: error states are non-blocking inline banners, never full-page crashes; all screens must render usably at 375px width and at typical desktop widths.)*

---

## 30. Interaction Requirements

- Extraction, match scoring, and impact calculation should all feel instantaneous or near-instantaneous where deterministic (target <300ms for matching engine over 5–8 seeded projects); AI calls should show visible progress and never block the rest of the UI.
- Editing an extracted material or a transfer quantity immediately recomputes any dependent deterministic figure (score, mass, value) client-side or via a fast server action — no separate "recalculate" button.
- Selecting a project on the Network map highlights its list entry and vice versa.

## 31. Loading/Error/Empty States

- Every data-dependent screen defines all three explicitly (see Section 29 per-screen).
- Global rule: AI failures degrade to deterministic fallback, never a blocking error. Network/data failures show a retry affordance and never a blank white screen.

## 32. Accessibility Requirements

- All interactive elements keyboard-navigable; visible focus states.
- Color is never the sole signal (score badges/checklists pair color with icon/text, important for the ✓/✗ match checklist).
- Sufficient contrast (WCAG AA) for all text, including on map overlays.
- Map has a non-map (list) equivalent of the same information.

## 33. Responsive Requirements

- Fully usable from 375px (mobile) through desktop widths.
- Map view reflows to list-priority on narrow screens (Section 29).
- Tables/cards reflow to single-column stacks under ~640px.

---

## 34. Technical Architecture

- **Frontend/Backend:** Next.js (App Router) + TypeScript + React, server actions for mutations.
- **Styling:** Tailwind CSS + shadcn/ui components.
- **Persistence:** SQLite (via Prisma or Drizzle ORM) — a single local file, zero external DB dependency, trivial to seed and reset.
- **Deployment:** Vercel. (Note: Vercel's serverless filesystem is ephemeral — see Section 37 for the seed/reset implication.)
- **Matching, geospatial, and impact logic:** pure deterministic TypeScript modules (`lib/matching/`, `lib/geo/`, `lib/impact/`), independently unit-testable with no AI or network dependency.

## 35. AI Provider Architecture

```
lib/ai/provider.ts   // interface: extractMaterials(text), explainMatch(facts), generateTransferPlan(facts)
lib/ai/openrouter.ts // concrete implementation calling OpenRouter's chat completions endpoint
lib/ai/prompts.ts    // prompt templates + JSON schema instructions per function
```

- `provider.ts` defines a `AIProvider` interface with the three methods above; `openrouter.ts` is the only concrete implementation for the hackathon, chosen entirely because the developer has a free OpenRouter account key already — swapping providers means writing a new file implementing the same interface, no other code changes.
- All AI calls request structured JSON output and validate the response against a schema (Zod) before use; on validation failure, retry once, then fall back (Sections 19, 22, 23).
- API key read from environment variable, never hard-coded, never exposed to the client (calls happen in server actions/route handlers only).

## 36. API / Server Action Requirements

- `extractMaterials(rawText): MaterialExtractionResult` — server action, calls AI provider.
- `saveInventory(projectId, items): Inventory[]` — server action, deterministic persistence.
- `findMatches(inventoryBatchId): MatchCandidate[]` — server action, pure deterministic logic.
- `explainMatch(matchFacts): MatchExplanation` — server action, calls AI provider with deterministic fallback.
- `createTransfer(matchId, materials): Transfer` — server action, deterministic persistence + AI narrative call.
- `getImpact(transferId | "all"): ImpactSummary` — server action, pure deterministic calculation.

All server actions validate input, never trust client-supplied scores/impact numbers (recompute server-side).

## 37. Database Requirements

- SQLite file, schema managed via ORM migrations, seed script (`prisma/seed.ts` or equivalent) populates the 5–8 projects + their inventory/demand on first run.
- **Important hackathon note:** if deployed to Vercel's default serverless functions, the SQLite file is not persistently writable across requests/deploys. MVP assumption: either (a) re-run the seed on cold start and treat the demo session as ephemeral (acceptable for a judged demo), or (b) use a lightweight hosted SQLite-compatible option (e.g. Turso/libSQL free tier) if persistence across the judging window matters. This decision is marked as an **assumption** the developer should confirm before build day; either path keeps the app free-tier and code identical at the ORM layer.

## 38. Seed Data Requirements

- 5–8 projects per Section 26, each with 2–5 inventory items and/or 2–5 demand items, tuned so that:
  - Bole Commercial Center has clear surplus (blocks, steel, plywood, tile).
  - Kality Residential Development has clear matching demand (blocks especially).
  - At least one other project pair produces a secondary, lower-scoring match (to prove the ranking isn't hard-coded to one pair).
  - At least one inventory item has no current demand anywhere (to demonstrate the "no match" empty state honestly).

## 39. Security Considerations

- No real authentication required for MVP (Section 2 boundary); if any session concept is used, it's a lightweight anonymous/local session only, never presented as a real account system.
- AI API key server-side only.
- Basic input sanitization on free-text intake (length caps, no script injection into rendered HTML — React escaping handles this by default).
- No PII is collected; seed/demo data only.

## 40. Performance Requirements

- Matching engine over 5–8 seeded projects: <300ms server-side.
- AI extraction: target response shown within 5–8s; UI must not appear frozen during this window.
- Map renders 5–8 markers with no perceptible lag.

## 41. Observability / Debugging Requirements

- Server-side console logging of: AI call attempts/failures/fallback triggers, computed match scores with their factor breakdown (for demo/debug transparency), and impact calculation inputs/outputs.
- A hidden/dev-only "debug" panel on Match Detail (togglable) that dumps the raw factor inputs — useful both for development and as a judging credibility signal ("look, it's really deterministic").

---

## 42. MVP Scope

Everything in Sections 16–29 as written. Specifically: intake with AI extraction + manual fallback; deterministic matching with explicit scoring; AI-generated match explanation; transfer plan creation with AI narrative; impact calculation with observed/calculated/estimated labeling; Network map; all 5 nav sections functional; no auth.

## 43. Nice-to-Have Scope

- Partial material-category compatibility (e.g. related-but-not-identical materials scored at partial credit).
- Aggregate circularity leaderboard across seeded projects.
- Exportable PDF of a transfer plan.
- Multiple concurrent inventory "batches" per project with history.
- Persistent hosted database (Turso) instead of ephemeral SQLite.

## 44. Explicitly Out-of-Scope Features

Payments, real transactions, real logistics/routing, quality inspection, regulatory compliance guarantees, real authentication, mobile app, multi-tenant SaaS architecture, blockchain, computer vision, any feature added purely for visual impressiveness without journey relevance.

---

## 45. Demo Script (3–5 minutes)

| Time | Beat |
|---|---|
| 0:00–0:20 | Problem: usable materials becoming waste because no one can see nearby demand. |
| 0:20–0:40 | Overview screen: quick orientation, network stats. |
| 0:40–1:10 | Declare surplus: type the Bole Commercial Center sentence live. |
| 1:10–1:40 | AI extraction: show the editable structured table appear; briefly touch one field to prove it's editable, not fixed. |
| 1:40–2:10 | Network discovery: show Match results ranked list; point out Kality at the top. |
| 2:10–2:40 | Match detail: walk the deterministic checklist + factor breakdown, then read the AI explanation. |
| 2:40–3:10 | Transfer plan: create it, show the AI recommendation sentence. |
| 3:10–3:40 | Impact: show observed/calculated/estimated labeling explicitly — this is a credibility beat, don't rush it. |
| 3:40–4:00 | Closing vision: one sentence on what this becomes if surfaced across a real regional network. |

## 46. Demo Success Criteria

- The full DECLARE→MEASURE journey completes live without a crash or a stuck loading state.
- The AI extraction step visibly produces an editable, correct-looking structured table from the scripted input.
- The match score's determinism is visually provable (checklist + factor breakdown, not just a number).
- At least one impact figure is shown with its "Estimated" label and methodology visible.
- No claim made verbally in the demo exceeds what Section 25 permits.

## 47. Hackathon Judging Alignment

- **Originality:** intelligence-layer positioning (Section 9) distinguishes this from generic marketplace submissions.
- **Environmental track alignment:** Sections 4, 24, 25 directly address a real C&D waste problem with honest measurement framing.
- **Completion:** MVP scope (Section 42) is deliberately sized to be fully finishable, not a partial demo.
- **Design:** Section 29 + UI/UX direction (visual brief) target a "real product" feel over a hackathon-template feel.
- **Technology:** the AI/deterministic separation (Sections 17–18) is a genuine architectural decision, demonstrable in source code and worth narrating explicitly to judges.
- **Learning:** the provider-abstraction AI layer (Section 35) and deterministic geospatial/impact modules are concrete, explainable engineering choices for a written submission or Q&A.

---

## 48. Acceptance Criteria

- Given a natural-language surplus description, the system extracts one or more recognized material records with quantity and unit.
- Extracted quantities, units, and materials are editable before confirmation, and edits are reflected in inventory as saved.
- Given identical project/inventory/demand data, the matching engine returns identical scores on repeated calls (determinism test).
- The Match Detail screen displays every factor (material, quantity coverage, distance, condition, urgency) as a discrete, inspectable value, not only the final score.
- Distance between two projects is calculated from their stored latitude/longitude via Haversine, not hard-coded.
- A user can create a Transfer record from a match, and it persists with source, destination, materials, and quantities.
- Impact figures (mass, value, waste avoided, CO2e avoided) update automatically based on the specific materials/quantities of the selected transfer.
- Every impact figure is visibly labeled as Observed, Calculated, or Estimated.
- If the AI provider call fails or times out, the app falls back to manual material entry without crashing or hanging.
- If the AI explanation call fails, a deterministic template explanation is shown instead — the match is never left unexplained.
- The full DECLARE→MEASURE journey is completable without any login/authentication step.
- All primary screens render usably at 375px width and standard desktop widths.
- The application deploys successfully to Vercel.
- No core functionality (intake, matching, transfer creation, impact calculation) depends on a paid API; only the optional AI-narrative layer touches OpenRouter, and everything else works with it disabled.
- Materials with no current nearby demand are explicitly shown as "no match," not silently hidden without explanation.
- Match candidates below the minimum viable threshold (Section 21) are not shown by default.

---

## 49. QA / Test Requirements

- **Unit tests** (deterministic modules, no AI/network involved):
  - Haversine distance calculation against known coordinate pairs.
  - Each scoring factor function (material compatibility, quantity coverage, distance factor, condition factor, urgency factor) against boundary values (e.g. exactly at the 5km/25km/50km thresholds, exactly at 20% quantity coverage).
  - Full `computeMatchScore` against the Section 21 worked example, asserting it lands in the expected range.
  - Impact calculation functions against the Section 24 factor table for each seeded material.
  - Determinism: run `findMatches` twice on identical fixture data, assert identical output.
- **Integration tests:**
  - Material extraction with a mocked/stubbed AI response, asserting schema validation catches malformed output and triggers fallback.
  - End-to-end happy path: declare → extract → confirm → match → explain → transfer → impact, using seed data, without live AI (mocked).
- **Manual QA checklist:**
  - AI provider disabled entirely → full journey still completable via manual entry + template explanations.
  - Mobile width (375px) walkthrough of all 5 nav sections.
  - Seed data reset produces a stable, demo-ready state.

---

## 50. Future Vision

Beyond the hackathon: a regional (multi-city) version where any construction management tool can push surplus/demand data into SiteCycle via a lightweight API, turning the intelligence layer into shared infrastructure rather than a standalone app — with a real marketplace, logistics coordination, and verified impact accounting layered on top only once the underlying matching intelligence has proven itself at scale.

---

## Appendix A — One-Page MVP Summary

SiteCycle takes a free-text surplus description, uses AI to extract structured materials, deterministically matches them against a seeded network of 5–8 Addis Ababa construction projects using a transparent five-factor scoring formula (material, quantity, distance, condition, urgency), explains the top match in plain language, lets the user create a transfer plan, and shows an honestly-labeled (observed/calculated/estimated) environmental impact summary. No payments, no logistics, no real accounts, no paid infrastructure. Built in Next.js/TypeScript/SQLite, deployed on Vercel, using OpenRouter for the three narrow AI touchpoints, with a fully functional deterministic fallback if AI is unavailable.

## Appendix B — Critical User Flow

Declare (free text) → Understand (AI extraction, user-editable) → Match (deterministic engine scans network) → Evaluate (ranked, scored, explained candidates) → Transfer (user selects + confirms a plan) → Measure (labeled impact figures).

## Appendix C — Data Model Summary

`Project` (network node) ⟶ has many `Inventory` (surplus) and `Demand` (need) records, each referencing a canonical `Material`. A `Transfer` links a source `Project` to a destination `Project` with specific material line items, a computed match score, and a status.

## Appendix D — AI Architecture Summary

Provider-abstracted (`lib/ai/provider.ts`) with OpenRouter as the sole concrete implementation. Exactly three AI touchpoints: material extraction, match explanation, transfer narrative — each schema-validated with retry-then-fallback. AI never computes a number that appears as a score, distance, mass, value, or CO2e figure anywhere in the product.

## Appendix E — Matching Algorithm Summary

`Score = 100 × (0.30·MaterialCompatibility + 0.25·QuantityCoverage + 0.20·DistanceFactor + 0.15·ConditionFactor + 0.10·UrgencyFactor)`, computed per material pair, aggregated per project (top-3 average + small multi-material bonus), excluded below 20% quantity coverage or beyond 50km, surfaced only at ≥50 overall.

## Appendix F — Screen Inventory

Overview · Network · Materials · Material Declaration/Intake · Match Results · Match Detail · Transfer Plan · Impact.

## Appendix G — Acceptance-Test Checklist

- [ ] Free-text extraction produces editable structured materials
- [ ] Manual fallback works with AI fully disabled
- [ ] Matching is deterministic and reproducible
- [ ] Distance computed via Haversine from stored coordinates
- [ ] Match Detail shows all five factors individually
- [ ] Transfer creation persists source/destination/materials
- [ ] Impact figures are labeled Observed/Calculated/Estimated
- [ ] No-match and low-coverage cases are surfaced honestly, not hidden silently
- [ ] Full journey works with no login
- [ ] Responsive from 375px to desktop
- [ ] Deploys to Vercel on free tier, no paid API required for core function

## Appendix H — "Do Not Build" Checklist

- [ ] No payment processing
- [ ] No real logistics/routing/transportation arrangement
- [ ] No material quality inspection or guarantee
- [ ] No regulatory compliance guarantee
- [ ] No real authentication system
- [ ] No mobile app
- [ ] No multi-tenant SaaS architecture
- [ ] No blockchain
- [ ] No computer vision
- [ ] No AI-computed scores, distances, or impact numbers

## Appendix I — Demo Checklist

- [ ] Seed data loaded and stable before recording
- [ ] Script timing rehearsed against Section 45
- [ ] AI extraction tested live at least twice beforehand for reliability
- [ ] Fallback path tested (kill AI, confirm manual entry still works) before demo day
- [ ] "Estimated" labeling visibly called out during the Impact beat
- [ ] Closing vision line rehearsed to land in one breath
