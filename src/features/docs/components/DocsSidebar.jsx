import { NavLink, useLocation } from 'react-router-dom'
import { navigation } from '../data/navigation'
import { Badge } from '../../../shared/components/ui/Badge'
import { cn } from '../../../shared/utils/cn'

export function DocsSidebar({ isMobileOpen, onCloseMobile }) {
  const location = useLocation()

  const content = (
    <nav className="space-y-6 text-sm" aria-label="Documentation navigation">
      {navigation.map((group) => (
        <div key={group.group}>
          <h3 className="font-semibold text-fg text-[11px] uppercase tracking-wider mb-2.5 px-2 select-none">
            {group.group}
          </h3>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const isActive = location.pathname === item.path

              if (item.disabled) {
                return (
                  <li key={item.title}>
                    <span className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-fg-muted/40 cursor-not-allowed text-xs font-medium select-none">
                      <span>{item.title}</span>
                      {item.badge && <Badge variant="neutral">{item.badge}</Badge>}
                    </span>
                  </li>
                )
              }

              return (
                <li key={item.title}>
                  <NavLink
                    to={item.path}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors duration-150 text-xs font-medium focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
                      isActive
                        ? 'bg-brand/12 text-brand-accent font-semibold'
                        : 'text-fg-muted hover:text-fg hover:bg-surface-hover'
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && <Badge variant="brand">{item.badge}</Badge>}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-4 py-6 border-r border-border">
        {content}
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border p-6 shadow-2xl overflow-y-auto transition-transform duration-200 ease-in-out md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-6 font-bold text-lg text-fg pb-3 border-b border-border">
          Docs Navigation
        </div>
        {content}
      </div>
    </>
  )
}
