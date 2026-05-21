import type { BrandConfig } from "@ecommerce-preset/types"

/**
 * Configuración central de marca — White-Label Brand Config
 * ─────────────────────────────────────────────────────────────────────────────
 * Este es el archivo de referencia conceptual de la identidad de marca.
 * Aquí se documenta qué decisiones visuales se tomaron y por qué.
 *
 * PARA RE-TEMATIZAR LA TIENDA (en orden):
 *   1. Editar colors aquí → reflejar en src/theme/tokens.css (:root y .dark)
 *   2. Editar typography aquí → reflejar en src/app/layout.tsx (next/font imports)
 *                               y en src/theme/tokens.css (--font-family-*)
 *   3. Editar radius aquí → reflejar en src/theme/tokens.css (--brand-radius)
 *   4. Ajustar tamaños fluidos en src/theme/typography.css
 *   5. Ajustar patrones visuales en src/theme/utilities.css
 *
 * SINCRONIZACIÓN:
 *   Los valores numéricos de colors deben coincidir EXACTAMENTE con los
 *   --brand-* en tokens.css (formato RGB: "R G B" sin comas).
 *   Este archivo es la fuente de documentación; tokens.css es la fuente
 *   de verdad que usa el navegador en tiempo de ejecución.
 *
 * ARCHIVOS DE TEMA (todos en apps/storefront/src/theme/):
 *   - tokens.css      → colores, radios, layout, tipografías base
 *   - typography.css  → escala fluida, tracking, grids decorativos, timings
 *   - utilities.css   → @utility: botones, inputs, chips, fondos, efectos
 */
export const brandConfig = {
  name: "Ecommerce Preset",
  logo: "/assets/logo.svg",

  colors: {
    // Light mode — RGB triplets matching tokens.css :root values
    primary:       "9 9 11",
    primaryFg:     "250 250 250",
    secondary:     "244 244 245",
    secondaryFg:   "9 9 11",
    accent:        "228 228 231",
    accentFg:      "9 9 11",
    background:    "255 255 255",
    foreground:    "9 9 11",
    muted:         "244 244 245",
    mutedFg:       "113 113 122",
    border:        "228 228 231",
    ring:          "9 9 11",
    destructive:   "239 68 68",
  },

  typography: {
    fontSans:    "Geist, system-ui, sans-serif",
    fontDisplay: "DM Serif Display, Georgia, serif",
    fontMono:    "Geist Mono, monospace",
  },

  radius: "0.375rem",
  animations: true,
} satisfies BrandConfig
