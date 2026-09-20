import { cn } from '../../utils/cn'

export function Logo({ className = '', showWordmark = true, ...props }) {
  return (
    <div
      className={cn('inline-flex items-center gap-2.5 font-bold tracking-tight select-none', className)}
      {...props}
    >
      {/* Inline SVG Mark */}
      <svg
        className="h-7 w-7 flex-shrink-0"
        viewBox="0 0 1240 1240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Purple wave logo with sparkle"
      >
        <title>Wave and sparkle logo</title>
        <path
          d="M98 692c-2-4 2-16 6-30 56-192 256-445 486-445 200 0 325 143 372 268 43 135 53 315 100 435 28 70 63 110 96 136 2 4-3 7-13 5-55-11-145-23-240-21-105 2-215 12-309 23-8 1-10-1-4-4 128-59 238-149 266-319 20-110 8-210-32-291 36 81 32 241-26 383 30-102 20-192-30-267-55-80-150-135-265-135-155 0-290 115-397 262-5 6-9 4-10 0m887-561c17 74 55 114 127 126-72 15-110 58-127 132-17-74-55-114-124-125 69-14 107-59 124-133"
          fill="#b085fa"
        />
      </svg>

      {/* Wordmark and Version Badge */}
      {showWordmark && (
        <div className="inline-flex items-center gap-1.5">
          <svg
            className="h-6 w-auto flex-shrink-0"
            viewBox="0 0 401 202"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Alfi logo"
          >
            <title>Alfi logo</title>
            <g fill="#b085fa">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5 123.5a64 59 0 1 0 128 0 64 59 0 1 0-128 0m34-.5a30.5 30.5 0 1 0 61 0 30.5 30.5 0 1 0-61 0"
              />
              <rect x="113.5" y="67" width="34" height="113" rx="9" />
              <rect x="167" y="22" width="33" height="157" rx="9" />
              <path d="M226 61c0-16.5 22.5-40 39-40h24a9 9 0 0 1 9 9v8a9 9 0 0 1-9 9h-10a19 19 0 0 0-19 19v4h22a9 9 0 0 1 9 9v10a9 9 0 0 1-9 9h-22v72a9 9 0 0 1-9 9h-16a9 9 0 0 1-9-9Z" />
              <circle cx="337" cy="42.5" r="20.5" />
              <rect x="320" y="69" width="34" height="110" rx="9" />
            </g>
          </svg>

          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand/15 text-brand-accent border border-brand/30 align-middle">
            v0.1
          </span>
        </div>
      )}
    </div>
  )
}