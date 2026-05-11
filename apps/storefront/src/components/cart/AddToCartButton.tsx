"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-store"
import type { Product, ProductVariant } from "@ecommerce-preset/types"

interface AddToCartButtonProps {
  product: Product
  variant: ProductVariant
  disabled?: boolean
}

export function AddToCartButton({
  product,
  variant,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [state, setState] = useState<"idle" | "added">("idle")

  const outOfStock = variant.inventoryQuantity === 0
  const isDisabled = disabled || outOfStock || state === "added"

  function handleClick() {
    if (isDisabled) return
    addItem(product, variant)
    setState("added")
    setTimeout(() => setState("idle"), 1800)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={
        outOfStock
          ? "Sin stock"
          : state === "added"
          ? "Producto agregado al carrito"
          : "Agregar al carrito"
      }
      className={[
        "w-full py-4 text-sm font-medium tracking-widest uppercase transition-all duration-200",
        outOfStock
          ? "bg-secondary text-muted-foreground cursor-not-allowed"
          : state === "added"
          ? "bg-foreground/80 text-background cursor-default"
          : "bg-foreground text-background hover:bg-foreground/85 active:scale-[0.99]",
      ].join(" ")}
    >
      {outOfStock ? "Sin stock" : state === "added" ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  )
}
