import { MOCK_PRODUCTS, CATEGORIES, filterByCategory } from '@/lib/mock-data'
import { Navbar } from '@/components/Navbar'
import { PageHeader } from '@/components/PageHeader'
import { FilterBar } from '@/components/FilterBar'
import { ProductGrid } from '@/components/ProductGrid'
import { EmptyState } from '@/components/EmptyState'
import { Footer } from '@/components/Footer'

interface SearchParams {
  categoria?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export const metadata = {
  title: 'Novedades | Preset',
  description: 'Las últimas incorporaciones a nuestra colección.',
}

export default async function NovedadesPage({ searchParams }: Props) {
  const params = await searchParams

  // Filtrar por categoría si se proporciona, luego obtener los 8 primeros (más recientes)
  const filteredProducts = filterByCategory(
    MOCK_PRODUCTS,
    params.categoria || null
  )

  // Los productos están ordenados por fecha descendente (createdAt más reciente primero)
  const products = filteredProducts.slice(0, 8)

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <PageHeader
          title="Novedades"
          subtitle={`${products.length} productos`}
          breadcrumbs={[{ label: "Novedades" }]}
        />

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <FilterBar categories={CATEGORIES} />

          {products.length === 0 ? (
            <EmptyState
              title="Sin novedades por ahora"
              description="Vuelve pronto, estamos actualizando el catálogo."
              action={{ label: 'Ver todas las colecciones', href: '/colecciones' }}
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
