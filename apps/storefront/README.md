# 🛍️ Storefront Next.js (White-Label E-commerce)

Este es el frontend de la tienda pública construido con **Next.js 15+ (App Router)** y optimizado para ser un preset white-label altamente tematizable, rápido y responsive.

La lógica de negocio está completamente separada del diseño visual, permitiendo adaptar la web a la identidad visual de cualquier cliente sin tocar el código base.

---

## 🛠️ Arquitectura y Carpeta de Temas

El diseño visual está centralizado en `src/theme/` y se compone de tres archivos CSS importados de forma secuencial por `src/app/globals.css`. Este sistema utiliza **Tailwind CSS v4** y propiedades personalizadas (CSS variables).

### Estructura de Capas de Estilos

```
                     ┌──> tokens.css      (Colores RGB, radios y espaciado)
src/app/globals.css ─┼──> typography.css  (Fuentes, escala fluida y rejilla decorativa)
                     └──> utilities.css   (Clases @utility reutilizables)
```

1. **`src/theme/tokens.css` (Capa de Tokens)**
   * Define los colores base en formato triplete RGB (`R G B` sin comas) para admitir opacidad dinámica en Tailwind CSS (ej. `bg-primary/80`).
   * Configura radios de borde, anchos máximos (`--layout-max-width`) y paddings semánticos.
   * Contiene bloques diferenciados para modo claro (`:root`) y modo oscuro (`.dark`).

2. **`src/theme/typography.css` (Capa de Tipografía y Animación)**
   * Administra la escala tipográfica fluida (`--text-hero`, `--text-quote`, `--text-search`).
   * Controla las duraciones y delays de micro-animaciones dinámicas y escalonadas (`--duration-*`, `--stagger-*`).
   * Define las celdas y la opacidad del fondo de cuadrícula decorativo (`--grid-size-*`, `--grid-opacity-*`).

3. **`src/theme/utilities.css` (Capa de Utilidades y Componentes)**
   * Registra las directivas de utilidad de Tailwind v4 (`@utility`) para crear clases reutilizables y semánticas, evitando la duplicación de clases complejas de Tailwind en las páginas o componentes.
   * **Clases Disponibles:**
     * `btn-primary`, `btn-outline`, `btn-ghost`, `btn-primary-lg` — Botones premium interactivos con sutiles micro-animaciones.
     * `form-input`, `form-input-error`, `form-label` — Controles y campos de entrada estandarizados.
     * `bg-grid`, `bg-grid-border` — Fondos con cuadrícula geométrica futurista y elegante.
     * `surface-blur` — Efectos de desenfoque de fondo premium (glassmorphism).
     * `chip`, `chip-active` — Filtros y etiquetas interactivas.

---

## 🎨 Guía de Re-Tematizado Rápido

Para re-tematizar la tienda completa y adaptarla a un nuevo cliente en minutos, sigue este checklist:

1. **Modificar Colores:** Abre `src/theme/tokens.css` y actualiza las variables en `:root` (claro) y `.dark` (oscuro) usando tripletes RGB.
2. **Sincronizar Brand Config:** Refleja la paleta de colores y configuraciones en `packages/assets/brand.config.ts`.
3. **Cambiar Tipografías:**
   * Importa las nuevas fuentes de Google Fonts en `src/app/layout.tsx`.
   * Asigna los nombres de las familias correspondientes en `tokens.css` (`--font-family-display` y `--font-family-sans`).
4. **Radios y Layouts:** Ajusta `--brand-radius` y las variables `--layout-*` en `tokens.css`.
5. **Utilidades Especiales:** Si el diseño requiere botones con bordes más afilados o inputs distintos, personaliza los estilos CSS dentro de `utilities.css`.

---

## 🌓 Consistencia y Persistencia de Modo Claro / Oscuro

Para asegurar una experiencia de usuario sobresaliente y evitar el parpadeo blanco indeseado en navegadores (FOUC o *Flash of Unstyled Content*), la app implementa:

1. **Script de Cabecera Síncrono (`layout.tsx`):**
   Un script embebido en el `<head>` de la página lee el valor del tema guardado en `localStorage` o infiere la preferencia del sistema (`prefers-color-scheme`) e inyecta inmediatamente la clase `.dark` en la etiqueta `<html>` antes de que el navegador comience el renderizado y antes de la hidratación de React.
2. **SSR-Safe Toggle (`ThemeToggle.tsx`):**
   El botón de cambio de tema espera de forma segura a que el componente esté montado en el cliente para sincronizarse y realizar cambios en el DOM sin discrepancias entre el HTML estático de Next.js y el DOM dinámico.

---

## 🚀 Cómo Desarrollar en Local

### Iniciar Servidor de Desarrollo

Desde la raíz del monorepo, puedes iniciar el storefront junto con los otros servicios corriendo:

```bash
npm run dev
```

O si deseas levantar únicamente el storefront de Next.js de manera aislada:

```bash
npx turbo run dev --filter=storefront
```

La tienda estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilar para Producción

Para validar el tipado completo de TypeScript y generar el build de Next.js optimizado:

```bash
npm run build
```
