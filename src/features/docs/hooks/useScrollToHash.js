import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollToHash(dependency) {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash
    if (!hash) return

    const targetId = hash.replace('#', '')
    if (!targetId) return

    // Allow DOM to settle after markdown render
    const timer = setTimeout(() => {
      const element = document.getElementById(targetId)
      if (!element) return

      const top = element.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: 'smooth' })

      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (!prefersReduced) {
        element.classList.add('ring-2', 'ring-brand', 'ring-offset-4', 'rounded-md', 'transition-all', 'duration-300')
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-brand', 'ring-offset-4', 'rounded-md', 'transition-all', 'duration-300')
        }, 1800)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [location.hash, location.pathname, dependency])
}
