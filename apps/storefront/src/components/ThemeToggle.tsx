'use client'

import { useEffect, useState } from 'react'

/**
 * ThemeToggle — Selector de tema claro / oscuro.
 *
 * ARQUITECTURA DEL TEMA (sin FOUC ni discrepancia de hidratación):
 *
 * 1. layout.tsx inyecta un <script> inline que se ejecuta de forma SINCRÓNICA
 *    antes de React, leyendo localStorage y aplicando/quitando la clase "dark"
 *    en <html>. Esto garantiza que el tema correcto se pinte desde el primer frame.
 *
 * 2. Este componente arranca con useState(false) como valor seguro para SSR
 *    (el servidor no conoce las preferencias del cliente). En el primer render
 *    del cliente, useEffect lee el estado REAL del DOM (ya corregido por el
 *    script del paso 1) y sincroniza el estado de React sin necesidad de
 *    acceder a window/localStorage directamente en el render.
 *
 * 3. Al hacer toggle, actualiza simultáneamente el estado, el DOM y localStorage.
 */
export default function ThemeToggle() {
  // Valor inicial: false (seguro para SSR, evita discrepancia de hidratación).
  // El useEffect lo corrige en el cliente antes del primer repintado visible.
  const [dark, setDark] = useState(false)

  // Sincronizar con el DOM una vez que el componente monta en el cliente.
  // El script de layout.tsx ya aplicó la clase correcta → solo la leemos.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setDark(isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // Silenciar errores en contextos sin localStorage (e.g. modo incógnito estricto)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="w-8 h-8 flex items-center justify-center bg-transparent border-0 p-0 text-foreground/70 hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
    >
      {/* Sol / Luna — solo SVG inline, sin dependencias externas */}
      {dark ? (
        /* Sol (en modo oscuro → click cambia a claro) */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        /* Luna (en modo claro → click cambia a oscuro) */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}
