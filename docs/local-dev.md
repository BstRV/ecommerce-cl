# Guía de desarrollo local

Este documento describe cómo levantar el entorno de desarrollo completo en tu máquina.
Hay dos secciones: una para desarrolladores humanos y otra para agentes de IA.

---

## Para desarrolladores

### Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20.x |
| npm | 11.x |
| Docker Desktop | 4.x |

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd Eccomers

# Instalar dependencias del monorepo (storefront + packages)
npm install

# Instalar dependencias del backend por separado
# (el backend está fuera de npm workspaces para evitar hoisting de MedusaJS)
# --legacy-peer-deps es necesario por un conflicto interno entre paquetes
# de MedusaJS 2.14.2 (icons pide React 19, draft-order pide React 18)
cd apps/backend
npm install --legacy-peer-deps
cd ../..
```

### 2. Levantar servicios de infraestructura

```bash
docker-compose up -d
```

Servicios disponibles:

| Servicio | URL local |
|---|---|
| PostgreSQL 15 | `localhost:5433` (user/pass: `medusa/medusa`, db: `medusa_db`) |
| Redis | `localhost:6380` |
| Meilisearch | `http://localhost:7700` |

### 3. Configurar variables de entorno

```bash
cp .env.example apps/backend/.env
```

Edita `apps/backend/.env` si necesitas sobreescribir algún valor.
Los valores del `.env.example` funcionan directamente con el `docker-compose.yml` incluido.

> Variables opcionales (dejar vacías si no se tienen credenciales aún):
> `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `SIMPLE_API_KEY`, `GCP_BUCKET_NAME`

### 4. Iniciar el backend

```bash
cd apps/backend
npm run dev
```

MedusaJS estará disponible en `http://localhost:9000`.
El panel de administración en `http://localhost:9000/app`.

Verificación rápida:
```bash
curl http://localhost:9000/health
# Respuesta esperada: {"status":"ok"}
```

### 5. Iniciar el storefront (opcional)

En otra terminal, desde la raíz del repo:

```bash
npm run dev
```

El storefront estará disponible en `http://localhost:3000`.

### 6. Ejecutar el seed de datos iniciales (primera vez)

El seed carga la tienda, región Chile, productos de ejemplo e inventario:

```bash
cd apps/backend
npx medusa exec ./src/migration-scripts/initial-data-seed.ts
```

### Comandos útiles

```bash
# Detener servicios Docker
docker-compose down

# Ver logs de todos los contenedores
docker-compose logs -f

# Reconstruir contenedores
docker-compose up -d --build

# Limpiar base de datos (destructivo)
docker-compose down -v
docker-compose up -d
```

---

## Para agentes de IA (runbook)

Esta sección es un runbook estructurado para agentes de IA que necesitan levantar o diagnosticar el entorno.

### Precondiciones

Antes de ejecutar cualquier comando, verificar:

1. **Docker está corriendo**: `docker info` debe devolver información del daemon.
2. **Puertos libres**: 5433, 6380, 7700 y 9000 no deben estar ocupados.
3. **Node.js ≥ 20**: `node --version` debe devolver `v20.x.x` o superior.

### Secuencia de arranque

Ejecutar estos pasos en orden. Cada paso tiene una verificación antes de continuar.

#### Paso 1: Infraestructura Docker

```bash
docker-compose up -d
```

**Verificación** (esperar hasta 30 segundos):
```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U medusa
# Esperado: "localhost:5432 - accepting connections"

# Redis
docker-compose exec redis redis-cli ping
# Esperado: "PONG"

# Meilisearch
curl -s http://localhost:7700/health | grep -q '"status":"available"'
# Esperado: sin error
```

#### Paso 2: Variables de entorno

```bash
# Solo si apps/backend/.env no existe
test -f apps/backend/.env || cp .env.example apps/backend/.env
```

#### Paso 3: Dependencias

