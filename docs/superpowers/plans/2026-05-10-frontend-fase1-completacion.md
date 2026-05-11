# Frontend Fase 1 — Completación del Storefront Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar todas las piezas faltantes del frontend del storefront según la Fase 1 del MasterPlan.md, respetando el diseño B&W existente y las buenas prácticas de tematizado (CSS variables + brand.config.ts).

**Architecture:** El storefront usa Next.js 15 App Router con un sistema de CSS variables en `src/theme/tokens.css` y `brand.config.ts` en `packages/assets`. Todos los nuevos componentes deben usar clases Tailwind semánticas (`bg-primary`, `text-foreground`, etc.) y nunca estilos inline ni colores hardcodeados. Las animaciones existentes (`animate-fade-up`, `animate-fade-in`) deben reutilizarse.

**Tech Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS v4 · CSS Variables (--brand-*) · React Context (cart) · Mock data (src/lib/mock-data.ts)

---

## Resumen de Gaps Detectados

| Área | Estado | Prioridad |
|------|--------|-----------|
| **1.2** — packages/ui integrado en storefront | ⚠️ Existe pero NO se usa | Alta |
| **1.2** — Dark mode toggle en UI | ❌ Falta componente | Media |
| **1.4** — Mobile hamburger menu | ❌ Sin implementar | Alta |
| **1.4** — Página `/novedades` dedicada | ❌ Solo redirige | Alta |
| **1.4** — Página `/ofertas` dedicada | ❌ Solo redirige | Alta |
| **1.4** — Skeleton Loading + `loading.tsx` por ruta | ❌ Sin implementar | Alta |
| **1.4** — Error boundary global (`error.tsx`) | ❌ Sin implementar | Media |
| **1.4** — Página 404 (`not-found.tsx`) | ❌ Usa default Next.js | Media |
| **1.4** — Páginas de Ayuda (`/ayuda/[slug]`) | ❌ Sin implementar | Media |
| **1.4** — Página `/contacto` | ❌ Sin implementar | Media |
| **1.4** — Flujo de Checkout (`/checkout`) | ❌ Botón sin destino | Media |

---

## Mapa de Archivos

### Archivos a Crear
```
apps/storefront/src/
├── app/
│   ├── error.tsx                          # Error boundary global
│   ├── not-found.tsx                      # Página 404
│   ├── loading.tsx                        # Skeleton global (raíz)
│   ├── novedades/
│   │   ├── page.tsx                       # Página /novedades
│   │   └── loading.tsx                    # Skeleton de novedades
│   ├── ofertas/
│   │   ├── page.tsx                       # Página /ofertas
│   │   └── loading.tsx                    # Skeleton de ofertas
│   ├── contacto/
│   │   └── page.tsx                       # Página /contacto
│   ├── ayuda/
│   │   └── [slug]/
│   │       └── page.tsx                   # Páginas /ayuda/envios, /ayuda/devoluciones, /ayuda/tallas
│   └── checkout/
│       ├── page.tsx                       # Checkout step 1: datos de envío
│       └── loading.tsx                    # Skeleton checkout
├── components/
│   ├── MobileMenu.tsx                     # Menú hamburguesa para móvil
│   ├── ThemeToggle.tsx                    # Toggle dark/light mode
│   ├── SkeletonCard.tsx                   # Skeleton de ProductCard
│   └── SkeletonGrid.tsx                   # Grid de skeletons
```

### Archivos a Modificar
```
apps/storefront/src/
├── components/
│   └── Navbar.tsx                         # Agregar MobileMenu + ThemeToggle
├── app/
│   └── carrito/
│       └── page.tsx                       # Botón "Finalizar Compra" → /checkout
```

---

## Task 1: Integración de packages/ui en el storefront

**Contexto:** El paquete `packages/ui` existe con Button, Input, y Card pero no está siendo importado en el storefront. Verificar que la dependencia esté declarada en el package.json del storefront.

**Files:**
- Read: `apps/storefront/package.json`
- Modify (si falta): `apps/storefront/package.json`

- [ ] **Step 1: Verificar dependencia en package.json del storefront**

```bash
cat apps/storefront/package.json | grep -E "ui|ecommerce"
```

Esperado: ver `"@ecommerce-preset/ui": "*"` o similar. Si no está, agregarlo.

- [ ] **Step 2: Si la dependencia no está declarada, agregarla**

