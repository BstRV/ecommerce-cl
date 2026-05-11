interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-fade-in">
      {/* Geometric motif */}
      <div className="relative w-20 h-20 mb-10" aria-hidden="true">
        <div className="absolute inset-0 border border-border rotate-45" />
        <div className="absolute inset-4 border border-muted-foreground/20 rotate-45" />
        <div className="absolute inset-[38%] bg-muted-foreground/20" />
      </div>

      <h2 className="font-display text-3xl text-foreground mb-3">{title}</h2>

      {description && (
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <a
          href={action.href}
          className="mt-8 inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/85 transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  )
}
