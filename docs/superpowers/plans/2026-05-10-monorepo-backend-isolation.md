# Monorepo Backend Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar los errores fatales de arranque del backend (`tsconfig-paths` / `ajv`) aislando `apps/backend` de los workspaces npm y corrigiendo 6 problemas secundarios de configuración.

**Architecture:** Se excluye `apps/backend` del array de workspaces npm para que npm no hoisee sus dependencias MedusaJS a la raíz. Turborepo sigue orquestando el backend vía `turbo.json` sin cambios. Los packages `@ecommerce-preset/*` permanecen en workspaces normalmente.

**Tech Stack:** npm 11, Turborepo, MedusaJS v2.14.2, Next.js 15+, TypeScript, Zod v3

---

## Mapa de Archivos

| Archivo | Acción | Cambio |
|---|---|---|
| `package.json` | Modificar | Simplificar workspaces — excluir backend |
| `apps/backend/package.json` | Modificar | Renombrar + downgrade Zod |
| `.env.example` | Modificar | Completar 7 variables faltantes |
| `CLAUDE.md` | Modificar | Corregir puertos 5432→5433, 6379→6380 |
| `apps/backend/src/migration-scripts/initial-data-seed.ts` | Modificar | Chile/CLP en lugar de Europa/EUR |
| `docs/local-dev.md` | Crear | Guía de arranque local (humanos + agentes IA) |

---

## Task 1: Corregir workspaces npm en `package.json` raíz

**Files:**
- Modify: `package.json`

Este es el fix de causa raíz. npm ignora silenciosamente el objeto `{ packages, nohoist }` (sintaxis Yarn) y hoisea todas las deps de MedusaJS a la raíz, rompiendo la resolución de módulos del CLI.

- [ ] **Step 1: Abrir `package.json` raíz y reemplazar el bloque de workspaces**

Reemplazar:
```json
"workspaces": {
  "packages": [
    "apps/*",
    "packages/*"
  ],
  "nohoist": [
    "**/apps/backend",
    "**/apps/backend/**",
    "**/@medusajs/**",
    "**/@mikro-orm/**",
    "**/medusa-mikro-orm/**"
  ]
},
```

Por:
```json
"workspaces": [
  "apps/storefront",
  "packages/*"
],
```

El campo `overrides` existente (ajv) puede quedar o eliminarse — ya no será necesario una vez que el backend tenga sus deps aisladas en su propio `node_modules/`.

- [ ] **Step 2: Verificar la sintaxis del JSON resultante**

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('JSON válido')"
```

Resultado esperado: `JSON válido`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "fix: aislar apps/backend de workspaces npm para evitar hoisting de MedusaJS"
```

---

## Task 2: Corregir `apps/backend/package.json`

**Files:**
- Modify: `apps/backend/package.json`

Dos cambios independientes: renombrar el package al namespace correcto y bajar Zod de v4 a v3 (v4 no es compatible con el ecosistema MedusaJS v2).

- [ ] **Step 1: Cambiar el nombre del package**

Buscar:
```json
"name": "@dtc/backend",
```

Reemplazar por:
```json
"name": "@ecommerce-preset/backend",
```

- [ ] **Step 2: Hacer downgrade de Zod**

Buscar en `"dependencies"`:
```json
"zod": "4.2.0"
```

Reemplazar por:
```json
"zod": "^3.23.0"
```

- [ ] **Step 3: Verificar el JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('apps/backend/package.json','utf8')); console.log('JSON válido')"
```

Resultado esperado: `JSON válido`

- [ ] **Step 4: Commit**

```bash
git add apps/backend/package.json
git commit -m "fix(backend): renombrar a @ecommerce-preset/backend y bajar Zod a v3"
```

---

## Task 3: Completar `.env.example`

**Files:**
- Modify: `.env.example`

MedusaJS no arranca si `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `JWT_SECRET` o `COOKIE_SECRET` están ausentes (los usa con `!` en `medusa-config.ts`). El storefront necesita `NEXT_PUBLIC_MEDUSA_URL`.

- [ ] **Step 1: Reemplazar el contenido completo de `.env.example`**

