import { useState } from 'react'
import { Navbar } from '../../../shared/components/ui/Navbar'
import { DocsSidebar } from './DocsSidebar'

export function DocsLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
        <DocsSidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 py-8 min-w-0">{children}</main>
      </div>
    </div>
  )
}
