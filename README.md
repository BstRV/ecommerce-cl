# E-commerce Preset — Mercado Chileno

Monorepo de e-commerce white-label construido sobre **MedusaJS v2** y **Next.js 16**, orientado al mercado chileno. Diseñado como preset modular: una sola base de código que puede retemizarse visualmente por cliente sin tocar la lógica de negocio.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 |
| Backend | MedusaJS v2 (headless commerce) |
| Estilos | Tailwind CSS v4 + CSS Variables (sistema white-label) |
| Base de datos | PostgreSQL 15 |
| Caché / Colas | Redis + BullMQ |
| Búsqueda | Meilisearch (add-on premium) / MedusaJS nativo |
| Pagos | Mercado Pago (Checkout Transparente CLP) |
| Facturación | SimpleAPI — Boleta Electrónica SII Chile |
| Storage | Google Cloud Storage |
| Orquestación | Turborepo + npm workspaces |
| Infraestructura | Docker (local) · GCP Cloud Run + Cloud SQL (producción) |

## Estructura del repositorio

```
/
├── apps/
│   ├── storefront/        # Next.js App Router — tienda pública
│   │   └── src/
│   │       ├── theme/     # Sistema de CSS variables (Design System B&W)
│   │       └── components/
│   └── backend/           # MedusaJS v2 — API headless
│       └── src/
│           ├── api/       # Rutas custom (analytics, auth)
│           ├── modules/   # Módulo de analíticas interno
│           ├── workflows/ # Workflows custom (carrito + analíticas)
│           └── subscribers/ # Event handlers (facturación DTE, stock)
├── packages/
│   ├── ui/                # Componentes Shadcn/UI compartidos
│   ├── types/             # Interfaces TypeScript — fuente de verdad
│   ├── config/            # ESLint, Tailwind, TSConfig compartidos
│   └── assets/            # brand.config.ts — punto único de tematizado
├── docs/
│   ├── local-dev.md       # Guía de setup local
│   └── setup-infra.md     # Guía de despliegue en GCP + Vercel
├── docker-compose.yml     # PostgreSQL 15 · Redis · Meilisearch
└── .env.example           # Template de variables de entorno
```

## Arquitectura destacada

### Sistema white-label
Todos los valores visuales fluyen desde `packages/assets/brand.config.ts` hacia variables CSS de Tailwind. Para retemizar el proyecto completo basta con modificar ese único archivo — ningún componente tiene colores hardcodeados.

### Búsqueda dual
El storefront implementa una abstracción de proveedor de búsqueda controlada por la variable `NEXT_PUBLIC_SEARCH_PROVIDER`:
- `medusa` — consulta directa a la API de MedusaJS (incluido por defecto)
- `meilisearch` — búsqueda facetada con `instantsearch.js` (add-on premium)

### Facturación electrónica chilena
Al confirmarse un pago, el evento `order.placed` dispara un subscriber que emite una Boleta Electrónica vía SimpleAPI (SII). Los fallos se encolan en Redis con BullMQ para reintentos sin interrumpir la experiencia de compra.

## Requisitos previos

- Node.js 20+
- Docker Desktop
- Una cuenta en [Mercado Pago Developers](https://www.mercadopago.cl/developers) (para pagos)
- Una cuenta en [SimpleAPI](https://www.simpleapi.cl/) (para facturación electrónica)

## Setup local

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd ecommerce-preset
npm install
```

### 2. Variables de entorno

```bash
cp .env.example apps/backend/.env
```

Edita `apps/backend/.env` y completa los valores reales. Los campos obligatorios para levantar en local son `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` y `COOKIE_SECRET`.

### 3. Levantar infraestructura local

```bash
docker-compose up -d
```

Esto inicia:
- PostgreSQL 15 en `localhost:5433`
- Redis en `localhost:6380`
- Meilisearch en `localhost:7700`

### 4. Iniciar servidores de desarrollo

```bash
npm run dev
```

| Servicio | URL |
|---|---|
| Storefront (Next.js) | http://localhost:3000 |
| Backend API (MedusaJS) | http://localhost:9000 |
| Admin Panel (MedusaJS) | http://localhost:9000/app |

Consulta [docs/local-dev.md](docs/local-dev.md) para la guía completa incluyendo seed de datos.

## Scripts disponibles

```bash
npm run dev     # Inicia todos los servidores en modo desarrollo
npm run build   # Compila todos los packages y apps
npm run lint    # Ejecuta ESLint en todo el monorepo
```

## Variables de entorno

Ver [.env.example](.env.example) para la lista completa con descripción de cada variable.

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `REDIS_URL` | Conexión a Redis |
| `JWT_SECRET` / `COOKIE_SECRET` | Secretos de sesión (cambiar en producción) |
| `NEXT_PUBLIC_MEDUSA_URL` | URL del backend usada por Next.js |
| `MP_ACCESS_TOKEN` / `MP_PUBLIC_KEY` | Credenciales Mercado Pago |
| `SIMPLE_API_KEY` | Clave SimpleAPI para boletas electrónicas |
| `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY` | Conexión a Meilisearch |
| `GCP_BUCKET_NAME` | Bucket de Google Cloud Storage para imágenes |

## Estado del proyecto

### Fase 1 — Core e infraestructura (en curso)

| Tarea | Estado |
|---|---|
| Monorepo Turborepo + npm workspaces | Completado |
| Docker Compose (PostgreSQL, Redis, Meilisearch) | Completado |
| Sistema white-label con CSS Variables + `brand.config.ts` | Completado |
| Librería de componentes `packages/ui` (Shadcn/UI neutro) | Completado |
| MedusaJS v2 configurado con módulo de analíticas custom | Completado |
| Storefront Next.js con todas las páginas estáticas | Completado |
| Dark/light mode con persistencia en `localStorage` | Completado |
| Páginas de login, registro y cuenta de cliente | Completado |
| `ProductViewTracker` — tracking `view_item` y `add_to_cart` | Completado |
| Cliente Medusa (`lib/medusa.ts`) — conexión real al backend | Completado |
| Carrito persistente en cookies | Pendiente |
| Checkout con validación Zod (datos chilenos) | Pendiente |
| Seed de datos inicial (categorías, productos, variantes) | Pendiente |
| Autenticación Google OAuth | Pendiente |

### Fase 2 — Integraciones premium (planificada)

Mercado Pago (Checkout Transparente CLP), Boleta Electrónica SII via SimpleAPI, Meilisearch facetado con `instantsearch.js`, GCP Storage para imágenes, notificaciones vía Resend.

### Fase 3 — Producción (planificada)

Despliegue en GCP Cloud Run + Cloud SQL, frontend en Vercel, CDN con Cloudflare.

### Fase 4 — Monitoreo y documentación (planificada)

Dashboard de analíticas internas, GCP Logs, alertas ante errores de pasarelas de pago y facturación.

## Convenciones de código

- **TypeScript estricto** — `strict: true`, prohibido el uso de `any`
- **Sin colores hardcodeados** — solo clases Tailwind y variables CSS de `brand.config.ts`
- **Tipos compartidos** — todas las interfaces en `packages/types`, nunca duplicadas entre apps
- **Validación en fronteras** — Zod en inputs de usuario y respuestas de APIs externas

## Licencia

MIT
