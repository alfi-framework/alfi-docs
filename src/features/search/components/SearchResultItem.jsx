import { FileText, Hash, Code2 } from 'lucide-react'
import { getHighlightedChunks } from '../services/searchService'
import { cn } from '../../../shared/utils/cn'

export function SearchResultItem({
  item,
  query,
  isActive,
  onSelect,
  onMouseEnter,
  id,
}) {
  const isPage = item.type === 'page'
  const textContent = isPage ? item.text : item.text || item.code
  const highlightedChunks = getHighlightedChunks(textContent, query, 110)
  const isCode = !isPage && Boolean(item.code && !item.text)

  return (
    <div
      id={id}
      role="option"
      aria-selected={isActive}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        'group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-150 border border-transparent',
        isActive
          ? 'bg-brand/10 border-brand/20 text-fg'
          : 'hover:bg-surface-hover text-fg-muted hover:text-fg'
      )}
    >
      {/* Icon */}
      <div className={cn(
        'p-2 rounded-lg shrink-0 mt-0.5 transition-colors',
        isActive ? 'bg-brand/20 text-brand-accent' : 'bg-surface-hover text-fg-muted'
      )}>
        {isPage ? (
          <FileText className="w-4 h-4" />
        ) : isCode ? (
          <Code2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Hash className="w-4 h-4 text-brand-accent" />
        )}
      </div>

      {/* Content Details */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="text-[11px] font-medium text-fg-muted/80 flex items-center gap-1.5 mb-0.5">
          <span>{item.group}</span>
          <span>›</span>
          <span className="font-semibold text-fg-muted">{item.pageTitle}</span>
        </div>

        {/* Heading / Title */}
        <div className="text-sm font-semibold text-fg tracking-tight truncate">
          {isPage ? item.title : item.heading}
        </div>

        {/* Snippet highlighting */}
        {highlightedChunks.length > 0 && (
          <div className="text-xs text-fg-muted mt-1 leading-relaxed line-clamp-2">
            {highlightedChunks.map((chunk, idx) =>
              chunk.isMatch ? (
                <mark
                  key={idx}
                  className="bg-brand/25 text-fg font-medium rounded-xs px-0.5 py-0"
                >
                  {chunk.text}
                </mark>
              ) : (
                <span key={idx}>{chunk.text}</span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