En `apps/storefront/package.json`, dentro de `"dependencies"`:
```json
"@ecommerce-preset/ui": "*"
```

Luego ejecutar desde la raíz:
```bash
npm install
```

- [ ] **Step 3: Verificar que los componentes del paquete se pueden importar**

Crear un test de importación rápido (no un archivo nuevo — solo verificar en consola):
```bash
cd apps/storefront && npx tsc --noEmit 2>&1 | head -20
```

Esperado: 0 errores de tipo relacionados con `@ecommerce-preset/ui`.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/package.json package-lock.json
git commit -m "feat: register @ecommerce-preset/ui as storefront dependency"
```

---

## Task 2: Componente MobileMenu (Menú Hamburguesa)

**Contexto:** El Navbar actual muestra links de navegación solo en desktop (`hidden md:flex`). En móvil no hay forma de navegar. Este task crea el componente hamburguesa y lo integra en el Navbar.

**Files:**
- Create: `apps/storefront/src/components/MobileMenu.tsx`
- Modify: `apps/storefront/src/components/Navbar.tsx`

- [ ] **Step 1: Crear el componente MobileMenu**

Crear `apps/storefront/src/components/MobileMenu.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/novedades',   label: 'Novedades'   },
  { href: '/ofertas',     label: 'Ofertas'     },
  { href: '/nosotros',    label: 'Nosotros'    },
  { href: '/contacto',    label: 'Contacto'    },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        <span
          className={`block h-px w-6 bg-foreground transition-transform duration-300 origin-center ${
            open ? 'translate-y-[4px] rotate-45' : ''
          }`}
        />
        <span
          className={`block h-px w-6 bg-foreground transition-opacity duration-300 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-px w-6 bg-foreground transition-transform duration-300 origin-center ${
            open ? '-translate-y-[10px] -rotate-45' : ''
          }`}
        />
      </button>

      {/* Panel deslizante */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-background border-l border-border flex flex-col pt-20 px-8 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-5 right-6 text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
            >
              ×
            </button>

            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-lg font-light tracking-wide border-b border-border transition-colors hover:text-foreground ${
                      pathname === href
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Links de ayuda al pie */}
            <div className="mt-auto pb-8 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/ayuda/envios" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Envíos</Link>
              <Link href="/ayuda/devoluciones" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Devoluciones</Link>
              <Link href="/carrito" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Ver carrito</Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Integrar MobileMenu en el Navbar**

Leer `apps/storefront/src/components/Navbar.tsx` para encontrar el área donde están los links de desktop (buscar el `<nav>` con `hidden md:flex`).

En el JSX del Navbar, justo antes del cierre del contenedor principal (junto a los iconos de search y carrito), agregar:

```tsx
import MobileMenu from './MobileMenu'

// Dentro del JSX, al final del header container, después del ícono de carrito:
<MobileMenu />
```

- [ ] **Step 3: Verificar que no hay errores de TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

Esperado: 0 errores.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/MobileMenu.tsx apps/storefront/src/components/Navbar.tsx
git commit -m "feat: add responsive mobile hamburger menu to navbar"
```

---

## Task 3: Componente ThemeToggle (Dark / Light Mode)

**Contexto:** El sistema de tokens.css ya define los valores para `.dark`. Solo falta un botón que agregue/remueva la clase `dark` del elemento `<html>` y persista la preferencia en `localStorage`.

**Files:**
- Create: `apps/storefront/src/components/ThemeToggle.tsx`
- Modify: `apps/storefront/src/components/Navbar.tsx`

- [ ] **Step 1: Crear ThemeToggle**

Crear `apps/storefront/src/components/ThemeToggle.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  // Inicializar desde localStorage o preferencia del sistema
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="w-8 h-8 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
    >
      {/* Sol / Luna — solo SVG, sin dependencias */}
      {dark ? (
        /* Sol */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        /* Luna */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}
```

- [ ] **Step 2: Agregar ThemeToggle al Navbar**

En `apps/storefront/src/components/Navbar.tsx`, importar y agregar `<ThemeToggle />` junto a los iconos de búsqueda y carrito en la sección de iconos.

```tsx
import ThemeToggle from './ThemeToggle'

// Dentro del grupo de iconos (search, cart):
<ThemeToggle />
```

- [ ] **Step 3: Verificar TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/ThemeToggle.tsx apps/storefront/src/components/Navbar.tsx
git commit -m "feat: add dark/light mode toggle with localStorage persistence"
```

---

## Task 4: Componentes Skeleton + loading.tsx global

**Contexto:** MasterPlan 1.4 requiere "Skeleton Loading para mitigar percepción de latencia". Actualmente no existe ningún estado de carga. Crearemos un `SkeletonCard`, `SkeletonGrid`, y `loading.tsx` por cada ruta principal.

**Files:**
- Create: `apps/storefront/src/components/SkeletonCard.tsx`
- Create: `apps/storefront/src/components/SkeletonGrid.tsx`
- Create: `apps/storefront/src/app/loading.tsx`
- Create: `apps/storefront/src/app/colecciones/loading.tsx`
- Create: `apps/storefront/src/app/buscar/loading.tsx`
- Create: `apps/storefront/src/app/productos/[handle]/loading.tsx`
- Create: `apps/storefront/src/app/carrito/loading.tsx`

- [ ] **Step 1: Crear SkeletonCard**

Crear `apps/storefront/src/components/SkeletonCard.tsx`:

```tsx
export default function SkeletonCard() {
  return (
    <div className="group animate-pulse">
      {/* Imagen placeholder */}
      <div className="aspect-[3/4] w-full bg-muted rounded-[var(--brand-radius)] mb-4" />
      {/* Título */}
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      {/* Subtítulo */}
      <div className="h-3 bg-muted rounded w-1/2 mb-3" />
      {/* Precio */}
      <div className="h-4 bg-muted rounded w-1/3" />
    </div>
  )
}
```

- [ ] **Step 2: Crear SkeletonGrid**

Crear `apps/storefront/src/components/SkeletonGrid.tsx`:

```tsx
import SkeletonCard from './SkeletonCard'

interface SkeletonGridProps {
  count?: number
}

export default function SkeletonGrid({ count = 8 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Crear loading.tsx global**

Crear `apps/storefront/src/app/loading.tsx`:

```tsx
import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header skeleton */}
      <div className="mb-10 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-3" />
        <div className="h-4 bg-muted rounded w-64" />
      </div>
      <SkeletonGrid count={8} />
    </main>
  )
}
```

- [ ] **Step 4: Crear loading.tsx para /colecciones**

Crear `apps/storefront/src/app/colecciones/loading.tsx`:

```tsx
import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* PageHeader skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-muted rounded w-64 mb-3" />
        <div className="h-4 bg-muted rounded w-48" />
      </div>
      {/* FilterBar skeleton */}
      <div className="flex gap-3 mb-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-muted rounded-full w-24" />
        ))}
      </div>
      <SkeletonGrid count={12} />
    </main>
  )
}
```

- [ ] **Step 5: Crear loading.tsx para /buscar**

Crear `apps/storefront/src/app/buscar/loading.tsx`:

```tsx
import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12 animate-pulse">
        <div className="h-12 bg-muted rounded w-3/4 mb-4" />
        <div className="h-px bg-border w-full" />
      </div>
      <SkeletonGrid count={8} />
    </main>
  )
}
```

- [ ] **Step 6: Crear loading.tsx para /productos/[handle]**

Crear `apps/storefront/src/app/productos/[handle]/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="aspect-square bg-muted rounded-[var(--brand-radius)]" />
        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-6 bg-muted rounded w-1/4 mt-2" />
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-10 bg-muted rounded" />
            ))}
          </div>
          <div className="h-12 bg-muted rounded mt-4" />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 7: Crear loading.tsx para /carrito**

