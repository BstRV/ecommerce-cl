import { MOCK_PRODUCTS, CATEGORIES, filterByCategory } from '@/lib/mock-data'
import PageHeader from '@/components/PageHeader'
import FilterBar from '@/components/FilterBar'
import ProductGrid from '@/components/ProductGrid'
import EmptyState from '@/components/EmptyState'

interface SearchParams {
  categoria?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export const metadata = {
  title: 'Ofertas | Preset',
  description: 'Los mejores precios de nuestra tienda.',
}

export default async function OfertasPage({ searchParams }: Props) {
  const params = await searchParams

  // Filtrar por categoría si se proporciona
  const filteredProducts = filterByCategory(
    MOCK_PRODUCTS,
    params.categoria || null
  )

  // Ordenar por precio ascendente y obtener los 8 primeros
  const products = filteredProducts
    .sort((a, b) => {
      const priceA = a.variants[0]?.prices[0]?.amount ?? 0
      const priceB = b.variants[0]?.prices[0]?.amount ?? 0
      return priceA - priceB
    })
    .slice(0, 8)

  return (
    <>
      <PageHeader
        title="Ofertas"
        subtitle={`${products.length} productos en oferta`}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Ofertas' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Banner informativo de ofertas */}
        <div className="mb-8 p-4 border border-border bg-secondary rounded-[var(--brand-radius)] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-foreground flex-shrink-0" />
          <p className="text-sm text-foreground">
            Precios especiales por tiempo limitado. No se requieren códigos de descuento.
          </p>
        </div>

        <FilterBar categories={CATEGORIES} />

        {products.length === 0 ? (
          <EmptyState
            title="Sin ofertas disponibles"
            description="Vuelve pronto, agregamos nuevas ofertas regularmente."
            action={{ label: 'Ver todas las colecciones', href: '/colecciones' }}
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  )
}
