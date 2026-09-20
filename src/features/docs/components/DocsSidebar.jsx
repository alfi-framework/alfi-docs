import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronsUpDown, Folder, FolderOpen } from 'lucide-react'
import { navigation } from '../data/navigation'
import { Badge } from '../../../shared/components/ui/Badge'
import { cn } from '../../../shared/utils/cn'

export function DocsSidebar({ isMobileOpen, onCloseMobile }) {
  const location = useLocation()

  // Initialize all navigation groups as open by default
  const [openGroups, setOpenGroups] = useState(() => {
    const initialState = {}
    navigation.forEach((group) => {
      initialState[group.group] = true
    })
    return initialState
  })

  // Auto-expand group if navigating directly to a route inside a collapsed group
  useEffect(() => {
    navigation.forEach((group) => {
      const containsActive = group.items.some((item) => item.path === location.pathname)
      if (containsActive && !openGroups[group.group]) {
        setOpenGroups((prev) => ({
          ...prev,
          [group.group]: true,
        }))
      }
    })
  }, [location.pathname])

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  const areAllOpen = navigation.every((group) => openGroups[group.group])

  const toggleAll = () => {
    const targetState = !areAllOpen
    const newState = {}
    navigation.forEach((group) => {
      newState[group.group] = targetState
    })
    setOpenGroups(newState)
  }

  const content = (
    <nav className="space-y-2 text-sm" aria-label="Documentation navigation">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/50 px-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted/70">
          Navigation
        </span>
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-fg-muted hover:text-brand-accent transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded px-1.5 py-0.5 hover:bg-surface-hover"
          title={areAllOpen ? 'Collapse all groups' : 'Expand all groups'}
        >
          <ChevronsUpDown className="w-3 h-3" />
          <span>{areAllOpen ? 'Collapse All' : 'Expand All'}</span>
        </button>
      </div>

      {navigation.map((group) => {
        const isOpen = !!openGroups[group.group]
        const hasActiveItem = group.items.some((item) => item.path === location.pathname)
        const FolderIcon = isOpen ? FolderOpen : Folder

        return (
          <div key={group.group} className="rounded-lg transition-colors">
            {/* Toggle Header Button */}
            <button
              type="button"
              onClick={() => toggleGroup(group.group)}
              aria-expanded={isOpen}
              aria-controls={`group-nav-${group.folder || group.group}`}
              className={cn(
                'flex items-center justify-between w-full text-left font-semibold text-[11px] uppercase tracking-wider px-2.5 py-2 rounded-lg transition-colors duration-150 select-none cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                hasActiveItem && !isOpen
                  ? 'text-brand-accent bg-brand/10'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-hover'
              )}
            >
              <span className="flex items-center gap-2">
                <FolderIcon className="w-3.5 h-3.5 text-brand-accent/80 group-hover:text-brand-accent transition-colors shrink-0" />
                <span>{group.group}</span>
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-fg-muted/70 group-hover:text-fg transition-transform duration-200 ease-out shrink-0',
                  isOpen ? 'rotate-0' : '-rotate-90'
                )}
              />
            </button>

            {/* Collapsible List Container */}
            <div
              id={`group-nav-${group.folder || group.group}`}
              className={cn(
                'grid transition-[grid-template-rows,opacity,margin] duration-200 ease-in-out',
                isOpen
                  ? 'grid-rows-[1fr] opacity-100 mt-1 mb-2'
                  : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'
              )}
            >
              <div className="overflow-hidden">
                <ul className="space-y-0.5 pl-2.5 ml-3 border-l border-border/40">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path

                    if (item.disabled) {
                      return (
                        <li key={item.title}>
                          <span className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-fg-muted/40 cursor-not-allowed text-xs font-medium select-none">
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
                            'flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all duration-150 text-xs font-medium focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
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
            </div>
          </div>
        )
      })}
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

