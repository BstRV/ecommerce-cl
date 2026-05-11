import type { BrandConfig } from "@ecommerce-preset/types"

/**
 * Central white-label configuration.
 *
 * This is the single place to adjust the brand identity. Values here
 * are the canonical reference; the CSS custom properties in
 * apps/storefront/src/theme/tokens.css must be kept in sync with
 * any color changes made here.
 *
 * Font strings match the CSS fallback chains defined in tokens.css.
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
