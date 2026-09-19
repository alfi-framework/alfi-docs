import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useSearchStore } from '../../../store/useSearchStore'
import { cn } from '../../../shared/utils/cn'

export function SearchTrigger({ className = '', variant = 'default' }) {
  const { openSearch } = useSearchStore()
  const [shortcutKey, setShortcutKey] = useState('⌘K')

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent)) {
      setShortcutKey('⌘K')
    } else {
      setShortcutKey('Ctrl K')
    }
  }, [])

  if (variant === 'iconOnly') {
    return (
      <button
        type="button"
        onClick={openSearch}
        className={cn(
          'p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
          className
        )}
        title={`Search documentation (${shortcutKey})`}
        aria-label="Open search dialog"
      >
        <Search className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 text-xs text-fg-muted bg-bg border border-border hover:border-brand/40 hover:text-fg rounded-lg transition-colors cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none select-none',
        className
      )}
      title={`Search documentation (${shortcutKey})`}
    >
      <Search className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors" />
      <span className="hidden sm:inline">Search docs...</span>
      <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-fg-muted">
        {shortcutKey}
      </kbd>
    </button>
  )
}