Crear `apps/storefront/src/app/carrito/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 bg-muted rounded w-32 mb-8" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 py-6 border-b border-border">
            <div className="w-24 h-32 bg-muted rounded-[var(--brand-radius)] flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/4 mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add apps/storefront/src/components/SkeletonCard.tsx \
        apps/storefront/src/components/SkeletonGrid.tsx \
        apps/storefront/src/app/loading.tsx \
        apps/storefront/src/app/colecciones/loading.tsx \
        apps/storefront/src/app/buscar/loading.tsx \
        apps/storefront/src/app/productos/loading.tsx \
        apps/storefront/src/app/carrito/loading.tsx
git commit -m "feat: add skeleton loading states for all main routes (Phase 1.4)"
```

---

## Task 5: Error Boundary Global y Página 404

**Contexto:** Next.js App Router requiere `error.tsx` como Client Component con `'use client'`. El `not-found.tsx` puede ser Server Component. Ambos deben respetar el diseño B&W existente.

**Files:**
- Create: `apps/storefront/src/app/error.tsx`
- Create: `apps/storefront/src/app/not-found.tsx`

- [ ] **Step 1: Crear error.tsx global**

Crear `apps/storefront/src/app/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en consola (reemplazar con logging real en producción)
    console.error(error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Motivo geométrico — consistente con EmptyState */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 border border-border rotate-45" />
        <div className="absolute inset-2 border border-border rotate-12" />
        <div className="absolute inset-4 border border-border" />
      </div>

      <h1 className="font-display text-4xl mb-3 tracking-tight">
        Algo salió mal
      </h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-md">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 text-sm font-medium border border-border hover:bg-muted transition-colors rounded-[var(--brand-radius)]"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Crear not-found.tsx**

Crear `apps/storefront/src/app/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Número 404 estilizado */}
      <p className="font-display text-[8rem] leading-none text-muted mb-2 select-none">
        404
      </p>
      <div className="h-px w-16 bg-border mx-auto mb-6" />

      <h1 className="font-display text-2xl mb-3 tracking-tight">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        La página que buscas no existe o fue movida a otra dirección.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
        >
          Ir al inicio
        </Link>
        <Link
          href="/colecciones"
          className="px-6 py-2.5 text-sm font-medium border border-border hover:bg-muted transition-colors rounded-[var(--brand-radius)]"
        >
          Ver colecciones
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Verificar TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/app/error.tsx apps/storefront/src/app/not-found.tsx
git commit -m "feat: add global error boundary and 404 page"
```

---

## Task 6: Página /novedades

**Contexto:** El Navbar actual tiene el link `/novedades` que en la implementación actual redirige a `/colecciones?sort=new`. El MasterPlan requiere una página dedicada para "Novedades". La página debe filtrar productos nuevos (usando mock-data) y respetar el diseño de Colecciones.

**Files:**
- Create: `apps/storefront/src/app/novedades/page.tsx`
- Create: `apps/storefront/src/app/novedades/loading.tsx`
- Modify: `apps/storefront/src/components/Navbar.tsx` (actualizar el href si usa redirect)

- [ ] **Step 1: Verificar cómo el Navbar linkea a /novedades**

Leer `apps/storefront/src/components/Navbar.tsx` y confirmar el href del link "Novedades". Si apunta a `/colecciones?sort=new`, actualizar a `/novedades`.

- [ ] **Step 2: Crear la página /novedades**

Crear `apps/storefront/src/app/novedades/page.tsx`:

```tsx
import { getProducts, getCategories } from '@/lib/mock-data'
import PageHeader from '@/components/PageHeader'
import FilterBar from '@/components/FilterBar'
import ProductGrid from '@/components/ProductGrid'
import EmptyState from '@/components/EmptyState'

