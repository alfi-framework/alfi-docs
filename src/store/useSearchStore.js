import { create } from 'zustand'

const LOCAL_STORAGE_KEY = 'alfi-recent-searches'

function getInitialRecents() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, 5) : []
  } catch (e) {
    return []
  }
}

export const useSearchStore = create((set, get) => ({
  isOpen: false,
  recentSearches: getInitialRecents(),

  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),

  addRecentSearch: (query) => {
    const cleaned = query.trim()
    if (!cleaned) return

    const current = get().recentSearches
    const filtered = current.filter(
      (item) => item.toLowerCase() !== cleaned.toLowerCase()
    )
    const updated = [cleaned, ...filtered].slice(0, 5)

    set({ recentSearches: updated })

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('Could not save recent search to localStorage', e)
    }
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] })
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch (e) {
      console.warn('Could not clear recent searches from localStorage', e)
    }
  },
}))
