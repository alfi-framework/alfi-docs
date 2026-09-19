import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Search, Menu, X, Heart, BookOpen } from 'lucide-react'
import { siteConfig } from '../../../docs'
import { cn } from '../../utils/cn'

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export function Navbar({ isMobileMenuOpen: externalMobileOpen, onToggleMobileMenu: externalToggleMobile }) {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const location = useLocation()
  const isDocs = location.pathname.startsWith('/docs')

  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen
  const toggleMobileMenu = externalToggleMobile || (() => setInternalMobileOpen(!internalMobileOpen))

  const closeMobileMenu = () => {
    if (externalToggleMobile && externalMobileOpen) {
      externalToggleMobile()
    } else {
      setInternalMobileOpen(false)
    }
  }

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu()
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/80 border-b border-border transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + main navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-brand rounded-lg p-1"
          >
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/docs"
              className={cn(
                'px-3 py-1.5 rounded-md transition-colors',
                isDocs
                  ? 'text-brand-accent bg-brand/10 font-semibold'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-hover'
              )}
            >
              Documentation
            </Link>
          </nav>
        </div>

        {/* Right: Controls (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search Button */}
          {/* TODO(phase-2): Implement docsearch / command palette modal */}
          <button
            type="button"
            onClick={() => {
              /* TODO(phase-2): trigger search dialog */
              alert('Search is under development for Phase 2!')
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-fg-muted bg-bg border border-border hover:border-brand/40 hover:text-fg rounded-lg transition-colors cursor-pointer group"
            title="Search documentation (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg" />
            <span>Search docs...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-fg-muted">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Desktop GitHub Link */}
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Desktop Sponsor / Support button */}
          <a
            href={siteConfig.sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            title="Sponsor Alfi project"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>Sponsor</span>
          </a>

          {/* Theme Toggle (Always visible, left side of hamburger on mobile) */}
          <ThemeToggle />

          {/* Mobile Hamburger Menu Button (Far right corner on mobile) */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-fg" />
            ) : (
              <Menu className="w-5 h-5 text-fg" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Mobile Navigation Modal & Backdrop */}
      {isMobileOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-150"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Floating Popover Modal */}
          <div className="fixed top-18 right-4 sm:right-6 z-50 w-72 sm:w-80 rounded-2xl bg-surface border border-border p-4 shadow-2xl md:hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border text-[11px] font-bold text-fg-muted uppercase tracking-wider select-none">
              <span>Menu</span>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu()
                  alert('Search is under development for Phase 2!')
                }}
                className="p-1 rounded-lg hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors cursor-pointer"
                title="Search documentation"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Links List */}
            <div className="space-y-1">
              {/* Docs */}
              <Link
                to="/docs"
                onClick={closeMobileMenu}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isDocs
                    ? 'text-brand-accent bg-brand/12 font-semibold'
                    : 'text-fg hover:bg-surface-hover'
                )}
              >
                <BookOpen className="w-4 h-4 text-brand-accent" />
                <span>Docs</span>
              </Link>

              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu()
                  alert('Search is under development for Phase 2!')
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-surface-hover transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 text-fg">
                  <Search className="w-4 h-4 text-fg-muted" />
                  <span>Search</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-bg border border-border rounded text-fg-muted">
                  ⌘K
                </kbd>
              </button>

              {/* GitHub Link */}
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-surface-hover transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-fg-muted" />
                <span>GitHub</span>
              </a>

              {/* Support / Sponsor Button */}
              <div className="pt-2.5 mt-2 border-t border-border">
                <a
                  href={siteConfig.sponsorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 transition-colors shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-current text-rose-500" />
                  <span>Support</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
