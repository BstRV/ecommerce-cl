// ─── Brand / Theme ────────────────────────────────────────────────────────────

export interface BrandConfig {
  name: string
  logo: string
  colors: {
    primary: string
    primaryFg: string
    secondary: string
    secondaryFg: string
    accent: string
    accentFg: string
    background: string
    foreground: string
    muted: string
    mutedFg: string
    border: string
    ring: string
    destructive: string
  }
  typography: {
    fontSans: string
    fontDisplay: string
    fontMono: string
  }
  radius: string
  animations: boolean
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  title: string
  sku: string
  prices: Price[]
  inventoryQuantity: number
  options: Record<string, string>
}

export interface Product {
  id: string
  handle: string
  title: string
  subtitle: string | null
  description: string | null
  thumbnail: string | null
  images: string[]
  variants: ProductVariant[]
  categories: Category[]
  tags: string[]
  status: "draft" | "proposed" | "published" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  handle: string
  name: string
  description: string | null
  parentCategoryId: string | null
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export type CurrencyCode = "CLP" | "USD" | "EUR"

export interface Price {
  amount: number
  currencyCode: CurrencyCode
}

/**
 * Formats a price amount for display.
 * @param amount - Amount in the currency's smallest unit (e.g. cents for USD, whole units for CLP)
 * @param currencyCode - ISO 4217 currency code
 * @param locale - BCP 47 locale tag (defaults to "es-CL")
 */
export function formatPrice(
  amount: number,
  currencyCode: CurrencyCode,
  locale = "es-CL"
): string {
  // CLP has no decimal places
  const minimumFractionDigits = currencyCode === "CLP" ? 0 : 2
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(amount)
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  variantId: string
  productId: string
  title: string
  thumbnail: string | null
  quantity: number
  unitPrice: Price
  totalPrice: Price
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: Price
  shippingTotal: Price
  taxTotal: Price
  total: Price
  itemCount: number
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  firstName: string
  lastName: string
  address1: string
  address2: string | null
  city: string
  province: string | null
  postalCode: string
  countryCode: string
  phone: string | null
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  addresses: Address[]
}
