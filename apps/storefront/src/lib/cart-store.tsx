"use client"

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react"
import type { Product, ProductVariant } from "@ecommerce-preset/types"

// ─── Local cart item (richer than the API DTO in @ecommerce-preset/types) ─────

export interface LocalCartItem {
  /** variantId is the stable key */
  variantId: string
  product: Product
  variant: ProductVariant
  quantity: number
}

// ─── State & Actions ──────────────────────────────────────────────────────────

type CartState = {
  items: LocalCartItem[]
}

type CartAction =
  | { type: "ADD"; product: Product; variant: ProductVariant }
  | { type: "REMOVE"; variantId: string }
  | { type: "UPDATE_QTY"; variantId: string; quantity: number }
  | { type: "CLEAR" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.variantId === action.variant.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === action.variant.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        items: [
          ...state.items,
          { variantId: action.variant.id, product: action.product, variant: action.variant, quantity: 1 },
        ],
      }
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.variantId !== action.variantId) }
    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.variantId !== action.variantId) }
      }
      return {
        items: state.items.map((i) =>
          i.variantId === action.variantId ? { ...i, quantity: action.quantity } : i
        ),
      }
    }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type CartContextValue = {
  items: LocalCartItem[]
  dispatch: Dispatch<CartAction>
  itemCount: number
  /** Subtotal in base currency units (CLP integer, USD cents) */
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce(
    (sum, i) => sum + (i.variant.prices[0]?.amount ?? 0) * i.quantity,
    0
  )

  return (
    <CartContext.Provider value={{ items: state.items, dispatch, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}

export function useCart() {
  const { items, dispatch, itemCount, subtotal } = useCartContext()

  return {
    items,
    itemCount,
    subtotal,
    addItem: (product: Product, variant: ProductVariant) =>
      dispatch({ type: "ADD", product, variant }),
    removeItem: (variantId: string) => dispatch({ type: "REMOVE", variantId }),
    updateQuantity: (variantId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QTY", variantId, quantity }),
    clear: () => dispatch({ type: "CLEAR" }),
  }
}