```bash
# Monorepo (storefront + packages)
npm install

# Backend (aislado de workspaces)
# --legacy-peer-deps: conflicto interno MedusaJS 2.14.2 entre react@18/19
cd apps/backend && npm install --legacy-peer-deps && cd ../..
```

**Verificación**:
```bash
test -d apps/backend/node_modules/@medusajs/medusa && echo "OK" || echo "FALLO"
```

#### Paso 4: Backend

```bash
cd apps/backend && npm run dev
```

**Verificación** (en otra terminal, esperar hasta 60 segundos):
```bash
curl -s http://localhost:9000/health
# Esperado: {"status":"ok"}
```

Si el health check falla, revisar la sección de diagnóstico.

#### Paso 5: Seed (solo primera vez)

```bash
cd apps/backend
npx medusa exec ./src/migration-scripts/initial-data-seed.ts
```

**Verificación**:
```bash
curl -s http://localhost:9000/store/regions \
  -H "x-publishable-api-key: <publishable_key>" | grep -q '"name":"Chile"'
```

### Diagnóstico de errores comunes

#### `TypeError: path undefined` en tsconfig-paths

**Causa**: Las dependencias del backend se hoistaron al `node_modules/` raíz (problema de workspaces).
**Solución**:
```bash
# Verificar que el backend tenga sus propias dependencias locales
ls apps/backend/node_modules/tsconfig-paths
# Si no existe:
cd apps/backend && npm install
```

#### `Cannot find module 'ajv/dist/core'`

**Causa**: Versión de `ajv` incompatible hoisteada desde la raíz.
**Solución**: Igual que el anterior — instalar dependencias localmente en `apps/backend/`.

#### El backend arranca pero CORS falla

**Causa**: `STORE_CORS`, `ADMIN_CORS` o `AUTH_CORS` no están definidos en `.env`.
**Solución**: Verificar que `apps/backend/.env` contenga las tres variables con los orígenes correctos.

#### PostgreSQL no acepta conexiones

**Causa**: Docker no está corriendo o el contenedor falló.
**Solución**:
```bash
docker-compose ps           # Ver estado de los contenedores
docker-compose logs postgres # Ver logs del contenedor
docker-compose restart postgres
```

### Variables de entorno — referencia rápida

| Variable | Valor por defecto (dev) | Obligatoria |
|---|---|---|
| `DATABASE_URL` | `postgres://medusa:medusa@localhost:5433/medusa_db` | Sí |
| `REDIS_URL` | `redis://localhost:6380` | Sí |
| `STORE_CORS` | `http://localhost:3000` | Sí |
| `ADMIN_CORS` | `http://localhost:9000` | Sí |
| `AUTH_CORS` | `http://localhost:9000,http://localhost:3000` | Sí |
| `JWT_SECRET` | `supersecret-change-in-prod` | Sí |
| `COOKIE_SECRET` | `supersecret-change-in-prod` | Sí |
| `MEDUSA_ADMIN_TOKEN` | `supersecretadmin` | Sí |
| `NEXT_PUBLIC_MEDUSA_URL` | `http://localhost:9000` | Sí (storefront) |
| `MP_ACCESS_TOKEN` | vacío | No (Phase 2) |
| `MP_PUBLIC_KEY` | vacío | No (Phase 2) |
| `SIMPLE_API_KEY` | vacío | No (Phase 2) |
| `GCP_BUCKET_NAME` | vacío | No (Phase 2) |
| `MEILISEARCH_HOST` | `http://localhost:7700` | No (Phase 2) |
| `MEILISEARCH_API_KEY` | `masterKey123` | No (Phase 2) |

### Estructura de puertos

```
localhost:3000  →  Next.js storefront
localhost:5433  →  PostgreSQL 15 (docker-compose host port)
localhost:6380  →  Redis (docker-compose host port)
localhost:7700  →  Meilisearch
localhost:9000  →  MedusaJS backend + Admin panel (/app)
```
