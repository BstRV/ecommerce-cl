"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { Category } from "@ecommerce-preset/types"

const SORT_OPTIONS = [
  { label: "Destacados", value: "" },
  { label: "Más recientes", value: "new" },
  { label: "Precio: menor a mayor", value: "price-asc" },
  { label: "Precio: mayor a menor", value: "price-desc" },
]

interface FilterBarProps {
  categories: Category[]
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get("categoria")
  const activeSort = searchParams.get("sort") ?? ""

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div className="border-b border-border sticky top-16 z-40 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6 overflow-x-auto scrollbar-none">
        {/* Category chips */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => updateParam("categoria", null)}
            className={[
              "px-3 py-1.5 text-xs tracking-wide transition-colors border whitespace-nowrap",
              !activeCategory
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            ].join(" ")}
          >
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateParam(
                  "categoria",
                  activeCategory === cat.handle ? null : cat.handle
                )
              }
              className={[
                "px-3 py-1.5 text-xs tracking-wide transition-colors border whitespace-nowrap",
                activeCategory === cat.handle
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
              ].join(" ")}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="sort-select"
            className="text-xs text-muted-foreground whitespace-nowrap"
          >
            Ordenar por
          </label>
          <select
            id="sort-select"
            value={activeSort}
            onChange={(e) => updateParam("sort", e.target.value || null)}
            className="text-xs border border-border bg-transparent text-foreground px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
