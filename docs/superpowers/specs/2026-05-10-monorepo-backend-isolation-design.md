# Spec: Aislamiento del Backend y Estabilización del Monorepo

**Fecha:** 2026-05-10
**Estado:** Aprobado
**Fase MasterPlan:** 1.3 (Backend Core)
**Autor:** Claude Code (claude-sonnet-4-6)

---

## Problema

El backend (`apps/backend`) no puede arrancar porque sus dependencias (`@medusajs/cli`, `@mikro-orm/*`) están siendo **hoisted a la raíz** del monorepo npm. Esto ocurre porque la configuración de `nohoist` en `package.json` usa sintaxis de Yarn workspaces, que npm ignora silenciosamente.

Consecuencia: dos errores fatales al ejecutar `npm run dev`:

1. `tsconfig-paths`: `TypeError: The "path" argument must be of type string. Received undefined` — el CLI de MedusaJS encuentra el `tsconfig.json` raíz en vez del de `apps/backend`.
2. `Cannot find module 'ajv/dist/core'` — conflicto de versiones de `ajv` entre el árbol hoisted y lo que `@mikro-orm/migrations` espera.

Problemas secundarios identificados en la auditoría:

- `.env.example` incompleto: faltan `REDIS_URL`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `JWT_SECRET`, `COOKIE_SECRET`, `NEXT_PUBLIC_MEDUSA_URL`.
- `CLAUDE.md` documenta puertos incorrectos (5432/6379 en vez de 5433/6380 según docker-compose).
- Nombre del backend `@dtc/backend` inconsistente con el namespace `@ecommerce-preset/*`.
- Seed (`migration-scripts/initial-data-seed.ts`) configura región Europa/EUR, no Chile/CLP.
- `zod: 4.2.0` en backend — versión mayor nueva con posibles incompatibilidades en el ecosistema MedusaJS v2 (que espera zod v3).
- Falta documentación de arranque local tanto para humanos como para agentes de IA.

---

## Decisión de Arquitectura: Enfoque A

**Excluir `apps/backend` de los npm workspaces.**

El backend gestiona sus dependencias de forma standalone (igual que un proyecto MedusaJS puro). Turborepo sigue orquestando los scripts vía `turbo.json` sin cambios, ya que turbo descubre packages por `package.json`, no por workspaces npm.

Los packages `@ecommerce-preset/*` permanecen en workspaces normalmente — sólo el backend queda aislado.

### Por qué esta decisión

- MedusaJS v2 no está diseñado para coexistir con hoisting de dependencias. Sus módulos usan resolución de paths que asume que sus deps están en `node_modules/` local.
- Aislar el backend replica el setup que MedusaJS recomienda para monorepos npm. Es el cambio mínimo que elimina la causa raíz.
- No requiere cambiar el package manager (alternativa: pnpm). El costo de migración a pnpm no está justificado en esta fase.

---

## Cambios de Implementación

### 1. `package.json` raíz

**Antes:**
```json
"workspaces": {
  "packages": ["apps/*", "packages/*"],
  "nohoist": ["**/apps/backend", "**/apps/backend/**", "**/@medusajs/**", "**/@mikro-orm/**", "**/medusa-mikro-orm/**"]
}
```

**Después:**
```json
"workspaces": ["apps/storefront", "packages/*"]
```

`apps/backend` queda fuera del array. npm no intentará hoist sus dependencias.

### 2. `apps/backend/package.json` — renombrar package

```json
"name": "@ecommerce-preset/backend"
```

Alineación con el namespace `@ecommerce-preset/*` del monorepo.

### 3. `.env.example` raíz — completar todas las variables

