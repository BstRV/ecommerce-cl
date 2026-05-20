/**
 * Cliente API de MedusaJS v2 para Next.js 16 Storefront.
 * 
 * Implementa la conexión real con el backend en http://localhost:9000,
 * gestionando de forma robusta la sesión del carrito vía cookies y la
 * autenticación híbrida (Email/Password + JWT) por cabeceras Bearer.
 */

import type { Product, Category, Cart, Price, CurrencyCode, Customer, Order } from "@ecommerce-preset/types"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

/**
 * Interfaces para tipos internos de respuestas de Medusa v2 sin usar "any"
 */
interface MedusaProduct {
  id: string
  handle: string
  title: string
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  images?: { url: string }[]
  variants?: {
    id: string
    title: string
    sku?: string | null
    prices?: {
      amount: number
      currency_code: string
    }[]
    inventory_quantity?: number | null
    options?: Record<string, string> | null
  }[]
  categories?: {
    id: string
    handle?: string | null
    name: string
    description?: string | null
    parent_category_id?: string | null
  }[]
  tags?: { value: string }[]
  status?: "draft" | "proposed" | "published" | "rejected"
  created_at?: string
  updated_at?: string
}

interface MedusaCategory {
  id: string
  handle?: string | null
  name: string
  description?: string | null
  parent_category_id?: string | null
}

interface MedusaCart {
  id: string
  items?: {
    id: string
    variant_id: string
    product_id?: string
    title: string
    thumbnail?: string | null
    quantity: number
    unit_price?: number
  }[]
  subtotal?: number
  shipping_total?: number
  tax_total?: number
  total?: number
}

interface MedusaCustomer {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  addresses?: {
    first_name?: string
    last_name?: string
    address_1: string
    address_2?: string | null
    city: string
    province?: string | null
    postal_code: string
    country_code: string
    phone?: string | null
  }[]
  metadata?: Record<string, unknown> | null
}

interface MedusaOrder {
  id: string
  display_id?: number
  created_at: string
  status: string
  total?: number
  currency_code?: string
  metadata?: Record<string, unknown> | null
}

/**
 * Helper para cookies del lado del cliente y servidor.
 */
export const cookies = {
  get(name: string): string | null {
    if (typeof window === "undefined") return null
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"))
    return match ? decodeURIComponent(match[2] || "") : null
  },
  set(name: string, value: string, days = 7) {
    if (typeof window === "undefined") return
    let expires = ""
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = "; expires=" + date.toUTCString()
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`
  },
  delete(name: string) {
    this.set(name, "", -1)
  },
}

/**
 * Cliente HTTP unificado con recuperación/resiliencia ante fallos locales.
 */
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

    const res = await fetch(`${MEDUSA_URL}${path}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      return {
        data: null,
        error: errBody.message || `Error del servidor (${res.status})`,
      }
    }

    const json = await res.json()
    return { data: json, error: null }
  } catch (err) {
    console.error(`Fetch fallido hacia Medusa (${path}):`, err)
    return { data: null, error: "Error de red o backend no disponible" }
  }
}

// ─── API endpoints ────────────────────────────────────────────────────────────

