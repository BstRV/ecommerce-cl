"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-store"
import MobileMenu from "./MobileMenu"
import ThemeToggle from "./ThemeToggle"

const NAV_LINKS = [
  { label: "Colecciones", href: "/colecciones" },
  { label: "Novedades", href: "/novedades" },
  { label: "Ofertas", href: "/ofertas" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Inicio"
        >
          <span
            className="block w-4 h-4 bg-foreground"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold tracking-widest uppercase text-foreground">
            Preset
          </span>
        </Link>

        {/* Primary nav */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="/buscar"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Buscar"
          >
            <SearchIcon />
          </a>
          <ThemeToggle />
          <a
            href="/carrito"
            className="relative text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Carrito"
          >
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </a>
          <MobileMenu />
        </div>
      </nav>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
