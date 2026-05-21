# Seed de Productos de Ejemplo (Local) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ejecutar el seed existente de MedusaJS para que el storefront muestre productos reales al navegar localmente, y corregir la cabecera `x-publishable-api-key` que el cliente actual no envía.

**Architecture:** El seed popula PostgreSQL a través de los workflows de MedusaJS, que son los mismos flujos de producción. El storefront lee productos vía `/store/products` — pero MedusaJS v2 exige la cabecera `x-publishable-api-key` en todas las llamadas de tienda; actualmente el cliente `medusa.ts` no la envía, lo que produce lista vacía. Se agrega la key al `.env.local` del storefront (en `.gitignore`) y se inyecta en el cliente.

**Tech Stack:** MedusaJS v2.14.2, PostgreSQL 15 (Docker, puerto 5433), Next.js 15 (App Router), npm workspaces

---

## Prerequisitos antes de empezar

Estos no son pasos del plan — son condiciones que deben cumplirse antes de ejecutar cualquier tarea:

| Condición | Cómo verificar |
|---|---|
| Docker Desktop corriendo | `docker info` sin error |
| Node.js ≥ 20 | `node --version` → `v20.x.x` |
| `apps/backend/.env` existe | Ya está configurado (confirmado) |
| Backend con migraciones aplicadas | Ver Tarea 1 |

---

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `apps/backend/src/migration-scripts/initial-data-seed.ts` | Solo leer / ejecutar | Script de seed existente — no modificar |
| `apps/storefront/.env.local` | **Crear** | Variables locales del storefront (gitignoreado) |
| `apps/storefront/src/lib/medusa.ts` | **Modificar** `:130-145` | Agregar `x-publishable-api-key` en cada request |
| `.gitignore` | **Modificar** | Agregar `apps/storefront/.env.local` |

---

## Tarea 1 — Levantar infraestructura y migrar la base de datos

**Files:**
- No se crean ni modifican archivos

- [ ] **Step 1: Levantar servicios Docker**

```powershell
docker-compose up -d
```

Esperado: contenedores `postgres`, `redis`, `meilisearch` en estado `Up`.

- [ ] **Step 2: Verificar que PostgreSQL acepte conexiones**

```powershell
docker-compose exec postgres pg_isready -U medusa
```

Esperado: `localhost:5432 - accepting connections`

Si falla, esperar 10 segundos y reintentar.

- [ ] **Step 3: Instalar dependencias del backend (si no están)**

```powershell
cd apps/backend
npm install --legacy-peer-deps
cd ../..
```

> `--legacy-peer-deps` es necesario por el conflicto interno de MedusaJS 2.14.2 entre react@18 y react@19.

- [ ] **Step 4: Ejecutar las migraciones de base de datos**

```powershell
cd apps/backend
npx medusa db:migrate
```

Esperado: líneas de log `[info] Running migration...` seguidas de `[info] Migrations complete`.

Si el comando falla con `relation already exists`, las migraciones ya están aplicadas — continuar igual.

- [ ] **Step 5: Verificar las migraciones**

```powershell
# Conectarse a la BD y listar tablas
docker-compose exec postgres psql -U medusa -d medusa_db -c "\dt" | head -20
```

Esperado: ver tablas como `product`, `product_variant`, `region`, etc.

---

## Tarea 2 — Ejecutar el seed de datos

**Files:**
- Ejecutar: `apps/backend/src/migration-scripts/initial-data-seed.ts`

- [ ] **Step 1: Ejecutar el seed desde el directorio del backend**

```powershell
cd apps/backend
npx medusa exec ./src/migration-scripts/initial-data-seed.ts
```

Esperado (en el log): ver estas líneas en orden:
```
[info] Seeding store data...
[info] Seeding region data...
[info] Finished seeding regions.
[info] Seeding tax regions...
[info] Finished seeding tax regions.
[info] Seeding stock location data...
[info] Seeding fulfillment data...
[info] Seeding product data...
[info] Finished seeding product data.
[info] Seeding inventory levels.
[info] Finished seeding inventory levels data.
```

- [ ] **Step 2: Verificar que los productos existen en la BD**

```powershell
docker-compose exec postgres psql -U medusa -d medusa_db -c "SELECT title, status FROM product;"
```

Esperado:
```
       title        |  status
--------------------+-----------
 Medusa T-Shirt     | published
 Medusa Sweatshirt  | published
 Medusa Sweatpants  | published
 Medusa Shorts      | published
(4 rows)
```

Si el seed falla con `duplicate key` o `already exists`, los datos ya existen — pasar a Tarea 3.

---

## Tarea 3 — Obtener la Publishable API Key

**Files:**
- No se crean archivos aún

El seed crea automáticamente una `publishable_api_key`. El storefront la necesita como cabecera en todos sus requests. MedusaJS sin esta key devuelve lista vacía en `/store/products`.

- [ ] **Step 1: Iniciar el backend**

En una terminal nueva (dejar corriendo):

```powershell
cd apps/backend
npm run dev
```

Esperar hasta ver en el log:
```
[info] Application is ready on port 9000
```

- [ ] **Step 2: Verificar que el backend responde**

```powershell
curl http://localhost:9000/health
```

Esperado: `{"status":"ok"}`

- [ ] **Step 3: Obtener la publishable API key desde el panel admin**

Abrir en el navegador: `http://localhost:9000/app`

Navegar a: **Settings → API Key Management → Publishable**

Copiar el valor de la key (formato: `pk_...`).

**Alternativa por BD** (si no se puede acceder al admin):

```powershell
docker-compose exec postgres psql -U medusa -d medusa_db -c "SELECT token FROM api_key WHERE type = 'publishable' LIMIT 1;"
```

