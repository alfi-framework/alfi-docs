import React, { useState, useEffect } from 'react'
import { cn } from '../../../shared/utils/cn'

export function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // Give react-markdown a frame to render DOM nodes
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll('article h2[id], article h3[id]')
      )

      const items = elements.map((el) => ({
        id: el.id,
        text: el.innerText.replace('#', '').trim(),
        level: el.tagName.toLowerCase(),
      }))

      setHeadings(items)

      if (items.length === 0) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
      )

      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }, 50)

    return () => clearTimeout(timer)
  }, [content])

  if (headings.length === 0) return null

  return (
    <div className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24 pl-6 border-l border-border text-xs">
        <h4 className="font-semibold text-fg uppercase tracking-wider mb-3 select-none text-[11px]">
          On this page
        </h4>
        <nav aria-label="Table of contents">
          <ul className="space-y-2">
            {headings.map((heading) => {
              const isActive = activeId === heading.id
              return (
                <li
                  key={heading.id}
                  className={cn(heading.level === 'h3' && 'pl-3')}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      const target = document.getElementById(heading.id)
                      if (target) {
                        const top =
                          target.getBoundingClientRect().top +
                          window.scrollY -
                          90
                        window.scrollTo({ top, behavior: 'smooth' })
                        setActiveId(heading.id)
                      }
                    }}
                    className={cn(
                      'block py-0.5 truncate transition-colors duration-150',
                      isActive
                        ? 'text-brand-accent font-semibold'
                        : 'text-fg-muted hover:text-fg'
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
