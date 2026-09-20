import { cn } from '../../utils/cn'

export function Badge({
  children,
  variant = 'brand',
  className = '',
  ...props
}) {
  const variants = {
    brand: 'bg-brand/15 text-brand-accent border-brand/30',
    neutral: 'bg-surface-hover text-fg-muted border-border',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border leading-tight select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
