import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useThemeStore } from '../../../store/useThemeStore'
import { cn } from '../../utils/cn'

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useThemeStore()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const CurrentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <div className={cn('relative inline-block text-left', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-fg-muted hover:text-fg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        aria-label="Toggle theme menu"
        aria-expanded={open}
      >
        <CurrentIcon className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg bg-surface border border-border shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt) => {
            const Icon = opt.icon
            const isSelected = theme === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
                  isSelected
                    ? 'text-brand-accent bg-brand/10'
                    : 'text-fg-muted hover:text-fg hover:bg-surface-hover'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-accent" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
