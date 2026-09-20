import { cn } from '../../utils/cn'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variants = {
    primary:
      'bg-brand text-black font-semibold hover:bg-brand-300 shadow-sm shadow-brand/20 active:translate-y-px',
    secondary:
      'bg-surface hover:bg-surface-hover text-fg border border-border shadow-xs active:translate-y-px',
    outline:
      'border border-border text-fg hover:bg-surface-hover active:translate-y-px',
    ghost:
      'text-fg-muted hover:text-fg hover:bg-surface-hover',
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