interface SearchParams {
  categoria?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export const metadata = {
  title: 'Novedades | Preset',
  description: 'Las últimas incorporaciones a nuestra colección.',
}

export default async function NovedadesPage({ searchParams }: Props) {
  const params = await searchParams
  const categories = getCategories()

  // En producción: filtrar por fecha de creación DESC desde la API.
  // Con mock-data: usar los últimos 8 productos del catálogo.
  const allProducts = getProducts({
    category: params.categoria,
    sort: 'new',
  })

  // Simular "novedades" = primeros 8 productos con sort=new
  const products = allProducts.slice(0, 8)

  return (
    <>
      <PageHeader
        title="Novedades"
        subtitle={`${products.length} productos`}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Novedades' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FilterBar categories={categories} />

        {products.length === 0 ? (
          <EmptyState
            title="Sin novedades por ahora"
            description="Vuelve pronto, estamos actualizando el catálogo."
            action={{ label: 'Ver todas las colecciones', href: '/colecciones' }}
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Crear loading.tsx para /novedades**

Crear `apps/storefront/src/app/novedades/loading.tsx`:

```tsx
import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-muted rounded w-48 mb-3" />
        <div className="h-4 bg-muted rounded w-32" />
      </div>
      <div className="flex gap-3 mb-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-muted rounded-full w-24" />
        ))}
      </div>
      <SkeletonGrid count={8} />
    </main>
  )
}
```

- [ ] **Step 4: Actualizar el link en el Navbar**

En `apps/storefront/src/components/Navbar.tsx`, asegurarse de que el link "Novedades" apunte a `/novedades` (sin parámetros de query).

- [ ] **Step 5: Verificar TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

- [ ] **Step 6: Commit**

```bash
git add apps/storefront/src/app/novedades/ apps/storefront/src/components/Navbar.tsx
git commit -m "feat: add dedicated /novedades page with filtering and skeleton"
```

---

## Task 7: Página /ofertas

**Contexto:** Similar a Novedades. El link `/ofertas` en el Navbar apunta a `/colecciones?sort=price-asc`. Requiere una página dedicada que presente productos con descuento (o el precio más bajo), con un diseño visualmente diferenciado para comunicar "oferta".

**Files:**
- Create: `apps/storefront/src/app/ofertas/page.tsx`
- Create: `apps/storefront/src/app/ofertas/loading.tsx`
- Modify: `apps/storefront/src/components/Navbar.tsx` (actualizar href si usa redirect)

- [ ] **Step 1: Crear la página /ofertas**

Crear `apps/storefront/src/app/ofertas/page.tsx`:

```tsx
import { getProducts, getCategories } from '@/lib/mock-data'
import PageHeader from '@/components/PageHeader'
import FilterBar from '@/components/FilterBar'
import ProductGrid from '@/components/ProductGrid'
import EmptyState from '@/components/EmptyState'

interface SearchParams {
  categoria?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export const metadata = {
  title: 'Ofertas | Preset',
  description: 'Los mejores precios de nuestra tienda.',
}

export default async function OfertasPage({ searchParams }: Props) {
  const params = await searchParams
  const categories = getCategories()

  // En producción: filtrar por campo `on_sale: true` o `compare_at_price > price`.
  // Con mock-data: usar sort por precio ascendente, primeros 8 productos.
  const products = getProducts({
    category: params.categoria,
    sort: 'price-asc',
  }).slice(0, 8)

  return (
    <>
      <PageHeader
        title="Ofertas"
        subtitle={`${products.length} productos en oferta`}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Ofertas' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Banner informativo de ofertas */}
        <div className="mb-8 p-4 border border-border bg-secondary rounded-[var(--brand-radius)] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-foreground flex-shrink-0" />
          <p className="text-sm text-foreground">
            Precios especiales por tiempo limitado. No se requieren códigos de descuento.
          </p>
        </div>

        <FilterBar categories={categories} />

        {products.length === 0 ? (
          <EmptyState
            title="Sin ofertas disponibles"
            description="Vuelve pronto, agregamos nuevas ofertas regularmente."
            action={{ label: 'Ver todas las colecciones', href: '/colecciones' }}
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Crear loading.tsx para /ofertas**

Crear `apps/storefront/src/app/ofertas/loading.tsx`:

```tsx
import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-muted rounded w-32 mb-3" />
        <div className="h-4 bg-muted rounded w-48" />
      </div>
      {/* Banner skeleton */}
      <div className="h-12 bg-muted rounded mb-8 animate-pulse" />
      <div className="flex gap-3 mb-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-muted rounded-full w-24" />
        ))}
      </div>
      <SkeletonGrid count={8} />
    </main>
  )
}
```

- [ ] **Step 3: Actualizar el link en el Navbar**

En `apps/storefront/src/components/Navbar.tsx`, asegurarse de que el link "Ofertas" apunte a `/ofertas`.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/app/ofertas/ apps/storefront/src/components/Navbar.tsx
git commit -m "feat: add dedicated /ofertas page with informational banner and skeleton"
```

