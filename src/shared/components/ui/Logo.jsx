import React from 'react'
import { cn } from '../../utils/cn'

export function Logo({ className = '', showWordmark = true, ...props }) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 font-bold tracking-tight select-none', className)} {...props}>
      {/* Inline SVG Mark - Swappable mark */}
      <svg
        className="h-7 w-7 flex-shrink-0"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Main shape rendered with current text color (light ink in light mode, white in dark mode) */}
        <path
          d="M16 4L26 24H21.5L18.8 19.2H13.2L10.5 24H6L16 4Z"
          fill="currentColor"
        />
        <path
          d="M14.5 15.5H17.5L16 12L14.5 15.5Z"
          fill="var(--bg)"
        />
        {/* Accent dot/indicator fixed to primary accent color #da93ff */}
        <circle cx="23" cy="8" r="3" fill="#da93ff" />
      </svg>

      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-fg">
          Alfi
          <span className="ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded bg-brand/15 text-brand-accent border border-brand/30 align-middle">
            v0.1
          </span>
        </span>
      )}
    </div>
  )
}