```env
# ── Base de datos ──────────────────────────────────────────────────────────────
# docker-compose expone postgres en el puerto HOST 5433 (container: 5432)
DATABASE_URL=postgres://medusa:medusa@localhost:5433/medusa_db

# ── Redis ──────────────────────────────────────────────────────────────────────
# docker-compose expone redis en el puerto HOST 6380 (container: 6379)
REDIS_URL=redis://localhost:6380

# ── CORS ───────────────────────────────────────────────────────────────────────
# Requeridos por MedusaJS para iniciar el servidor HTTP
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:3000

# ── Secretos ───────────────────────────────────────────────────────────────────
JWT_SECRET=supersecret-change-in-prod
COOKIE_SECRET=supersecret-change-in-prod

# ── Medusa Admin ───────────────────────────────────────────────────────────────
MEDUSA_ADMIN_TOKEN=supersecretadmin

# ── Storefront → Backend ───────────────────────────────────────────────────────
# Usado por Next.js para apuntar al backend local
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000

# ── Mercado Pago ───────────────────────────────────────────────────────────────
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=

# ── SimpleAPI (Facturación Electrónica Chile) ──────────────────────────────────
SIMPLE_API_KEY=

# ── Google Cloud Storage ───────────────────────────────────────────────────────
GCP_BUCKET_NAME=

# ── Meilisearch ────────────────────────────────────────────────────────────────
# docker-compose expone Meilisearch en puerto 7700
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey123
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "fix: completar .env.example con variables CORS, Redis, JWT y Medusa faltantes"
```

---

## Task 4: Corregir puertos documentados en `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

`CLAUDE.md` documenta `localhost:5432` y `localhost:6379`, pero `docker-compose.yml` mapea `5433:5432` y `6380:6379`. Los puertos incorrectos confunden a agentes IA que leen este archivo como fuente de verdad.

- [ ] **Step 1: Corregir el puerto de PostgreSQL**

Buscar:
```
- PostgreSQL 15 → `localhost:5432` (db: `medusa_db`, user/pass: `medusa/medusa`)
```

Reemplazar por:
```
- PostgreSQL 15 → `localhost:5433` (db: `medusa_db`, user/pass: `medusa/medusa`)
```

- [ ] **Step 2: Corregir el puerto de Redis**

Buscar:
```
- Redis → `localhost:6379`
```

Reemplazar por:
```
- Redis → `localhost:6380`
```

- [ ] **Step 3: Verificar contra docker-compose.yml**

```bash
grep -E "5433|6380|7700" docker-compose.yml
```

Resultado esperado: líneas con los tres puertos confirmando que el mapeo existe en docker-compose.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: corregir puertos de PostgreSQL (5433) y Redis (6380) en CLAUDE.md"
```

---

## Task 5: Adaptar seed inicial a Chile / CLP

**Files:**
- Modify: `apps/backend/src/migration-scripts/initial-data-seed.ts`

El seed actual configura Europa/EUR (Copenhagen, países GB/DE/DK/SE/FR/ES/IT, precios en EUR/USD). El proyecto es un preset para el mercado chileno.

Nota: CLP (Peso Chileno) es una moneda de cero decimales — los amounts son pesos enteros (p. ej. `9990` = $9.990 CLP).

- [ ] **Step 1: Cambiar el array de países**

Buscar (línea 37):
```typescript
const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];
```

Reemplazar por:
```typescript
const countries = ["cl"];
```

- [ ] **Step 2: Cambiar nombre y monedas del store**

Buscar:
```typescript
        {
          name: "Default Store",
          supported_currencies: [
            {
              currency_code: "eur",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
```

Reemplazar por:
```typescript
        {
          name: "Tienda Ecommerce Preset",
          supported_currencies: [
            {
              currency_code: "clp",
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
```

- [ ] **Step 3: Cambiar región a Chile/CLP**

Buscar:
```typescript
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
```

Reemplazar por:
```typescript
        {
          name: "Chile",
          currency_code: "clp",
          countries,
          payment_providers: ["pp_system_default"],
        },
```

- [ ] **Step 4: Cambiar stock location a Santiago**

Buscar:
```typescript
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
```

Reemplazar por:
```typescript
        {
          name: "Bodega Santiago",
          address: {
            city: "Santiago",
            country_code: "CL",
            address_1: "",
          },
        },
```

- [ ] **Step 5: Cambiar fulfillment set a Chile**

Buscar:
```typescript
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });
```

Reemplazar por:
```typescript
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Bodega Santiago delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Chile",
        geo_zones: [
          {
            country_code: "cl",
            type: "country",
          },
        ],
      },
    ],
  });