---

## Task 8: Páginas de Ayuda (/ayuda/[slug])

**Contexto:** El footer tiene 4 links de ayuda (`/ayuda/envios`, `/ayuda/devoluciones`, `/ayuda/tallas`, `/contacto`) sin páginas destino. Crear una ruta dinámica `/ayuda/[slug]` con contenido estático por slug.

**Files:**
- Create: `apps/storefront/src/app/ayuda/[slug]/page.tsx`
- Create: `apps/storefront/src/app/contacto/page.tsx`

- [ ] **Step 1: Definir el contenido por slug**

Crear `apps/storefront/src/app/ayuda/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

const HELP_CONTENT: Record<string, { title: string; subtitle: string; sections: { heading: string; body: string }[] }> = {
  envios: {
    title: 'Envíos',
    subtitle: 'Todo lo que necesitas saber sobre cómo recibir tu pedido.',
    sections: [
      {
        heading: 'Tiempo de despacho',
        body: 'Los pedidos se despachan en un plazo de 1 a 2 días hábiles desde la confirmación del pago. Recibirás un correo con el número de seguimiento una vez que tu paquete esté en camino.',
      },
      {
        heading: 'Cobertura',
        body: 'Realizamos envíos a todo Chile continental a través de nuestros servicios de courier. Para pedidos a regiones extremas (Aysén, Magallanes, Arica), el plazo puede extenderse hasta 5 días hábiles.',
      },
      {
        heading: 'Costo de envío',
        body: 'El costo de envío se calcula según tu dirección y el peso del pedido. Los envíos son gratuitos para compras sobre $49.990 CLP.',
      },
      {
        heading: '¿Puedo retirar en tienda?',
        body: 'Por el momento solo realizamos envíos a domicilio. Próximamente habilitaremos retiro en tienda en Santiago.',
      },
    ],
  },
  devoluciones: {
    title: 'Devoluciones',
    subtitle: 'Tu satisfacción es nuestra prioridad.',
    sections: [
      {
        heading: 'Política de cambios',
        body: 'Aceptamos cambios dentro de los 30 días corridos desde la recepción del producto, siempre que este se encuentre en su estado original: sin usar, con etiquetas y en su embalaje original.',
      },
      {
        heading: 'Productos no intercambiables',
        body: 'Por higiene, no aceptamos devoluciones de ropa interior, trajes de baño ni accesorios de cabello.',
      },
      {
        heading: 'Proceso de devolución',
        body: 'Para iniciar una devolución, escríbenos a hola@preset.cl con tu número de pedido y el motivo. Te enviaremos las instrucciones en un plazo de 24 horas hábiles.',
      },
      {
        heading: 'Reembolso',
        body: 'Una vez recibido y revisado el producto, el reembolso se procesa en 3 a 5 días hábiles a la misma forma de pago original.',
      },
    ],
  },
  tallas: {
    title: 'Guía de Tallas',
    subtitle: 'Encuentra tu talla perfecta.',
    sections: [
      {
        heading: 'Cómo medir',
        body: 'Para obtener medidas precisas, usa una cinta métrica flexible. Mide el contorno de tu pecho, cintura y cadera en centímetros.',
      },
      {
        heading: 'Tabla de equivalencias',
        body: 'XS: Pecho 80–84 cm / Cintura 60–64 cm\nS: Pecho 84–88 cm / Cintura 64–68 cm\nM: Pecho 88–92 cm / Cintura 68–72 cm\nL: Pecho 92–96 cm / Cintura 72–76 cm\nXL: Pecho 96–100 cm / Cintura 76–80 cm',
      },
      {
        heading: 'Consejos',
        body: 'Si estás entre dos tallas, te recomendamos elegir la talla más grande para mayor comodidad. Todos nuestros productos incluyen la composición del tejido y recomendaciones de cuidado en la etiqueta.',
      },
    ],
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(HELP_CONTENT).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const content = HELP_CONTENT[slug]
  if (!content) return {}
  return {
    title: `${content.title} | Preset`,
    description: content.subtitle,
  }
}

export default async function HelpPage({ params }: Props) {
  const { slug } = await params
  const content = HELP_CONTENT[slug]

  if (!content) notFound()

  return (
    <>
      <PageHeader
        title={content.title}
        subtitle={content.subtitle}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Ayuda', href: '#' },
          { label: content.title },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col gap-10">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-medium mb-3 tracking-tight">
                {section.heading}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* CTA de contacto al pie */}
        <div className="mt-14 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            ¿No encontraste lo que buscabas?
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/app/ayuda/
git commit -m "feat: add static help pages for envios, devoluciones, and tallas"
```

