import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, ArrowRight, Sparkles, Trash2 } from 'lucide-react'
import { useSearchStore } from '../../../store/useSearchStore'
import { useSearch } from '../hooks/useSearch'
import { SearchResultItem } from './SearchResultItem'

export function SearchDialog() {
  const { isOpen, closeSearch, toggleSearch, recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore()
  const { query, setQuery, results } = useSearch()
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevQuery, setPrevQuery] = useState(query)

  if (query !== prevQuery) {
    setPrevQuery(query)
    setActiveIndex(0)
  }

  const inputRef = useRef(null)
  const resultsContainerRef = useRef(null)
  const previousFocusRef = useRef(null)
  const navigate = useNavigate()

  const handleSelectResult = useCallback((item) => {
    if (query.trim()) {
      addRecentSearch(query)
    }

    closeSearch()
    setQuery('')

    const path = item.type === 'section' && item.anchor
      ? `/docs/${item.slug}#${item.anchor}`
      : `/docs/${item.slug}`

    navigate(path)
  }, [query, addRecentSearch, closeSearch, setQuery, navigate])

  // Focus trap & body scroll locking
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'

      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 50)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus()
        }
      }
    }
  }, [isOpen])

  // Global Keyboard listener (Cmd/Ctrl+K, '/', Esc, Arrows, Enter)
  useEffect(() => {
    function handleKeyDown(event) {
      // Toggle Cmd/Ctrl+K
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggleSearch()
        return
      }

      // '/' shortcut trigger
      if (event.key === '/' && !isOpen) {
        const target = event.target
        const isEditable =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable

        if (!isEditable) {
          event.preventDefault()
          useSearchStore.getState().openSearch()
          return
        }
      }

      if (!isOpen) return

      if (event.key === 'Escape') {
        event.preventDefault()
        closeSearch()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (results.length > 0) {
          setActiveIndex((prev) => (prev + 1) % results.length)
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (results.length > 0) {
          setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
        }
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (results.length > 0 && results[activeIndex]) {
          handleSelectResult(results[activeIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, activeIndex, toggleSearch, closeSearch, handleSelectResult])

  // Auto scroll active item into view
  useEffect(() => {
    if (!isOpen || results.length === 0) return
    const activeEl = document.getElementById(`option-${activeIndex}`)
    if (activeEl && resultsContainerRef.current) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, isOpen, results])

  if (!isOpen) return null

  const handleSelectRecent = (recentQuery) => {
    setQuery(recentQuery)
  }

  const handleQuickLink = (path) => {
    closeSearch()
    setQuery('')
    navigate(path)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 pb-4">
      {/* Full-screen backdrop with blurred background */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Dialog Window */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Documentation search"
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-fg-muted shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="search-results-list"
            aria-activedescendant={results.length > 0 ? `option-${activeIndex}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, concepts, code..."
            className="w-full py-4 bg-transparent text-fg placeholder:text-fg-muted text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors cursor-pointer mr-2"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="px-2 py-1 rounded-md text-xs font-mono bg-bg border border-border text-fg-muted hover:text-fg transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Search Results / Empty State Body */}
        <div
          ref={resultsContainerRef}
          id="search-results-list"
          role="listbox"
          className="flex-1 overflow-y-auto p-3 space-y-1"
        >
          {query.trim() === '' ? (
            /* Empty Query State */
            <div className="py-2 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-semibold text-fg-muted uppercase tracking-wider select-none">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
                      title="Clear recent searches"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((rec, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectRecent(rec)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors text-left cursor-pointer"
                      >
                        <span className="truncate">{rec}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div>
                <div className="px-3 mb-2 text-[11px] font-semibold text-fg-muted uppercase tracking-wider select-none flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Popular Topics</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => handleQuickLink('/docs/introduction')}
                    className="p-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-fg group-hover:text-brand-accent transition-colors">
                      Introduction
                    </div>
                    <div className="text-[11px] text-fg-muted mt-0.5">Overview & goals</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLink('/docs/installation')}
                    className="p-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-fg group-hover:text-brand-accent transition-colors">
                      Installation
                    </div>
                    <div className="text-[11px] text-fg-muted mt-0.5">CMake setup</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLink('/docs/quick-start')}
                    className="p-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-fg group-hover:text-brand-accent transition-colors">
                      Quick Start
                    </div>
                    <div className="text-[11px] text-fg-muted mt-0.5">First HTTP server</div>
                  </button>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Search Results List */
            results.map((item, index) => (
              <SearchResultItem
                key={item.id}
                id={`option-${index}`}
                item={item}
                query={query}
                isActive={index === activeIndex}
                onSelect={() => handleSelectResult(item)}
                onMouseEnter={() => setActiveIndex(index)}
              />
            ))
          ) : (
            /* No Results State */
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-fg mb-1">
                No results for "<span className="text-brand-accent">{query}</span>"
              </p>
              <p className="text-xs text-fg-muted">
                Try searching for general terms like <code className="font-mono text-brand-accent">routing</code>, <code className="font-mono text-brand-accent">cmake</code>, or <code className="font-mono text-brand-accent">swagger</code>.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-surface-hover/50 border-t border-border flex items-center justify-between text-[11px] text-fg-muted select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 font-mono bg-surface border border-border rounded">↑</kbd>
              <kbd className="px-1 py-0.5 font-mono bg-surface border border-border rounded">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 font-mono bg-surface border border-border rounded">↵</kbd>
              <span>open</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 font-mono bg-surface border border-border rounded">esc</kbd>
            <span>close</span>
          </span>
        </div>
      </div>
    </div>
  )
}
