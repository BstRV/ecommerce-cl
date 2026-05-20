"use client"

import { useEffect } from "react"
import { medusa } from "@/lib/medusa"

interface ProductViewTrackerProps {
  productId: string
}

export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    medusa.trackEvent("view_item", productId)
  }, [productId])

  return null
}
