# Setup de Infraestructura y Sistema de Temas

## Estado de Implementación

### Fase 1.1 — Workspace Monorepo ✓

| Elemento | Estado | Detalle |
|---|---|---|
| `package.json` raíz | ✓ | npm workspaces: `apps/*`, `packages/*` |
| `turbo.json` | ✓ | Pipelines: `dev`, `build`, `lint`, `typecheck` |
| `packages/types` | ✓ | Interfaces compartidas + `formatPrice` |
| `packages/assets` | ✓ | `brand.config.ts` tipado con `BrandConfig` |
| `packages/ui` | ✓ | Componentes React 19, sin dependencia de Tailwind |
| `apps/storefront` | ✓ | Next.js 16 + App Router + Tailwind v4 |
| Docker Compose | ✓ | PostgreSQL 15, Redis, Meilisearch |
| `apps/backend` | 🔜 | MedusaJS v2 — Fase 2 |

### Fase 1.2 — Sistema Visual Abstracto ✓

| Elemento | Estado | Detalle |
|---|---|---|
| `tokens.css` | ✓ | Fuente única de verdad — variables `--brand-*` |
| `globals.css` | ✓ | Conecta tokens → Tailwind v4 con `@theme inline` |
| `brand.config.ts` | ✓ | Tipado con `satisfies BrandConfig`, sin referencias rotas |
| UI Components | ✓ | Usan clases semánticas (`bg-primary`, `text-foreground`, etc.) |
| Fuente display | ✓ | DM Serif Display cargada vía `next/font/google` |
| Home page | ✓ | Hero, grid 4 col, banner editorial, CTA newsletter, footer |

---

## Stack Local

### Prerequisitos

- Node.js 20+, npm 10+
- Docker Desktop

### Arrancar el stack

```bash
# 1. Infraestructura (PostgreSQL, Redis, Meilisearch)
docker-compose up -d

# 2. Apps en desarrollo
npm run dev
```

**Puertos:**

| Servicio | Puerto |
|---|---|
| Storefront (Next.js) | 3000 |
| Admin Medusa | 7001 |
| Backend API | 9000 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Meilisearch | 7700 |

---

## Arquitectura del Sistema de Temas

El sistema sigue un flujo unidireccional de tres capas:

```
tokens.css          →  globals.css         →  Componentes
(--brand-* vars)       (@theme inline)        (clases Tailwind)
```

### Capa 1 — `apps/storefront/src/theme/tokens.css`

Define **todos** los valores visuales como custom properties CSS con prefijo `--brand-*`.
Los valores son tripletes RGB (`R G B`) para permitir composición con opacidad.

```css
:root {
  --brand-primary:    9   9  11;   /* cerca de negro */
  --brand-primary-fg: 250 250 250; /* blanco para contraste */
  --brand-radius:     0.375rem;
}
```

**Este es el único archivo que se modifica para cambiar el tema completo.**

### Capa 2 — `apps/storefront/src/app/globals.css`

Conecta los tokens de la Capa 1 con el sistema de colores semánticos de Tailwind v4
mediante la directiva `@theme inline`:

```css
@theme inline {
  --color-primary:            rgb(var(--brand-primary));
  --color-primary-foreground: rgb(var(--brand-primary-fg));
  /* … */
}
```

`inline` preserva las referencias a variables CSS (no resuelve en build time),
permitiendo que el cambio a `.dark` funcione en runtime.

### Capa 3 — Componentes

Usan exclusivamente clases semánticas de Tailwind. Nunca valores hardcodeados.

```tsx
// ✅ Correcto
<button className="bg-primary text-primary-foreground hover:bg-primary/90">

// ❌ Incorrecto
<button style={{ backgroundColor: "#000" }}>
<button className="bg-[rgb(9,9,11)]">
```

---

## Cómo Re-Tematizar

Para cambiar el tema a, por ejemplo, un azul marino y crema:

**Solo editar `apps/storefront/src/theme/tokens.css`:**

```css
:root {
  --brand-background:    252 249 242;  /* crema */
  --brand-foreground:     13  27  42;  /* azul marino oscuro */
  --brand-primary:        13  27  42;
  --brand-primary-fg:    252 249 242;
  --brand-secondary:     229 235 241;
  /* … resto de tokens … */
}
```

Y actualizar `packages/assets/brand.config.ts` con los mismos valores para mantener
el registro centralizado de la identidad de marca.

No se necesita modificar ningún componente.

---

## Packages

### `@ecommerce-preset/types`

Tipos e interfaces compartidos entre todas las apps y packages del monorepo.

```ts
import type { Product, Cart, BrandConfig } from "@ecommerce-preset/types"
import { formatPrice } from "@ecommerce-preset/types"

// Formatear precio en CLP
formatPrice(29990, "CLP") // → "$29.990"
```

### `@ecommerce-preset/ui`

Componentes React reutilizables. No compilan CSS — dependen del CSS del consumidor
(en este caso, el `globals.css` del storefront).

Agregar un nuevo componente:
1. Crear en `packages/ui/src/components/MiComponente.tsx`
2. Exportar desde `packages/ui/src/index.ts`
3. Usar solo clases semánticas (`bg-primary`, `text-muted-foreground`, etc.)

### `@ecommerce-preset/assets`

Configuración de marca. Importar solo donde se necesite el objeto de config (emails,
admin, generación de CSS variables dinámicas). El storefront consume los tokens
directamente vía CSS — no importa `brand.config.ts` en componentes.
