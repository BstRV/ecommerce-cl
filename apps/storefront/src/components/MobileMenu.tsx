'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/novedades',   label: 'Novedades'   },
  { href: '/ofertas',     label: 'Ofertas'     },
  { href: '/nosotros',    label: 'Nosotros'    },
  { href: '/contacto',    label: 'Contacto'    },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        <span
          className={`block h-px w-6 bg-foreground transition-transform duration-300 origin-center ${
            open ? 'translate-y-[4px] rotate-45' : ''
          }`}
        />
        <span
          className={`block h-px w-6 bg-foreground transition-opacity duration-300 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-px w-6 bg-foreground transition-transform duration-300 origin-center ${
            open ? '-translate-y-[10px] -rotate-45' : ''
          }`}
        />
      </button>

      {/* Panel deslizante */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-background border-l border-border flex flex-col pt-20 px-8 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-5 right-6 text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
            >
              ×
            </button>

            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-lg font-light tracking-wide border-b border-border transition-colors hover:text-foreground ${
                      pathname === href
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Links de ayuda al pie */}
            <div className="mt-auto pb-8 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/ayuda/envios" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Envíos</Link>
              <Link href="/ayuda/devoluciones" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Devoluciones</Link>
              <Link href="/carrito" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Ver carrito</Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
