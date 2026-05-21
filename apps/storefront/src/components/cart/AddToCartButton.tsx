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
        "btn-primary w-full py-4",
        outOfStock
          ? "!bg-secondary !text-muted-foreground cursor-not-allowed opacity-100"
          : state === "added"
          ? "!bg-foreground/80 cursor-default"
          : "",
      ].join(" ")}
    >
      {outOfStock ? "Sin stock" : state === "added" ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  )
}
