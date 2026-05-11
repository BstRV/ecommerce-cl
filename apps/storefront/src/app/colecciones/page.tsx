import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PageHeader } from "@/components/PageHeader"
import { FilterBar } from "@/components/FilterBar"
import { ProductGrid } from "@/components/ProductGrid"
import { EmptyState } from "@/components/EmptyState"
import { MOCK_PRODUCTS, CATEGORIES, filterByCategory } from "@/lib/mock-data"

interface ColeccionesPageProps {
  searchParams: Promise<{ categoria?: string; sort?: string }>
}

export const metadata = { title: "Colecciones" }

export default async function ColeccionesPage({ searchParams }: ColeccionesPageProps) {
  const { categoria, sort } = await searchParams

  let products = filterByCategory(MOCK_PRODUCTS, categoria ?? null)

  if (sort === "price-asc") {
    products = [...products].sort(
      (a, b) => (a.variants[0]?.prices[0]?.amount ?? 0) - (b.variants[0]?.prices[0]?.amount ?? 0)
    )
  } else if (sort === "price-desc") {
    products = [...products].sort(
      (a, b) => (b.variants[0]?.prices[0]?.amount ?? 0) - (a.variants[0]?.prices[0]?.amount ?? 0)
    )
  } else if (sort === "new") {
    products = [...products].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  const activeCategory = CATEGORIES.find((c) => c.handle === categoria)

  return (
    <>
      <Navbar />

      <PageHeader
        title={activeCategory?.name ?? "Colecciones"}
        subtitle={activeCategory ? undefined : "Toda la ropa de temporada en un solo lugar."}
        breadcrumbs={
          activeCategory
            ? [{ label: "Colecciones", href: "/colecciones" }, { label: activeCategory.name }]
            : [{ label: "Colecciones" }]
        }
        count={products.length}
      />

      <FilterBar categories={CATEGORIES} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos productos para esta categoría."
            action={{ label: "Ver todos", href: "/colecciones" }}
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </main>

      <Footer />
    </>
  )
}
