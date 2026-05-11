import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductGrid } from "@/components/ProductGrid"
import { EmptyState } from "@/components/EmptyState"
import { SearchInput } from "@/components/SearchInput"
import { searchProducts, MOCK_PRODUCTS } from "@/lib/mock-data"

interface BuscarPageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata = { title: "Buscar" }

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const results = query ? searchProducts(MOCK_PRODUCTS, query) : []

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Giant search input */}
        <div className="border-b border-border pb-8 mb-12">
          <SearchInput initialQuery={query} />
        </div>

        {/* Results */}
        {!query ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              ¿Qué estás buscando?
            </p>
            <p className="font-display text-4xl text-foreground">
              Busca en toda la colección
            </p>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title={`Sin resultados para "${query}"`}
            description="Prueba con otro término o explora la colección completa."
            action={{ label: "Ver colecciones", href: "/colecciones" }}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">
              {results.length} {results.length === 1 ? "resultado" : "resultados"} para &ldquo;{query}&rdquo;
            </p>
            <ProductGrid products={results} columns={4} />
          </>
        )}
      </main>

      <Footer />
    </>
  )
}