export const medusa = {
  // ─── Products & Categories ──────────────────────────────────────────────────
  
  async getProducts(q?: string, categoryId?: string): Promise<Product[]> {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (categoryId) params.set("category_id", categoryId)
    
    const queryStr = params.toString() ? `?${params.toString()}` : ""
    const { data } = await medusaFetch<{ products: MedusaProduct[] }>(`/store/products${queryStr}`, {
      next: { revalidate: 30 }, // Caché de Next.js por 30s
    })
    
    if (!data || !data.products) return []
    
    // Mapear el formato de Medusa v2 a nuestro tipado unificado @ecommerce-preset/types
    return data.products.map(mapMedusaProduct)
  },

  async search(query: string): Promise<Product[]> {
    if (process.env.NEXT_PUBLIC_SEARCH_PROVIDER === "meilisearch") {
      try {
        const host = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700"
        const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
        const res = await fetch(`${host}/indexes/products/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ q: query }),
        })
        if (res.ok) {
          const json = await res.json()
          const hits = (json.hits || []) as MedusaProduct[]
          return hits.map(mapMedusaProduct)
        }
      } catch (err) {
        console.warn("Direct Meilisearch search failed, falling back to Medusa core:", err)
      }
    }
    return this.getProducts(query)
  },

  async getProductByHandle(handle: string): Promise<Product | null> {
    const { data } = await medusaFetch<{ products: MedusaProduct[] }>(`/store/products?handle=${handle}`, {
      next: { revalidate: 30 },
    })
    if (!data || !data.products || data.products.length === 0) return null
    return mapMedusaProduct(data.products[0] as MedusaProduct)
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await medusaFetch<{ product_categories: MedusaCategory[] }>(`/store/product-categories`, {
      next: { revalidate: 300 }, // Caché por 5 minutos
    })
    if (!data || !data.product_categories) return []
    return data.product_categories.map((cat) => ({
      id: cat.id,
      handle: cat.handle || cat.id,
      name: cat.name,
      description: cat.description || null,
      parentCategoryId: cat.parent_category_id || null,
    }))
  },

  // ─── Cart Management ────────────────────────────────────────────────────────

  async createCart(): Promise<Cart | null> {
    const { data } = await medusaFetch<{ cart: MedusaCart }>("/store/carts", {
      method: "POST",
      body: JSON.stringify({}),
    })
    if (!data || !data.cart) return null
    return mapMedusaCart(data.cart)
  },

  async getCart(cartId: string): Promise<Cart | null> {
    const { data } = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}`)
    if (!data || !data.cart) return null
    return mapMedusaCart(data.cart)
  },

  async addItemToCart(cartId: string, variantId: string, quantity: number): Promise<Cart | null> {
    const { data } = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId, quantity }),
    })
    if (!data || !data.cart) return null
    return mapMedusaCart(data.cart)
  },

  async updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart | null> {
    const { data } = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    })
    if (!data || !data.cart) return null
    return mapMedusaCart(data.cart)
  },

  async removeCartItem(cartId: string, lineItemId: string): Promise<Cart | null> {
    const { data } = await medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "DELETE",
    })
    if (!data || !data.cart) return null
    return mapMedusaCart(data.cart)
  },

  // ─── Authentication & Profile ───────────────────────────────────────────────

  async login(email: string, passwordHashOrPass: string): Promise<{ token: string | null; error: string | null }> {
    const { data, error } = await medusaFetch<{ token: string }>("/auth/emailpass/login", {
      method: "POST",
      body: JSON.stringify({ email, password: passwordHashOrPass }),
    })
    
    if (error || !data?.token) {
      return { token: null, error: error || "Credenciales incorrectas" }
    }
    
    // Guardar JWT en cookie de sesión
    cookies.set("medusa_jwt", data.token)
    return { token: data.token, error: null }
  },

  async register(email: string, passwordHashOrPass: string): Promise<{ ok: boolean; error: string | null }> {
    const { error } = await medusaFetch<unknown>("/auth/emailpass/register", {
      method: "POST",
      body: JSON.stringify({ email, password: passwordHashOrPass }),
    })
    
    if (error) return { ok: false, error }
    return { ok: true, error: null }
  },

  async getCustomer(): Promise<Customer | null> {
    const { data } = await medusaFetch<{ customer: MedusaCustomer }>("/store/customers/me")
    if (!data || !data.customer) return null
    return mapMedusaCustomer(data.customer)
  },

  async updateCustomer(firstName: string, lastName: string, phone: string, rut: string): Promise<Customer | null> {
    const { data } = await medusaFetch<{ customer: MedusaCustomer }>("/store/customers/me", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone,
        metadata: { rut },
      }),
    })
    if (!data || !data.customer) return null
    return mapMedusaCustomer(data.customer)
  },

  async getCustomerOrders(): Promise<Order[]> {
    const { data } = await medusaFetch<{ orders: MedusaOrder[] }>("/store/orders")
    if (!data || !data.orders) return []
    return data.orders.map(mapMedusaOrder)
  },

  // ─── Internal Analytics ─────────────────────────────────────────────────────

  async trackEvent(eventType: "view_item" | "add_to_cart", productId?: string, variantId?: string): Promise<void> {
    const customerId = cookies.get("medusa_customer_id") || undefined
    const sessionId = cookies.get("medusa_session_id") || undefined
    
    await medusaFetch<unknown>("/store/analytics/track", {
      method: "POST",
      body: JSON.stringify({
        event_type: eventType,
        product_id: productId,
        variant_id: variantId,
        customer_id: customerId,
        session_id: sessionId,
      }),
    })
  }
}