```env
# Base de datos
DATABASE_URL=postgres://medusa:medusa@localhost:5433/medusa_db

# Redis (docker-compose expone puerto 6380 en host)
REDIS_URL=redis://localhost:6380

# CORS — requeridos por MedusaJS para iniciar el servidor HTTP
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:3000

# Secretos JWT/Cookie
JWT_SECRET=supersecret-change-in-prod
COOKIE_SECRET=supersecret-change-in-prod

# Medusa Admin
MEDUSA_ADMIN_TOKEN=supersecretadmin

# Storefront → Backend URL (usado por Next.js)
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000

# Mercado Pago
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=

# SimpleAPI (Facturación Electrónica Chile)
SIMPLE_API_KEY=

# Google Cloud Storage
GCP_BUCKET_NAME=

# Meilisearch (docker-compose expone puerto 7700 en host)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey123
```

### 4. `apps/backend/migration-scripts/initial-data-seed.ts` — región Chile

Cambios:
- Moneda por defecto: `"clp"` (Peso Chileno)
- Países de la región: `["cl"]`
- Nombre de región: `"Chile"`
- Nombre del almacén: `"Bodega Santiago"`
- Dirección del almacén: Santiago, CL
- Nombre del store: `"Tienda Ecommerce Preset"`
- Provider de impuesto: mantener `"tp_system"` (se configura en admin)
- Rutas de envío: precios en CLP (valores de ejemplo)

### 5. `apps/backend/package.json` — downgrade Zod

```json
"zod": "^3.23.0"
```

Zod v3 es lo que el ecosistema MedusaJS v2 usa internamente. La API usada en el proyecto (`z.object`, `z.enum`, `z.string`, `z.record`, `z.unknown`, `safeParse`) es idéntica entre v3 y v4 — el downgrade no requiere cambios de código.

### 6. `CLAUDE.md` — corregir puertos documentados

- `PostgreSQL 15 → localhost:5432` → corregir a `localhost:5433`
- `Redis → localhost:6379` → corregir a `localhost:6380`
- Agregar referencia a `docs/local-dev.md` en sección de comandos

### 7. `docs/local-dev.md` — guía de arranque local

Documento único con dos secciones:

- **Para humanos:** prerrequisitos, pasos con contexto, qué esperar en consola, troubleshooting de errores comunes.
- **Para agentes IA:** formato runbook estructurado — estado previo, comando exacto, criterio de éxito verificable, acción en caso de fallo.

---

## Flujo de Instalación Post-Fix

```bash
# 1. Instalar dependencias del monorepo (storefront + packages)
npm install

# 2. Instalar dependencias del backend (standalone)
cd apps/backend && npm install

# 3. Levantar infraestructura local
docker-compose up -d

# 4. Copiar y completar variables de entorno del backend
cp .env.example apps/backend/.env   # luego editar si es necesario

# 5. Correr migraciones del backend
cd apps/backend && npx medusa db:sync

# 6. Correr seed inicial (opcional)
cd apps/backend && npx medusa exec ./src/migration-scripts/initial-data-seed.ts

# 7. Arrancar todo desde la raíz
npm run dev
```

---

## Lo que NO cambia

- `turbo.json` — sin cambios. Turbo detecta `apps/backend` por su `package.json`.
- `apps/backend/src/` — ningún archivo de código cambia.
- `packages/*` — sin cambios.
- `apps/storefront/` — sin cambios de código. Solo hereda el `.env.example` corregido.
- `docker-compose.yml` — sin cambios.
- Estructura de directorios — sin cambios. Los subdirectorios de `src/` permanecen igual.

---

## Criterios de Éxito

1. `npm run dev` desde la raíz arranca el backend sin errores de `tsconfig-paths` ni `ajv`.
2. `medusa develop` en `apps/backend/` arranca en el puerto 9000.
3. `next dev` en `apps/storefront/` arranca en el puerto 3000.
4. `GET http://localhost:9000/health` retorna `200`.
5. `POST http://localhost:9000/store/analytics/track` acepta payload y retorna `201`.
6. Panel admin accesible en `http://localhost:9000/app`.
7. Un agente de IA puede seguir `docs/local-dev.md` desde cero y llegar al criterio 4 sin intervención humana.