---

## Task 9: Página /contacto

**Files:**
- Create: `apps/storefront/src/app/contacto/page.tsx`

- [ ] **Step 1: Crear la página de contacto**

Crear `apps/storefront/src/app/contacto/page.tsx`:

```tsx
import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'Contacto | Preset',
  description: 'Ponte en contacto con nosotros.',
}

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        title="Contacto"
        subtitle="Estamos aquí para ayudarte."
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Contacto' }]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          {/* Info de contacto */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-medium mb-1 tracking-tight uppercase text-muted-foreground">
                Correo
              </h2>
              <a
                href="mailto:hola@preset.cl"
                className="text-base underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                hola@preset.cl
              </a>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-1 tracking-tight uppercase text-muted-foreground">
                Horario de atención
              </h2>
              <p className="text-base text-foreground">
                Lunes a Viernes, 9:00 – 18:00
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-1 tracking-tight uppercase text-muted-foreground">
                Ubicación
              </h2>
              <p className="text-base text-foreground">
                Santiago, Chile
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            className="flex flex-col gap-4"
            /* En producción: action="/api/contact" method="POST" */
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-sm font-medium">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@correo.cl"
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="mensaje" className="text-sm font-medium">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="¿En qué podemos ayudarte?"
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
            >
              Enviar mensaje
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Respondemos en un plazo de 24 horas hábiles.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/app/contacto/
git commit -m "feat: add /contacto page with info and contact form UI"
```

