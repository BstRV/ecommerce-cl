"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import type { Product, ProductVariant, Price, Cart, CartItem } from "@ecommerce-preset/types"
import { medusa, cookies } from "./medusa"

export interface LocalCartItem {
  variantId: string
  product: {
    title: string
    thumbnail: string | null
  }
  variant: {
    id: string
    title: string
    inventoryQuantity?: number
    prices: Price[]
  }
  quantity: number
  lineItemId?: string
}

type CartContextValue = {
  items: LocalCartItem[]
  itemCount: number
  subtotal: number
  loading: boolean
  addItem: (product: Product, variant: ProductVariant) => Promise<void>
  removeItem: (variantId: string) => Promise<void>
  updateQuantity: (variantId: string, quantity: number) => Promise<void>
  clear: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [itemCount, setItemCount] = useState<number>(0)
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Map Medusa Cart items to LocalCartItem format
  const mapCartToLocal = React.useCallback((medusaCart: Cart) => {
    if (!medusaCart) return
    const mapped: LocalCartItem[] = (medusaCart.items || []).map((item: CartItem) => ({
      variantId: item.variantId,
      product: {
        title: item.title,
        thumbnail: item.thumbnail,
      },
      variant: {
        id: item.variantId,
        title: item.title,
        prices: [item.unitPrice],
      },
      quantity: item.quantity,
      lineItemId: item.id,
    }))
    setItems(mapped)
    setSubtotal(medusaCart.subtotal?.amount || 0)
    setItemCount(medusaCart.itemCount || 0)
  }, [])

  const initCart = React.useCallback(async () => {
    let activeCartId = cookies.get("medusa_cart_id")
    let cart = null

    try {
      if (activeCartId) {
        cart = await medusa.getCart(activeCartId)
      }

      if (!cart) {
        cart = await medusa.createCart()
        if (cart) {
          activeCartId = cart.id
          cookies.set("medusa_cart_id", cart.id)
        }
      }

      if (cart) {
        setCartId(cart.id)
        mapCartToLocal(cart)
      }
    } catch (err) {
      console.error("Error initializing cart:", err)
    } finally {
      setLoading(false)
    }
  }, [mapCartToLocal])

  useEffect(() => {
    let active = true
    const runInit = async () => {
      if (active) {
        await initCart()
      }
    }
    runInit()
    return () => {
      active = false
    }
  }, [initCart])

  const refreshCart = async () => {
    const activeCartId = cookies.get("medusa_cart_id")
    if (activeCartId) {
      const cart = await medusa.getCart(activeCartId)
      if (cart) {
        mapCartToLocal(cart)
      }
    }
  }

  const addItem = async (product: Product, variant: ProductVariant) => {
    let activeCartId = cartId
    if (!activeCartId) {
      activeCartId = cookies.get("medusa_cart_id")
    }
    if (!activeCartId) return

    setLoading(true)
    const cart = await medusa.addItemToCart(activeCartId, variant.id, 1)
    if (cart) {
      mapCartToLocal(cart)
      // Trigger internal analytics
      try {
        await medusa.trackEvent("add_to_cart", product.id, variant.id)
      } catch (err) {
        console.error("Error sending add_to_cart analytics:", err)
      }
    }
    setLoading(false)
  }

  const removeItem = async (variantId: string) => {
    const activeCartId = cartId || cookies.get("medusa_cart_id")
    if (!activeCartId) return

    const item = items.find((i) => i.variantId === variantId)
    if (!item || !item.lineItemId) return

    setLoading(true)
    const cart = await medusa.removeCartItem(activeCartId, item.lineItemId)
    if (cart) {
      mapCartToLocal(cart)
    }
    setLoading(false)
  }

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(variantId)
      return
    }

    const activeCartId = cartId || cookies.get("medusa_cart_id")
    if (!activeCartId) return

    const item = items.find((i) => i.variantId === variantId)
    if (!item || !item.lineItemId) return

    setLoading(true)
    const cart = await medusa.updateCartItem(activeCartId, item.lineItemId, quantity)
    if (cart) {
      mapCartToLocal(cart)
    }
    setLoading(false)
  }

  const clear = async () => {
    setLoading(true)
    // Delete current cart cookie and create a new cart
    cookies.delete("medusa_cart_id")
    const cart = await medusa.createCart()
    if (cart) {
      setCartId(cart.id)
      cookies.set("medusa_cart_id", cart.id)
      mapCartToLocal(cart)
    } else {
      setItems([])
      setSubtotal(0)
      setItemCount(0)
      setCartId(null)
    }
    setLoading(false)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}
