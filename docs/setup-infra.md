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

## Arquitectura del Sistema de Temas (Abstracción Visual en 3 Capas)

El sistema de temas y estilos de la web está completamente desacoplado y estructurado en tres archivos especializados dentro de `apps/storefront/src/theme/`, los cuales son importados en orden por `globals.css`:

```
              ┌──> tokens.css      (Colores, radios y dimensiones de layout)
globals.css ──┼──> typography.css  (Tamaños fluidos, tracking, animaciones y decoración de rejilla)
              └──> utilities.css   (Clases @utility de Tailwind v4: botones, inputs, etc.)
```

### 1. Capa de Tokens (`apps/storefront/src/theme/tokens.css`)
Define los valores de diseño básicos como propiedades personalizadas CSS (`--brand-*` y `--layout-*`).
* **Colores en formato RGB:** Los colores se guardan como tripletes RGB (`R G B` sin comas) para permitir la composición de opacidad en Tailwind (ej. `bg-primary/80`).
* **Variables de layout:** Centraliza dimensiones estructurales como `--layout-max-width`, `--layout-px`, paddings de secciones (`--section-py-*`) y la altura de navegación (`--navbar-height`).

```css
:root {
  --brand-primary: 9 9 11;       /* Cerca de negro */
  --brand-primary-fg: 250 250 250; /* Blanco */
  --layout-max-width: 80rem;     /* 1280px */
  --navbar-height: 4.5rem;       /* 72px */
}
```

### 2. Capa de Tipografía y Efectos (`apps/storefront/src/theme/typography.css`)
Controla la personalidad de los textos, comportamientos visuales dinámicos y detalles ornamentales:
* **Escala tipográfica fluida:** Variables como `--text-hero`, `--text-quote` y `--text-search`.
* **Animaciones y tiempos:** Controladores para duraciones y delays escalonados (`--duration-*`, `--stagger-*`).
* **Rejillas y guías decorativas:** Configuración para el tamaño de las celdas y opacidad de los fondos geométricos en cuadrícula (`--grid-size-*`, `--grid-opacity-*`).

### 3. Capa de Utilidades Visuales (`apps/storefront/src/theme/utilities.css`)
Implementa las directivas `@utility` personalizadas de Tailwind v4. Esto evita duplicar combinaciones complejas de clases en los componentes y mantiene los elementos UI perfectamente estandarizados:
* **Componentes de UI abstractos:** `btn-primary`, `btn-outline`, `btn-ghost`, `btn-primary-lg`.
* **Formularios estandarizados:** `form-input`, `form-input-error`, `form-label`.
* **Estilos y efectos de layout:** `bg-grid`, `bg-grid-border`, `surface-blur`, `chip`, `chip-active`.

---

## Cómo Re-Tematizar

Para cambiar la identidad visual de la tienda para un nuevo cliente, se sigue este flujo en orden secuencial sin modificar la lógica de negocio ni tocar componentes individuales:

1. **Colores base:** Modificar los colores en `apps/storefront/src/theme/tokens.css` (en `:root` para modo claro y `.dark` para modo oscuro). Los valores deben ser tripletes RGB.
2. **Registro de marca:** Reflejar los mismos colores y especificaciones en `packages/assets/brand.config.ts` para mantener la documentación y metadatos sincronizados.
3. **Fuentes tipográficas:**
   * Cambiar las importaciones de Google Fonts en `apps/storefront/src/app/layout.tsx`.
   * Asignar las variables tipográficas correspondientes en `tokens.css` (ej. `--font-family-display`, `--font-family-sans`).
4. **Radios y espaciados:** Ajustar `--brand-radius` y dimensiones de layout en `tokens.css`.
5. **Tipografías fluidas y tiempos:** Ajustar tamaños dinámicos en `typography.css` si el nuevo diseño lo requiere.
6. **Efectos de utilidades:** Modificar la forma, efectos de transición o estilos interactivos en `utilities.css`.

De esta forma, la tienda puede adoptar una imagen corporativa radicalmente diferente en minutos.

---

## Prevención de FOUC (Flash of Unstyled Content) y Persistencia de Tema

El modo claro/oscuro está estandarizado y es consistente en todo el sitio gracias a un flujo de persistencia en dos partes:

1. **Hydration-Safe Inline Script:** En `apps/storefront/src/app/layout.tsx`, un script síncrono e inmediato insertado dentro del `<head>` lee `localStorage.getItem('theme')` o consulta la preferencia del sistema (`prefers-color-scheme: dark`) para inyectar la clase `.dark` en el `document.documentElement` antes de que se dibuje cualquier elemento o se hidrate React. Esto elimina por completo el parpadeo blanco indeseado al cargar la página en modo oscuro.
2. **SSR-Safe ThemeToggle:** El componente `ThemeToggle` espera a que el frontend se monte (`useEffect`) antes de leer el estado del DOM y cambiar la clase, evitando inconsistencias entre el HTML generado por el servidor y el cliente.

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