Guardar este valor — se usa en la siguiente tarea.

---

## Tarea 4 — Configurar el storefront con la Publishable Key

**Files:**
- Crear: `apps/storefront/.env.local`
- Modificar: `.gitignore`

- [ ] **Step 1: Agregar `apps/storefront/.env.local` al .gitignore**

Abrir `.gitignore` y agregar al final:

```
# Storefront local env (publishable API key — local only)
apps/storefront/.env.local
```

- [ ] **Step 2: Crear `apps/storefront/.env.local`**

Crear el archivo `apps/storefront/.env.local` con el siguiente contenido, reemplazando `pk_XXXX` con el valor obtenido en la Tarea 3:

```env
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_XXXX
```

- [ ] **Step 3: Verificar que el archivo no está en git**

```powershell
git status
```

`apps/storefront/.env.local` no debe aparecer en la lista. Si aparece, revisar el paso anterior del .gitignore.

---

## Tarea 5 — Corregir el cliente Medusa para enviar la publishable key

**Files:**
- Modificar: `apps/storefront/src/lib/medusa.ts:130-145`

El cliente actual construye las cabeceras sin incluir `x-publishable-api-key`. MedusaJS v2 requiere esta cabecera para devolver productos del canal de ventas correcto.

- [ ] **Step 1: Modificar la función `medusaFetch` en `medusa.ts`**

Localizar el bloque en `apps/storefront/src/lib/medusa.ts` líneas ~130-145:

```typescript
// ANTES — código actual:
async function medusaFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const jwt = cookies.get("medusa_jwt")
    const headers = new Headers(options.headers)
    headers.set("Content-Type", "application/json")
    if (jwt) {
      headers.set("Authorization", `Bearer ${jwt}`)
    }
```

Reemplazarlo por:

```typescript
// DESPUÉS — agrega publishable key en rutas /store/*:
async function medusaFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const jwt = cookies.get("medusa_jwt")
    const headers = new Headers(options.headers)
    headers.set("Content-Type", "application/json")
    if (jwt) {
      headers.set("Authorization", `Bearer ${jwt}`)
    }
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    if (publishableKey && path.startsWith("/store/")) {
      headers.set("x-publishable-api-key", publishableKey)
    }
```

- [ ] **Step 2: Verificar que TypeScript no reporta errores**

```powershell
cd apps/storefront
npx tsc --noEmit
```

Esperado: sin errores.

---

## Tarea 6 — Verificar el storefront con productos reales

**Files:**
- No se modifican archivos

- [ ] **Step 1: Iniciar el storefront**

En otra terminal (con el backend ya corriendo):

```powershell
# Desde la raíz del monorepo
npm run dev
```

El storefront estará en `http://localhost:3000` (o el puerto configurado).

- [ ] **Step 2: Verificar que los productos aparecen**

Abrir `http://localhost:3000` en el navegador.

Esperado:
- La página de inicio o listado muestra al menos los 4 productos del seed (T-Shirt, Sweatshirt, Sweatpants, Shorts)
- Las imágenes cargan desde `medusa-public-images.s3.eu-west-1.amazonaws.com`
- Los precios muestran valores en CLP (ej. $9.990)

- [ ] **Step 3: Verificar la llamada a la API en DevTools**

Abrir DevTools → Network → filtrar por `/store/products`.

La request debe incluir la cabecera:
```
x-publishable-api-key: pk_...
```

Y la respuesta debe tener `count: 4` (o mayor).

- [ ] **Step 4: Commit del cambio en `medusa.ts` y el `.gitignore`**

```powershell
git add apps/storefront/src/lib/medusa.ts .gitignore
git commit -m "fix: send x-publishable-api-key header in store API requests"
```

---

## Consideraciones para Producción

### Lo que NUNCA se hace en producción

| Práctica local | Equivalente en producción |
|---|---|
| `npx medusa exec initial-data-seed.ts` | **No ejecutar**. El seed crea datos de ejemplo genéricos. En producción los datos los carga el equipo de contenido via Admin o migración controlada. |
| `JWT_SECRET=supersecret` | Usar secreto criptográficamente fuerte (mínimo 32 caracteres aleatorios) |
| `COOKIE_SECRET=supersecret` | Ídem |
| Puerto 5433 expuesto en Docker | En producción PostgreSQL no expone puerto al exterior |

### Variables de entorno que deben cambiar en producción

```env
# Nunca en producción con estos valores:
JWT_SECRET=supersecret-change-in-production       # ← cambiar
COOKIE_SECRET=supersecret-change-in-production    # ← cambiar

# CORS debe apuntar al dominio real, no localhost:
STORE_CORS=https://tu-tienda.cl
ADMIN_CORS=https://admin.tu-tienda.cl
AUTH_CORS=https://tu-tienda.cl,https://admin.tu-tienda.cl

# DATABASE_URL apuntará a Cloud SQL (Phase 3):
DATABASE_URL=postgres://user:pass@/medusa_db?host=/cloudsql/project:region:instance
```

### La Publishable API Key en producción

- En producción, la key se guarda como variable de entorno en Vercel: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- Se crea una key distinta por entorno (staging, producción) desde el Admin panel
- **Nunca hardcodear** la key en el código fuente

### El seed sí es útil en staging

En un entorno de staging/pre-producción, el seed puede ejecutarse una vez para tener datos de prueba. Pero debe ejecutarse manualmente, no de forma automática en el pipeline de CI/CD.

### Idempotencia del seed

El script actual **no es idempotente**: si se ejecuta dos veces, intentará crear los mismos recursos y fallará con errores de `duplicate key`. En producción, si se necesita un mecanismo de seed, debe verificar antes si los datos ya existen.
