"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

interface SearchInputProps {
  initialQuery?: string
}

export function SearchInput({ initialQuery = "" }: SearchInputProps) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed) {
        router.push(`/buscar?q=${encodeURIComponent(trimmed)}`)
      } else {
        router.push("/buscar")
      }
    },
    [router, value]
  )

  return (
    <form onSubmit={handleSubmit} role="search" className="flex items-end gap-4">
      <label htmlFor="search-input" className="sr-only">
        Buscar productos
      </label>
      <input
        id="search-input"
        type="search"
        autoFocus
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar…"
        className="flex-1 bg-transparent border-0 outline-none font-display text-foreground placeholder:text-muted-foreground/40"
        style={{ fontSize: "var(--text-search)", lineHeight: 1 }}
      />
      <button
        type="submit"
        className="btn-ghost shrink-0 mb-2 tracking-widest uppercase"
      >
        Buscar →
      </button>
    </form>
  )
}