---

## Task 10: Estructura del Checkout (/checkout)

**Contexto:** MasterPlan 1.4 requiere "Checkout Flow paso a paso". La integración de pago (Mercado Pago) es Fase 2. Este task crea la estructura visual del checkout: formulario de dirección de envío → resumen del pedido → botón de pago (que en esta fase es un placeholder). El botón "Finalizar compra" del carrito debe apuntar a `/checkout`.

**Files:**
- Create: `apps/storefront/src/app/checkout/page.tsx`
- Create: `apps/storefront/src/app/checkout/loading.tsx`
- Modify: `apps/storefront/src/app/carrito/page.tsx` (actualizar href del botón)

- [ ] **Step 1: Actualizar el botón de checkout en /carrito**

Leer `apps/storefront/src/app/carrito/page.tsx` y encontrar el botón/enlace "Finalizar compra" o similar. Actualizarlo para que navegue a `/checkout`:

```tsx
import Link from 'next/link'

// Reemplazar el botón con:
<Link
  href="/checkout"
  className="block w-full py-3 text-center text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
>
  Finalizar compra
</Link>
```

- [ ] **Step 2: Crear la página de checkout**

Crear `apps/storefront/src/app/checkout/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

type Step = 'envio' | 'resumen'

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('envio')
  const { items, subtotal } = useCart()

  const shippingCost = subtotal >= 49990 ? 0 : 3990
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl mb-4">Tu carrito está vacío</p>
        <Link
          href="/colecciones"
          className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-[var(--brand-radius)] hover:opacity-90 transition-opacity"
        >
          Ver colecciones
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-3 mb-10">
        <Link href="/carrito" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Carrito
        </Link>
        <span className="text-border text-xs">›</span>
        <span className={`text-sm font-medium ${step === 'envio' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Envío
        </span>
        <span className="text-border text-xs">›</span>
        <span className={`text-sm font-medium ${step === 'resumen' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Resumen y pago
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        {/* Panel izquierdo */}
        <div>
          {step === 'envio' && (
            <section>
              <h1 className="font-display text-2xl mb-6 tracking-tight">Dirección de envío</h1>

              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => { e.preventDefault(); setStep('resumen') }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                    <input id="nombre" name="nombre" type="text" required placeholder="María"
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apellido" className="text-sm font-medium">Apellido</label>
                    <input id="apellido" name="apellido" type="text" required placeholder="González"
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
                  <input id="email" name="email" type="email" required placeholder="maria@correo.cl"
                    className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
                  <input id="telefono" name="telefono" type="tel" placeholder="+56 9 1234 5678"
                    className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="direccion" className="text-sm font-medium">Dirección</label>
                  <input id="direccion" name="direccion" type="text" required placeholder="Av. Providencia 1234, Depto 5"
                    className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ciudad" className="text-sm font-medium">Ciudad</label>
                    <input id="ciudad" name="ciudad" type="text" required placeholder="Santiago"
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="region" className="text-sm font-medium">Región</label>
                    <select id="region" name="region" required
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground">
                      <option value="">Seleccionar</option>
                      <option>Región Metropolitana</option>
                      <option>Valparaíso</option>
                      <option>Biobío</option>
                      <option>La Araucanía</option>
                      <option>Los Lagos</option>
                      <option>O&apos;Higgins</option>
                      <option>Maule</option>
                      <option>Antofagasta</option>
                      <option>Tarapacá</option>
                      <option>Atacama</option>
                      <option>Coquimbo</option>
                      <option>Los Ríos</option>
                      <option>Arica y Parinacota</option>
                      <option>Aysén</option>
                      <option>Magallanes</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
                >
                  Continuar al resumen
                </button>
              </form>
            </section>
          )}

          {step === 'resumen' && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setStep('envio')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  ← Editar envío
                </button>
                <h1 className="font-display text-2xl tracking-tight">Resumen del pedido</h1>
              </div>

              {/* Lista de items */}
              <div className="flex flex-col gap-4 mb-8">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 py-4 border-b border-border">
                    <div className="w-16 h-20 bg-muted rounded-[var(--brand-radius)] flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-muted-foreground mt-0.5">{item.variantTitle}</p>
                      )}
                      <p className="text-muted-foreground mt-0.5">Cant. {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      ${(item.price * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Placeholder de pago — Fase 2 (Mercado Pago) */}
              <div className="p-4 border border-dashed border-border rounded-[var(--brand-radius)] text-center text-sm text-muted-foreground">
                El módulo de pago (Mercado Pago) se integrará en la Fase 2.
              </div>
            </section>
          )}
        </div>

        {/* Panel derecho — resumen de costos */}
        <aside className="bg-secondary rounded-[var(--brand-radius)] p-6 h-fit">
          <h2 className="font-medium text-sm mb-4 tracking-tight">Resumen</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between font-medium text-base">
              <span>Total</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {subtotal < 49990 && (
            <p className="text-xs text-muted-foreground mt-4">
              Agrega ${(49990 - subtotal).toLocaleString('es-CL')} más para envío gratis.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Crear loading.tsx para /checkout**

Crear `apps/storefront/src/app/checkout/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="flex gap-3 mb-10">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-4" />
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-4" />
        <div className="h-4 bg-muted rounded w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-muted rounded w-48 mb-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-11 bg-muted rounded" />
          ))}
          <div className="h-12 bg-muted rounded mt-2" />
        </div>
        <div className="h-48 bg-muted rounded" />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verificar TypeScript**

