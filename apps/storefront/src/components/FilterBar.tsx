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
    <div className="border-b border-border sticky top-16 z-40 surface-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6 overflow-x-auto scrollbar-none">
        {/* Category chips */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => updateParam("categoria", null)}
            className={[
              "chip",
              !activeCategory ? "chip-active" : "",
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
                "chip",
                activeCategory === cat.handle ? "chip-active" : "",
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
            className="form-select form-select-sm"
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
