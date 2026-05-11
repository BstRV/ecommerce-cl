# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **white-label e-commerce monorepo** targeting the Chilean market, built on:
- **Backend:** MedusaJS v2 (headless commerce)
- **Frontend:** Next.js 15+ (App Router)
- **Monorepo orchestration:** Turborepo + npm workspaces (backend standalone)

## Commands

```bash
# Start all dev servers (frontend + backend)
npm run dev         # or: turbo run dev

# Build all packages
npm run build       # or: turbo run build

# Lint all packages
npm run lint        # or: turbo run lint
```

### Local Infrastructure (Docker)

```bash
# Start PostgreSQL, Redis, Meilisearch
docker-compose up -d

# Stop services
docker-compose down
```

Services exposed locally:
- PostgreSQL 15 → `localhost:5433` (db: `medusa_db`, user/pass: `medusa/medusa`)
- Redis → `localhost:6380`
- Meilisearch → `localhost:7700`

Copy `.env.example` to `apps/backend/.env` before starting the backend. See `docs/local-dev.md` for the full setup guide.

## Repository Structure

```
/
├── apps/
│   ├── storefront/        # Next.js 15+ App Router storefront
│   │   └── src/
│   │       ├── theme/     # CSS variable theme system
│   │       └── components/
│   └── backend/           # MedusaJS v2 API
│       └── src/
│           ├── api/       # Custom API routes
│           ├── plugins/   # Payment, invoicing, search plugins
│           └── subscribers/ # Webhook handlers
├── packages/
│   ├── ui/                # Shared Shadcn/UI + Tailwind components
│   ├── types/             # All shared TypeScript interfaces (source of truth)
│   ├── config/            # Shared ESLint, Tailwind, TSConfig
│   └── assets/            # brand.config.ts — single theming control point
├── docs/
├── docker-compose.yml
├── turbo.json
└── MasterPlan.md          # Full technical spec — read before implementing new features
```

## Architecture

### Monorepo Pattern

Turborepo pipelines run `dev`/`build`/`lint` across all `apps/` and `packages/`. Each app/package has its own `package.json`; shared code lives in `packages/`.

### Theming System (White-Label)

All visual styles flow through `packages/assets/brand.config.ts`. Components use CSS variables (defined in Tailwind config) rather than hardcoded colors. The default theme is neutral black & white. **Never use inline styles or hardcoded color values in components.**

### Type Sharing

All shared TypeScript interfaces belong in `packages/types`. Apps import from there — never duplicate type definitions across apps.

### Backend (MedusaJS v2)

MedusaJS custom logic is organized as plugins in `apps/backend/src/plugins/`:
- **Mercado Pago** — payment gateway with webhook subscriber
- **SimpleAPI** — Chilean electronic invoicing (Boleta Electrónica)
- **Meilisearch** — product indexing for faceted search
- **GCP Storage** — media/image storage

### Frontend (Next.js)

Uses the App Router. Product search leverages Meilisearch directly from the client for real-time faceted filtering.

## Code Standards

- **No `any`** — `@typescript-eslint/no-explicit-any` is set to `"error"`. All types must be explicit; use Zod for runtime validation at system boundaries (user input, API responses).
- **Styling** — Tailwind classes or CSS variables only. All theme values go through `brand.config.ts`.
- **Module resolution** — CommonJS (`"module": "commonjs"`) with `esModuleInterop` enabled.
- **Strict TypeScript** — `strict: true` and `noImplicitAny: true` are enforced globally.

## Key Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for MedusaJS |
| `REDIS_URL` | Redis connection string |
| `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` | CORS origins (required by MedusaJS) |
| `JWT_SECRET` / `COOKIE_SECRET` | Session secrets (required by MedusaJS) |
| `MEDUSA_ADMIN_TOKEN` | Admin panel authentication |
| `NEXT_PUBLIC_MEDUSA_URL` | Backend URL used by Next.js storefront |
| `MP_ACCESS_TOKEN` / `MP_PUBLIC_KEY` | Mercado Pago payment gateway |
| `SIMPLE_API_KEY` | SimpleAPI Chilean e-invoicing |
| `GCP_BUCKET_NAME` | Google Cloud Storage for media |
| `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY` | Search engine |

## Implementation Phases

The `MasterPlan.md` defines four phases. Always consult it before starting new features to understand scope, ordering, and design decisions that are already settled.

1. **Phase 1** — Core infra, brand config, MedusaJS models, Next.js storefront with filters
2. **Phase 2** — Mercado Pago, SimpleAPI invoicing, Meilisearch indexing, GCP Storage
3. **Phase 3** — Production deployment (Cloud SQL, Cloud Run, Vercel, Cloudflare)
4. **Phase 4** — Docs, monitoring, analytics
