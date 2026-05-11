import type { Category, Product } from "@ecommerce-preset/types"

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    id: "cat-mujer",
    handle: "mujer",
    name: "Mujer",
    description: "Colección femenina atemporal",
    parentCategoryId: null,
  },
  {
    id: "cat-hombre",
    handle: "hombre",
    name: "Hombre",
    description: "Esenciales masculinos de calidad",
    parentCategoryId: null,
  },
  {
    id: "cat-accesorios",
    handle: "accesorios",
    name: "Accesorios",
    description: "Los detalles que completan el look",
    parentCategoryId: null,
  },
]

// ─── Products ─────────────────────────────────────────────────────────────────

const SIZES = ["XS", "S", "M", "L", "XL"]

const PRODUCT_DATA = [
  {
    title: "Camisa Oxford Blanca",
    subtitle: "Colección Esencial",
    description:
      "Confeccionada en algodón Oxford 100% de peso medio. Cuello button-down clásico, puños con botón doble, costuras reforzadas y corte recto con pinzas en la espalda para mayor fluidez. Una pieza atemporal que mejora con cada lavado.",
    price: 34990,
    category: CATEGORIES[0]!,
  },
  {
    title: "Pantalón Chino Beige",
    subtitle: "Esencial Moderno",
    description:
      "Tela de algodón y elastano (98/2) para movimiento sin sacrificar estructura. Corte slim desde la cintura hasta el tobillo, con cuatro bolsillos clásicos y cierre invisible. El pantalón que resuelve el 80% de los días.",
    price: 42990,
    category: CATEGORIES[1]!,
  },
  {
    title: "Blazer Estructurado Negro",
    subtitle: "Edición Limitada",
    description:
      "Blazer de entretela termofusionada con lana virgen. Hombros naturales sin relleno, solapa de muesca media, dos botones de nácar. Forro de viscosa que reduce la electricidad estática. Para reuniones y para el sábado por igual.",
    price: 89990,
    category: CATEGORIES[0]!,
  },
  {
    title: "Vestido Midi Negro",
    subtitle: "Colección Noche",
    description:
      "Crepé de poliéster de alta gramaje. Escote en V moderado, manga tres cuartos, largo midi que cae a la pantorrilla. Cierre invisible lateral. El negro más preciso de la colección: ni mate ni brillante, exactamente en el punto medio.",
    price: 59990,
    category: CATEGORIES[0]!,
  },
  {
    title: "Chaqueta Cuero Italiano",
    subtitle: "Selección Premium",
    description:
      "Cuero vacuno curtido al vegetal, 0.9mm de grosor. Interior de algodón sin olor a plástico. Corte recto, dos bolsillos con cierre YKK oculto, cuello mao. Desarrollada para durar una década sin perder forma.",
    price: 149990,
    category: CATEGORIES[1]!,
  },
  {
    title: "Falda Plisada Gris",
    subtitle: "Colección Otoño",
    description:
      "Viscosa texturizada con plisado permanente a vapor. Cintura elástica forrada, largo hasta la rodilla. Los pliegues mantienen su forma incluso después del lavado a mano. Un clásico reinterpretado sin concesiones.",
    price: 38990,
    category: CATEGORIES[0]!,
  },
  {
    title: "Suéter Merino Crema",
    subtitle: "Colección Invierno",
    description:
      "Lana merino extrafina 18.5 micras, tratamiento anti-pilling. Cuello redondo, punto jersey en el cuerpo y punto arroz en los puños y el cuello. Lavable a máquina a 30°C. Suavidad que no se degrada.",
    price: 64990,
    category: CATEGORIES[0]!,
  },
  {
    title: "Trench Clásico Camel",
    subtitle: "Pieza Clave",
    description:
      "Gabardina de algodón con impermeabilización DWR sin flúor. Forro desmontable de lana para temporada de frío. Correa regulable, botones de resina natural. El trench que no necesita temporada.",
    price: 119990,
    category: CATEGORIES[1]!,
  },
  {
    title: "Bolso Bucket Cuero",
    subtitle: "Accesorios",
    description:
      "Cuero full-grain de primera capa sin corrección de superficie. Correa regulable de 60 a 120cm, fondo plano para mayor estabilidad, bolsillo interior con cierre. Envejece con carácter.",
    price: 79990,
    category: CATEGORIES[2]!,
  },
  {
    title: "Cinturón Cuero Tejido",
    subtitle: "Accesorios",
    description:
      "Trenza de cuero vacuno en tres tiras. Hebilla de bronce fundido sin níquel. Ancho 3cm. Disponible en negro y cognac. Hecho a mano en pequeñas series.",
    price: 29990,
    category: CATEGORIES[2]!,
  },
  {
    title: "Camisa Lino Blanca",
    subtitle: "Temporada Verano",
    description:
      "Lino europeo de 180 g/m². Cuello italiano abierto, manga larga con dobladillo a un botón. Sin forro para máxima transpirabilidad. La arruga es parte del carácter del tejido, no un defecto.",
    price: 44990,
    category: CATEGORIES[1]!,
  },
  {
    title: "Jersey Algodón Grueso",
    subtitle: "Colección Otoño",
    description:
      "Punto grueso de algodón peinado 400 g/m². Cuello vuelto ancho, corte oversized con costuras caídas. Ideal sobre camisas o solo. El tejido que define la temporada.",
    price: 49990,
    category: CATEGORIES[0]!,
  },
]

export const MOCK_PRODUCTS: Product[] = PRODUCT_DATA.map((data, i) => ({
  id: `product-${i + 1}`,
  handle: data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  title: data.title,
  subtitle: data.subtitle,
  description: data.description,
  thumbnail: null,
  images: [],
  variants: SIZES.map((size, si) => ({
    id: `var-${i + 1}-${si}`,
    title: size,
    sku: `SKU-${(i + 1) * 100 + si}`,
    prices: [{ amount: data.price, currencyCode: "CLP" as const }],
    inventoryQuantity: si < 3 ? 8 : 2,
    options: { Talla: size },
  })),
  categories: [data.category],
  tags: [],
  status: "published" as const,
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  updatedAt: new Date().toISOString(),
}))

/** Filtra productos por handle de categoría. null = todos */
export function filterByCategory(
  products: Product[],
  categoryHandle: string | null
): Product[] {
  if (!categoryHandle) return products
  return products.filter((p) =>
    p.categories.some((c) => c.handle === categoryHandle)
  )
}

/** Filtra productos por término de búsqueda */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.subtitle?.toLowerCase().includes(q) ?? false) ||
      (p.description?.toLowerCase().includes(q) ?? false)
  )
}

/** Retorna un producto por handle */
export function getProductByHandle(handle: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.handle === handle)
}

/** Retorna N productos relacionados (excluyendo el actual) */
export function getRelatedProducts(
  currentHandle: string,
  count = 4
): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.handle !== currentHandle).slice(0, count)
}
