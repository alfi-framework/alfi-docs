import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { flatNavigation } from '../data/navigation'

export function DocPagination() {
  const location = useLocation()
  const currentIndex = flatNavigation.findIndex(
    (item) => item.path === location.pathname
  )

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? flatNavigation[currentIndex - 1] : null
  const next =
    currentIndex < flatNavigation.length - 1
      ? flatNavigation[currentIndex + 1]
      : null

  return (
    <nav
      className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
      aria-label="Doc page pagination"
    >
      {prev ? (
        <Link
          to={prev.path}
          className="w-full sm:w-auto flex items-center gap-2 p-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-left transition-colors group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-fg-muted group-hover:text-brand-accent transition-transform group-hover:-translate-x-0.5" />
          <div>
            <div className="text-[11px] font-medium text-fg-muted uppercase tracking-wider">
              Previous
            </div>
            <div className="text-sm font-semibold text-fg group-hover:text-brand-accent transition-colors">
              {prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          to={next.path}
          className="w-full sm:w-auto flex items-center justify-end gap-2 p-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-right transition-colors group cursor-pointer sm:ml-auto"
        >
          <div>
            <div className="text-[11px] font-medium text-fg-muted uppercase tracking-wider">
              Next
            </div>
            <div className="text-sm font-semibold text-fg group-hover:text-brand-accent transition-colors">
              {next.title}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-fg-muted group-hover:text-brand-accent transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  )
}