```bash
cd apps/storefront && npx tsc --noEmit 2>&1
```

- [ ] **Step 5: Commit**

```bash
git add apps/storefront/src/app/checkout/ apps/storefront/src/app/carrito/page.tsx
git commit -m "feat: add multi-step checkout page structure with shipping form and order summary"
```

---

## Self-Review — Cobertura del MasterPlan Fase 1

| Requerimiento MasterPlan | Cubierto en | Estado |
|--------------------------|-------------|--------|
| **1.1** Monorepo / Docker / TypeScript strict / ESLint | Preexistente | ✅ |
| **1.2** Sistema CSS Variables (--brand-*) | Preexistente (tokens.css) | ✅ |
| **1.2** brand.config.ts centralizado | Preexistente | ✅ |
| **1.2** packages/ui conectado al storefront | Task 1 | ✅ |
| **1.2** Dark mode toggle | Task 3 | ✅ |
| **1.4** Servidor de componentes (Server Components) | Preexistente en todas las páginas | ✅ |
| **1.4** Filtros dinámicos por URL params | Preexistente (FilterBar) | ✅ |
| **1.4** Skeleton Loading / estados de carga | Task 4 | ✅ |
| **1.4** Checkout paso a paso | Task 10 | ✅ |
| **1.4** Páginas /novedades y /ofertas | Tasks 6–7 | ✅ |
| **1.4** Páginas de ayuda e info | Tasks 8–9 | ✅ |
| **1.4** Error boundary | Task 5 | ✅ |
| **1.4** 404 personalizado | Task 5 | ✅ |
| Menú hamburguesa (mobile) | Task 2 | ✅ |

**Gaps intencionales para fases posteriores:**
- Integración Mercado Pago → Fase 2.1
- Newsletter API endpoint → Fase 2.4 (Resend)
- Imágenes de producto reales → Requiere GCP Storage (Fase 2.4)
- Autenticación de usuarios → No definido en Fase 1
- Lookbook, Prensa, Sustentabilidad, Careers → Fuera del scope de Fase 1
