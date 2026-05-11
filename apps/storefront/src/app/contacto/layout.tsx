import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | Preset',
  description: 'Ponte en contacto con nosotros.',
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
