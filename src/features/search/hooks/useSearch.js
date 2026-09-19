import { useState, useEffect, useTransition } from 'react'
import { buildSearchIndex, searchDocs } from '../services/searchService'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  // Lazy index prefetch on idle after initial render
  useEffect(() => {
    if (typeof window === 'undefined') return
    const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1))
    const handle = scheduleIdle(() => {
      buildSearchIndex()
    })

    return () => {
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle)
      }
    }
  }, [])

  // Update results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    startTransition(() => {
      const found = searchDocs(query)
      setResults(found)
    })
  }, [query])

  return {
    query,
    setQuery,
    results,
    isSearching: isPending,
  }
}