```

- [ ] **Step 6: Cambiar precios de opciones de envío a CLP**

Buscar el bloque de `createShippingOptionsWorkflow` completo (desde `await createShippingOptionsWorkflow(container).run({` hasta el `]);` de cierre que sigue a los dos objetos de shipping option) y reemplazar por:

```typescript
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Envío Estándar",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Estándar",
          description: "Entrega en 3-5 días hábiles.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "clp",
            amount: 3990,
          },
          {
            region_id: region.id,
            amount: 3990,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Envío Express",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Entrega en 24-48 horas hábiles.",
          code: "express",
        },
        prices: [
          {
            currency_code: "clp",
            amount: 7990,
          },
          {
            region_id: region.id,
            amount: 7990,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
```

- [ ] **Step 7: Cambiar precios de productos a CLP**

En todos los objetos `prices` dentro de `createProductsWorkflow`, reemplazar el patrón EUR/USD por CLP. El patrón original en cada variante es:

```typescript
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
```

Reemplazar cada aparición (hay ~20 variantes en total entre Camiseta, Sudadera, Pantalón y Shorts) por:

```typescript
              prices: [
                {
                  amount: 9990,
                  currency_code: "clp",
                },
              ],
```

Para hacer este reemplazo masivo de forma segura, ejecutar:

```bash
# Verificar cuántas ocurrencias del patrón EUR existen en el seed
grep -c '"currency_code": "eur"' apps/backend/src/migration-scripts/initial-data-seed.ts
```

Resultado esperado: un número igual o mayor a 20 (una por cada variante + las de shipping).

Luego editar el archivo reemplazando todos los bloques `prices` de variantes de productos individualmente. La estrategia más segura es usar el editor — buscar `currency_code: "eur"` y reemplazar cada bloque contextualmente.

- [ ] **Step 8: Verificar que no quedan referencias EUR/USD en el seed**

```bash
grep -n "eur\|usd\|Europe\|Copenhagen\|European" apps/backend/src/migration-scripts/initial-data-seed.ts
```

Resultado esperado: sin output (ninguna línea que coincida).

- [ ] **Step 9: Verificar que TypeScript compila el archivo**

```bash
cd apps/backend && npx tsc --noEmit --skipLibCheck 2>&1 | head -30
```

Resultado esperado: sin errores de TypeScript en el archivo del seed.

- [ ] **Step 10: Commit**

```bash
git add apps/backend/src/migration-scripts/initial-data-seed.ts
git commit -m "fix(seed): adaptar datos iniciales a Chile — moneda CLP, región Chile, Bodega Santiago"
```

---

## Task 6: Crear `docs/local-dev.md`

**Files:**
- Create: `docs/local-dev.md`

Guía de arranque local con dos secciones: una para humanos (con contexto y troubleshooting) y una para agentes IA (formato runbook estructurado con criterios de éxito verificables).

- [ ] **Step 1: Crear el archivo**

```markdown
# Guía de Arranque Local

## Para Humanos

### Prerrequisitos

- **Node.js 20+** — verificar con `node --version`
- **npm 11+** — verificar con `npm --version`
- **Docker Desktop** corriendo — necesario para PostgreSQL, Redis y Meilisearch
- Variables de entorno configuradas (ver paso 4)

### Pasos

**1. Clonar e instalar dependencias del monorepo**

```bash
npm install
```

Esto instala las dependencias del storefront (`apps/storefront`) y los packages compartidos (`packages/*`). El backend **no** está en workspaces npm y se instala por separado.

**2. Instalar dependencias del backend**

```bash
cd apps/backend && npm install
```

El backend gestiona sus propias dependencias de forma standalone para evitar conflictos de hoisting con MedusaJS.

**3. Levantar infraestructura local**

```bash
docker-compose up -d
```

Servicios levantados:
- **PostgreSQL 15** → `localhost:5433` (user: `medusa`, pass: `medusa`, db: `medusa_db`)
- **Redis** → `localhost:6380`
- **Meilisearch** → `localhost:7700`

**4. Configurar variables de entorno**

```bash
cp .env.example apps/backend/.env
```

Para desarrollo local los valores de `.env.example` funcionan sin modificación. Si necesitas integrar Mercado Pago, SimpleAPI o GCP Storage, edita `apps/backend/.env` y completa los tokens correspondientes.

**5. Sincronizar base de datos**

```bash
cd apps/backend && npx medusa db:sync
```

Crea las tablas del esquema de MedusaJS en PostgreSQL. Si la base de datos ya tiene tablas de una sesión anterior, este comando aplica solo las migraciones pendientes.

**6. Cargar datos iniciales (primera vez)**

```bash
cd apps/backend && npx medusa exec ./src/migration-scripts/initial-data-seed.ts
```

Crea: canal de ventas, API key publicable, store "Tienda Ecommerce Preset" (CLP), región Chile, bodega Santiago, opciones de envío en CLP, y productos de muestra.

**Sólo ejecutar una vez.** Si ya existe data en la BD, este script fallará con errores de duplicados — es el comportamiento esperado.

**7. Arrancar todo**

Desde la raíz del monorepo:

```bash
npm run dev
```

Turborepo arranca en paralelo:
- Backend MedusaJS → `http://localhost:9000`
- Storefront Next.js → `http://localhost:3000`

### Verificación

| URL | Resultado esperado |
|---|---|
| `http://localhost:9000/health` | `{"status":"ok"}` |
| `http://localhost:9000/app` | Panel de administración MedusaJS |
| `http://localhost:3000` | Storefront Next.js |

### Troubleshooting

**Error: `TypeError: The "path" argument must be of type string. Received undefined`**
El backend se instaló dentro de los workspaces npm (hoisting activo). Verifica que `package.json` raíz tenga `"workspaces": ["apps/storefront", "packages/*"]` (array, no objeto). Luego borra `node_modules/` raíz y `apps/backend/node_modules/` y reinstala.

**Error: `Cannot find module 'ajv/dist/core'`**
Mismo problema de hoisting. Ver solución anterior.

**Error: `connect ECONNREFUSED 127.0.0.1:5433`**
Docker no está corriendo o el contenedor de PostgreSQL no arrancó. Ejecutar `docker-compose up -d` y verificar con `docker ps`.

**Error: `STORE_CORS is not defined`**
Falta el archivo `.env` en `apps/backend/`. Ejecutar `cp .env.example apps/backend/.env`.

**Puerto 9000 ya en uso**
Otro proceso ocupa el puerto. En macOS/Linux: `lsof -i :9000 | grep LISTEN`. En Windows: `netstat -ano | findstr :9000`.

---

## Para Agentes IA

### Formato Runbook

Cada paso incluye: estado previo esperado, comando exacto, criterio de éxito verificable y acción de fallback.

---

**STEP 1 — Verificar prerrequisitos**

```bash
node --version && npm --version && docker info --format '{{.ServerVersion}}'
```

Criterio de éxito: Node ≥ 20.x, npm ≥ 11.x, Docker responde con versión.
Fallback: si Docker falla, ejecutar Docker Desktop manualmente antes de continuar.

---

**STEP 2 — Instalar dependencias del monorepo**

Estado previo: directorio raíz del repo, sin `node_modules/` raíz o con instalación previa.

```bash
npm install
```

Criterio de éxito: comando termina con código de salida 0, existe `node_modules/` en raíz.
Fallback: si falla con errores de workspace, verificar que `package.json` raíz contenga `"workspaces": ["apps/storefront", "packages/*"]` como array.

---

**STEP 3 — Instalar dependencias del backend**

Estado previo: desde el directorio raíz.

```bash
cd apps/backend && npm install
```

Criterio de éxito: comando termina con código de salida 0, existe `apps/backend/node_modules/@medusajs/`.
Verificación:
```bash
ls apps/backend/node_modules/@medusajs/cli/
```
Fallback: si falla, verificar Node ≥ 20 con `node --version`.

---

**STEP 4 — Levantar infraestructura Docker**

Estado previo: Docker Desktop corriendo.

```bash
docker-compose up -d
```

Criterio de éxito:
```bash
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
```
Todas las filas deben mostrar `Up` o `running`.

Verificación adicional:
```bash
# PostgreSQL responde
docker exec $(docker-compose ps -q db) pg_isready -U medusa
# Redis responde
docker exec $(docker-compose ps -q redis) redis-cli ping
```
Esperado: `medusa_db:5432 - accepting connections` y `PONG`.

Fallback: si un contenedor no arranca, ejecutar `docker-compose logs <servicio>` para diagnóstico.

---

**STEP 5 — Configurar variables de entorno**

Estado previo: `.env.example` existe en raíz.

```bash
cp .env.example apps/backend/.env
```

Criterio de éxito:
```bash
grep "STORE_CORS" apps/backend/.env
```
Esperado: línea con `STORE_CORS=http://localhost:3000`.

---

**STEP 6 — Sincronizar base de datos**

Estado previo: `apps/backend/.env` existe, Docker con PostgreSQL corriendo en `localhost:5433`.

```bash
cd apps/backend && npx medusa db:sync
```

Criterio de éxito: comando termina con código de salida 0 sin líneas `ERROR` en stdout.
Tiempo esperado: 10-60 segundos (primera vez aplica todas las migraciones).

Fallback: si falla con `ECONNREFUSED`, PostgreSQL no está listo — reintentar después de `docker-compose up -d` y esperar 5 segundos.

---

**STEP 7 — Seed de datos iniciales (sólo si la BD está vacía)**

Estado previo: BD sincronizada, sin datos de store previos.

```bash
cd apps/backend && npx medusa exec ./src/migration-scripts/initial-data-seed.ts
```

Criterio de éxito: últimas líneas del output incluyen `Finished seeding inventory levels data.`
Fallback: si falla con `duplicate key value`, los datos ya existen — omitir este paso, es seguro continuar.

---

**STEP 8 — Arrancar el backend y verificar health**

```bash
cd apps/backend && npx medusa develop &
sleep 15
curl -s http://localhost:9000/health
```

Criterio de éxito: respuesta JSON contiene `"status":"ok"`.
Fallback: si `curl` devuelve `Connection refused` después de 15 segundos, revisar stdout del proceso medusa para errores de configuración (CORS, JWT, DB).

---

**STEP 9 — Arrancar todo desde la raíz**

```bash
# Desde la raíz del monorepo
npm run dev
```

Criterio de éxito (verificar después de ~30 segundos):
```bash
curl -s http://localhost:9000/health | grep ok
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```
Esperado: `{"status":"ok"}` y código HTTP `200`.

---

**STEP 10 — Verificación final del endpoint de analytics**

```bash
curl -s -X POST http://localhost:9000/store/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type":"view_item","product_id":"test-123"}' \
  -w "\nHTTP %{http_code}"
```

Criterio de éxito: `{"ok":true}` con HTTP `201`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/local-dev.md
git commit -m "docs: agregar guía de arranque local para humanos y agentes IA"
```

---

## Task 7: Reinstalar dependencias y verificar arranque

Esta task valida que los 6 cambios anteriores resuelven los errores fatales de arranque.

**Pre-condición:** Todos los tasks anteriores completados y commiteados.

- [ ] **Step 1: Borrar node_modules de la raíz y reinstalar**

```bash
rm -rf node_modules
npm install
```

Criterio de éxito: finaliza con código 0. Verificar que `apps/backend/` **no** aparece dentro de `node_modules/`:
```bash
ls node_modules | grep -i backend
```
Resultado esperado: sin output (backend no hoisteado).

- [ ] **Step 2: Instalar dependencias del backend standalone**

```bash
cd apps/backend && npm install
```

Criterio de éxito: `apps/backend/node_modules/@medusajs/cli/` existe.

```bash
ls apps/backend/node_modules/@medusajs/cli/
```

- [ ] **Step 3: Verificar que docker-compose está levantado**

```bash
docker-compose up -d
docker-compose ps
```

Todos los servicios deben mostrar estado `Up`.

- [ ] **Step 4: Copiar .env al backend si no existe**

```bash
[ -f apps/backend/.env ] || cp .env.example apps/backend/.env
```

- [ ] **Step 5: Sincronizar BD**

```bash
cd apps/backend && npx medusa db:sync
```

Criterio de éxito: sin errores fatales en output.

- [ ] **Step 6: Arrancar el backend en modo dev y capturar primeras líneas**

```bash
cd apps/backend && timeout 30 npx medusa develop 2>&1 | head -50
```

Criterio de éxito: el output **no** contiene:
- `TypeError: The "path" argument must be of type string`
- `Cannot find module 'ajv/dist/core'`

Y **sí** contiene alguna de:
- `Server started on port 9000`
- `Medusa is running on port 9000`
- `Starting Medusa app`

- [ ] **Step 7: Verificar el endpoint de health**

Con el backend corriendo (desde otro terminal o en background):

```bash
curl -s http://localhost:9000/health
```

Resultado esperado:
```json
{"status":"ok"}
```

- [ ] **Step 8: Verificar el endpoint de analytics**

```bash
curl -s -X POST http://localhost:9000/store/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type":"view_item","product_id":"prod_test"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

Resultado esperado:
```
{"ok":true}
HTTP Status: 201
```

- [ ] **Step 9: Arrancar todo desde la raíz**

```bash
# Detener el backend manual si está corriendo
# Desde raíz del monorepo:
npm run dev
```

Turbo arranca storefront y backend en paralelo. Ambos deben iniciar sin errores de resolución de módulos.

---

## Criterios de Éxito Globales

Al completar todos los tasks:

1. `npm run dev` desde la raíz arranca backend y storefront sin errores de `tsconfig-paths` ni `ajv`
2. `GET http://localhost:9000/health` → `{"status":"ok"}`
3. `POST http://localhost:9000/store/analytics/track` con payload válido → `{"ok":true}` y HTTP 201
4. Panel admin accesible en `http://localhost:9000/app`
5. Storefront accesible en `http://localhost:3000`
6. Un agente IA puede seguir `docs/local-dev.md` (sección Agentes IA) desde cero y llegar al criterio 2 sin intervención humana
