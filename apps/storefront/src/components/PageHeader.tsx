import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb"

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  /** Muestra un conteo debajo del título */
  count?: number
  countLabel?: string
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  count,
  countLabel = "productos",
}: PageHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-display text-6xl md:text-7xl text-foreground leading-none">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-muted-foreground text-sm max-w-md leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {count !== undefined && (
            <p className="text-sm text-muted-foreground self-end pb-1">
              {count} {countLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
