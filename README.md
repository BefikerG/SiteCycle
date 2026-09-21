<div align="center">

# SiteCycle

**Find the next project for materials before they become waste.**

A construction material intelligence platform that matches surplus materials on one site with real demand on nearby projects.

![Status](https://img.shields.io/badge/status-MVP%20complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [AI Architecture](#ai-architecture)
- [Matching Model](#matching-model)
- [Impact Model](#impact-model)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Scenario](#demo-scenario)
- [Product Principles](#product-principles)
- [Scope](#scope)
- [Roadmap](#roadmap)
- [Author](#author)
- [License](#license)

---

## Overview

Construction projects often end with surplus materials while a nearby project is short of the very same materials. SiteCycle connects the two sides. Instead of treating leftovers as waste, it turns them into structured resources that can be **matched, transferred, and measured**.

Every project moves through a single workflow:

```text
DECLARE → UNDERSTAND → MATCH → EVALUATE → TRANSFER → MEASURE
```

The core design principle:

> **AI interprets. Software calculates. AI explains.**

---

## How It Works

### 1. Declare

Describe surplus materials in plain language:

> "We have about 1,200 hollow blocks, 20 steel beams and around 45 sheets of plywood left over."

### 2. Understand

AI extracts structured material data from the description:

```text
1,200 hollow blocks → 1,200 concrete blocks
20 steel beams      → 20 steel beams
45 sheets plywood   → 45 plywood sheets
```

The extracted inventory can be reviewed and edited before it is saved.

### 3. Match

A deterministic matching engine evaluates nearby construction projects on:

- Material compatibility
- Quantity coverage
- Distance
- Material condition
- Demand urgency

### 4. Evaluate

Each match presents:

- Match score
- Distance
- Quantity coverage
- Factor-by-factor breakdown
- Material-level details
- AI-generated explanation of why it was recommended

### 5. Transfer

A selected match can be turned into a proposed transfer plan. Quantities are capped by both the available surplus and the destination's demand.

### 6. Measure

Potential impact is calculated from the transfer data:

- Material mass
- Recovered value
- Waste avoided
- Estimated CO₂e avoided

Every impact figure is labeled by provenance: **Observed · Calculated · Estimated**.

---

## AI Architecture

AI is intentionally kept **outside** the core calculation path.

| AI handles | Software handles |
| --- | --- |
| Natural-language material extraction | Match scoring |
| Match explanations | Distance calculations |
| Transfer recommendations | Quantity, mass, and value calculations |
| | Waste and CO₂e calculations |

If AI is unavailable, deterministic fallback implementations keep the core workflow fully functional.

---

## Matching Model

Each match receives a weighted score across five factors:

| Factor | Weight |
| --- | :---: |
| Material compatibility | 30% |
| Quantity coverage | 25% |
| Distance | 20% |
| Condition | 15% |
| Urgency | 10% |

The engine also applies geographic and quantity thresholds, and uses the Haversine formula for distance calculations.

---

## Impact Model

```text
Mass                     = Quantity × Weight per Unit
Recovered Value          = Quantity × Unit Value
Waste Avoided            = Transferred Material Mass
Estimated CO₂e Avoided   = Material Mass × CO₂e Factor
```

> **Note:** The current material and environmental factors are illustrative demonstration assumptions. They are not certified environmental measurements.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js, React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI provider | OpenRouter |
| Validation | Zod |
| Geospatial | Haversine distance calculations |
| Core logic | Deterministic matching and impact engines |
| Deployment | Vercel-ready |

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── extract/      # Natural-language material extraction
│   │       ├── explain/      # Match explanations
│   │       └── transfer/     # Transfer recommendations
│   ├── materials/
│   ├── matches/
│   ├── transfers/
│   ├── impact/
│   ├── network/
│   └── actions.ts
│
└── lib/
    ├── ai/
    ├── data/
    ├── geo/
    ├── impact/
    ├── matching/
    ├── materials/
    └── types.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/BefikerG/SiteCycle.git
cd SiteCycle
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=your_model
```

> The OpenRouter integration is optional. Without an API key, SiteCycle falls back to its deterministic implementations.

### Run in Development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
```

---

## Demo Scenario

**Source:** Bole Commercial Center
**Destination:** Kality Residential Development

**Input:**

> "We have about 1,200 hollow blocks, 20 steel beams and around 45 sheets of plywood left over."

**End-to-end flow:**

```text
Natural-language surplus
        ↓
AI extraction
        ↓
Editable inventory
        ↓
Deterministic matching
        ↓
Match explanation
        ↓
Transfer plan
        ↓
Impact measurement
```

---

## Product Principles

- **Deterministic core:** business-critical calculations are reproducible.
- **AI as an enhancement:** AI interprets and explains, and never controls numerical truth.
- **Explainability:** users can see why a match was recommended.
- **Provenance:** impact metrics show how each figure was derived.
- **Progressive disclosure:** complexity appears only when it becomes useful.
- **Construction-first:** built around real construction material workflows, not a generic marketplace.

---

## Scope

SiteCycle is an MVP focused on construction material intelligence. It is **not** currently intended to be:

- A construction ERP
- A procurement system
- A logistics platform
- A payments platform
- A traditional marketplace

---

## Roadmap

- [ ] Persistent production database
- [ ] Project and organization accounts
- [ ] Verified material listings
- [ ] Real-time demand
- [ ] Transfer tracking
- [ ] Logistics coordination
- [ ] Evidence-backed environmental factors
- [ ] Construction document ingestion
- [ ] Material image recognition
- [ ] Reuse analytics
- [ ] Network-level circularity insights

---

## Status

**MVP: complete.** The current implementation demonstrates the full
`DECLARE → UNDERSTAND → MATCH → EVALUATE → TRANSFER → MEASURE` workflow.

---

## Author

**Befiker Gezahegn Hailemichael**
Software Engineer · Founder / Builder

[GitHub](https://github.com/BefikerG)

---

## License

This project is currently maintained as an experimental MVP. No open-source license has been specified.
