# SiteCycle

> **Find the next project for materials before they become waste.**

SiteCycle is a construction material intelligence platform that helps project teams identify reusable surplus materials and match them with nearby construction projects that need them.

Instead of treating leftover construction materials as waste, SiteCycle turns them into structured, searchable resources that can be evaluated, transferred, and measured for impact.

**Product thesis:**

> **AI interprets. Software calculates. AI explains.**

---

## Why SiteCycle?

Construction projects frequently have materials left over while other projects may need those same materials.

The problem is not simply finding buyers. It is understanding messy material information, identifying compatible demand, evaluating proximity and availability, and making the potential reuse opportunity understandable.

SiteCycle addresses that workflow as an intelligence layer:

```text
Messy Input
    ↓
AI Understanding
    ↓
Structured Materials
    ↓
Deterministic Matching
    ↓
Explainable Recommendation
    ↓
Transfer Plan
    ↓
Impact Measurement
Product Workflow
01 — DECLARE
A project team describes surplus materials naturally:

"We have about 1,200 hollow blocks, 20 steel beams and around 45 sheets of plywood left over."

02 — UNDERSTAND
AI extracts structured material information from the description.

For example:

1,200 hollow blocks → Hollow Concrete Block × 1,200 pieces
20 steel beams      → Steel Beam × 20 pieces
45 sheets plywood  → Plywood Sheet × 45 sheets
The extracted information can be reviewed and edited before it becomes inventory.

03 — MATCH
SiteCycle evaluates potential destination projects using deterministic rules.

Matching considers:

Material compatibility

Quantity coverage

Geographic distance

Material condition

Demand urgency

The matching engine does not ask an LLM to calculate the score.

04 — EVALUATE
Each candidate match includes:

Match score

Distance

Quantity coverage

Factor breakdown

Material-level details

AI-generated explanation

The numerical reasoning remains deterministic and auditable.

05 — TRANSFER
A selected match can become a proposed transfer plan.

Transfer quantities are capped by available surplus and destination demand.

AI can provide a concise operational recommendation based on the calculated transfer data.

06 — MEASURE
SiteCycle calculates the potential impact of completed transfer records.

Impact includes:

Material mass

Recovered material value

Waste avoided

Estimated CO₂e avoided

Every metric carries provenance:

Observed · Calculated · Estimated

AI Architecture
SiteCycle deliberately separates AI responsibilities from deterministic business logic.

                    ┌─────────────────────┐
                    │      User Input     │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │    AI Extraction    │
                    │  Natural Language → │
                    │   Structured JSON   │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │ Deterministic Core  │
                    │                     │
                    │ • Matching          │
                    │ • Distance          │
                    │ • Quantities        │
                    │ • Impact            │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │     AI Explain      │
                    │                     │
                    │ Facts → Narrative   │
                    └─────────────────────┘
AI responsibilities
AI is used for:

Material extraction

Natural language → structured material data

Match explanation

Deterministic match facts → human-readable explanation

Transfer recommendation

Deterministic transfer data → concise operational narrative

AI does not calculate
AI does not determine:

Match scores

Distances

Quantities

Material mass

Recovered value

Waste avoided

CO₂e estimates

This keeps the core system reproducible and auditable.

Graceful degradation
SiteCycle remains functional when AI is unavailable.

The application includes deterministic fallbacks for:

Material extraction

Match explanations

Transfer recommendations

AI enhances the workflow rather than becoming a single point of failure.

Matching Engine
Candidate matches are evaluated using a deterministic weighted scoring model.

Factor	Weight
Material compatibility	30%
Quantity coverage	25%
Distance	20%
Condition	15%
Urgency	10%
Additional constraints include:

50 km geographic cutoff

Minimum quantity coverage threshold

Source project exclusion

Deterministic tie-breaking

Distance is calculated using the Haversine formula.

The result is a reproducible ranking that can be inspected rather than an opaque AI-generated recommendation.

Impact Model
SiteCycle calculates impact from canonical material factors.

Conceptually:

Mass
= Quantity × Weight per Unit

Recovered Value
= Quantity × Unit Value

Waste Avoided
= Transferred Material Mass

Estimated CO₂e Avoided
= Material Mass × CO₂e Factor
The current demonstration factors are illustrative assumptions used to demonstrate the product workflow. They are not presented as certified environmental measurements.

Tech Stack
Application
Next.js

React

TypeScript

Tailwind CSS

App Router

AI
OpenRouter

Zod schema validation

Server-side AI API routes

Deterministic fallback parsing

Core Logic
TypeScript

Haversine geospatial calculations

Deterministic matching engine

Deterministic impact calculations

In-memory demo persistence

Deployment
Designed for deployment on Vercel.

Project Structure
src/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── extract/
│   │       ├── explain/
│   │       └── transfer/
│   │
│   ├── materials/
│   │   └── new/
│   ├── matches/
│   │   └── [id]/
│   ├── transfers/
│   │   └── [id]/
│   ├── impact/
│   ├── network/
│   └── actions.ts
│
└── lib/
    ├── ai/
    ├── geo/
    ├── impact/
    ├── matching/
    ├── data/
    ├── materials/
    └── types.ts
Getting Started
Requirements
Node.js 18+

npm

Installation
git clone https://github.com/BefikerG/SiteCycle.git
cd SiteCycle
npm install
Environment Variables
Create .env.local:

OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=your_model
The AI integration is optional. Without an OpenRouter key, SiteCycle uses its deterministic fallback implementations.

Run locally
npm run dev
Open:

http://localhost:3000
Production build
npm run build
Demo Scenario
The seeded demonstration uses:

Source

Bole Commercial Center

Destination

Kality Residential Development

Input

"We have about 1,200 hollow blocks, 20 steel beams and around 45 sheets of plywood left over."

The system then demonstrates the complete workflow:

Natural-language surplus
        ↓
AI material extraction
        ↓
Editable inventory
        ↓
Deterministic matching
        ↓
Match detail + explanation
        ↓
Transfer plan
        ↓
Impact measurement
Design Principles
Deterministic core
Business-critical calculations should be reproducible.

AI as an enhancement
AI handles interpretation and communication, not core numerical truth.

Explainability
Users should be able to understand why a match exists.

Provenance
Impact numbers explicitly communicate whether they are observed, calculated, or estimated.

Progressive disclosure
The interface reveals complexity when it becomes useful instead of presenting every system detail at once.

Construction-first UX
The product is designed around real project workflows rather than generic marketplace interactions.

Current Scope
SiteCycle is currently an MVP demonstrating the core intelligence workflow.

It intentionally does not attempt to be:

A construction ERP

A procurement system

A logistics platform

A payments platform

A traditional marketplace

The current focus is the intelligence layer connecting surplus material with nearby demand.

Roadmap
Potential future development includes:

Persistent production database

Real project onboarding

User and organization accounts

Verified material listings

More robust geospatial infrastructure

Real-time project demand

Transfer status tracking

Logistics coordination

Evidence-backed environmental factors

Construction document ingestion

Material image recognition

Historical reuse analytics

Network-level circularity insights

Status
MVP — Complete

The current implementation demonstrates the full:

DECLARE → UNDERSTAND → MATCH → EVALUATE → TRANSFER → MEASURE

workflow.

Production build currently passes with TypeScript and lint checks clean.

Author
Befiker Gezahegn Hailemichael

Software Engineer · Founder / Builder

GitHub: @BefikerG

License
This project is currently maintained as an experimental MVP.

License terms may be added as the project moves toward public release.