// ─── Mappers de datos de Medusa v2 a tipos unificados del Preset ───────────────

function mapMedusaProduct(p: MedusaProduct): Product {
  const prices: Price[] = p.variants?.[0]?.prices?.map((pr) => ({
    amount: pr.amount,
    currencyCode: (pr.currency_code || "CLP").toUpperCase() as CurrencyCode,
  })) || [{ amount: 0, currencyCode: "CLP" }]

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    subtitle: p.subtitle || null,
    description: p.description || null,
    thumbnail: p.thumbnail || null,
    images: p.images?.map((img) => img.url) || [],
    variants: p.variants?.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku || "",
      prices: v.prices?.map((pr) => ({
        amount: pr.amount,
        currencyCode: (pr.currency_code || "CLP").toUpperCase() as CurrencyCode,
      })) || prices,
      inventoryQuantity: v.inventory_quantity ?? 0,
      options: (v.options as Record<string, string>) || {},
    })) || [],
    categories: p.categories?.map((cat) => ({
      id: cat.id,
      handle: cat.handle || cat.id,
      name: cat.name,
      description: cat.description || null,
      parentCategoryId: cat.parent_category_id || null,
    })) || [],
    tags: p.tags?.map((t) => t.value) || [],
    status: p.status || "published",
    createdAt: p.created_at || new Date().toISOString(),
    updatedAt: p.updated_at || new Date().toISOString(),
  }
}

function mapMedusaCart(c: MedusaCart): Cart {
  const mapPrice = (amount: number): Price => ({
    amount,
    currencyCode: "CLP",
  })

  return {
    id: c.id,
    items: c.items?.map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id || "",
      title: item.title,
      thumbnail: item.thumbnail || null,
      quantity: item.quantity,
      unitPrice: mapPrice(item.unit_price || 0),
      totalPrice: mapPrice((item.unit_price || 0) * item.quantity),
    })) || [],
    subtotal: mapPrice(c.subtotal || 0),
    shippingTotal: mapPrice(c.shipping_total || 0),
    taxTotal: mapPrice(c.tax_total || 0),
    total: mapPrice(c.total || 0),
    itemCount: c.items?.reduce((sum: number, item) => sum + item.quantity, 0) || 0,
  }
}

function mapMedusaCustomer(c: MedusaCustomer): Customer {
  return {
    id: c.id,
    email: c.email,
    firstName: c.first_name || null,
    lastName: c.last_name || null,
    phone: c.phone || null,
    addresses: c.addresses?.map((addr) => ({
      firstName: addr.first_name || "",
      lastName: addr.last_name || "",
      address1: addr.address_1,
      address2: addr.address_2 || null,
      city: addr.city,
      province: addr.province || null,
      postalCode: addr.postal_code,
      countryCode: addr.country_code,
      phone: addr.phone || null,
    })) || [],
    metadata: (c.metadata as Record<string, unknown>) || {},
  }
}

function mapMedusaOrder(o: MedusaOrder): Order {
  return {
    id: o.id,
    display_id: o.display_id,
    created_at: o.created_at,
    status: o.status,
    total: o.total || 0,
    currency_code: (o.currency_code || "CLP").toUpperCase(),
    metadata: (o.metadata as Record<string, unknown>) || {},
  }
}
