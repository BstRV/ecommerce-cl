export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground list-none p-0 m-0">
        <li>
          <a href="/" className="hover:text-foreground transition-colors">
            Inicio
          </a>
        </li>

        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {item.href && i < items.length - 1 ? (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={i === items.length - 1 ? "text-foreground" : ""}
                aria-current={i === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
