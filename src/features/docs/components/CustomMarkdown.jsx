import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Link } from 'react-router-dom'
import { X, ZoomIn } from 'lucide-react'
import { CodeBlock } from './CodeBlock'

// Import all doc images eagerly via Vite glob map
const images = import.meta.glob('../content/images/**/*.{png,jpg,jpeg,webp,svg,gif}', {
  query: '?url',
  import: 'default',
  eager: true,
})

function resolveImageUrl(src) {
  if (!src) return src
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src
  }

  // Normalize relative paths: ../images/foo.webp, ./images/foo.webp, /images/foo.webp, images/foo.webp
  const cleanPath = src.replace(/^(\.\.\/|\.\/|\/)?(images\/)?/, '')
  const globKey = `../content/images/${cleanPath}`

  if (images[globKey]) {
    return images[globKey]
  }

  // Fallback to public path
  const base = import.meta.env.BASE_URL || '/'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  return `${cleanBase}images/${cleanPath}`
}

export function CustomMarkdown({ content }) {
  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveImage(null)
      }
    }

    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeImage])

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              properties: {
                className: [
                  'anchor-link',
                  'opacity-0',
                  'group-hover:opacity-100',
                  'transition-opacity',
                  'ml-2',
                  'inline-flex',
                  'items-center',
                  'text-brand-accent',
                  'no-underline',
                ],
              },
              content: {
                type: 'element',
                tagName: 'span',
                properties: { className: ['text-xs', 'font-mono'] },
                children: [{ type: 'text', value: '#' }],
              },
            },
          ],
        ]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg mb-6 pb-3 border-b border-border"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="group text-2xl font-bold tracking-tight text-fg mt-10 mb-4 flex items-center scroll-mt-24"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="group text-xl font-semibold tracking-tight text-fg mt-8 mb-3 flex items-center scroll-mt-24"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-lg font-semibold tracking-tight text-fg mt-6 mb-2"
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p className="text-fg-muted leading-relaxed my-4 text-base" {...props}>
              {children}
            </p>
          ),
          img: ({ src, alt, ...props }) => {
            const resolvedSrc = resolveImageUrl(src)
            return (
              <span className="relative group block my-6 select-none cursor-pointer">
                <img
                  src={resolvedSrc}
                  alt={alt || ''}
                  onClick={() => setActiveImage({ src: resolvedSrc, alt: alt || '' })}
                  className="rounded-xl border-2 border-slate-400/80 dark:border-purple-500/50 shadow-md hover:shadow-xl max-w-full h-auto cursor-zoom-in transition-all duration-200 hover:border-brand-accent/80 active:scale-[0.99]"
                  loading="lazy"
                  {...props}
                />
                <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5 shadow-md">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Tap to expand</span>
                </span>
              </span>
            )
          },
          a: ({ href, children, ...props }) => {
            if (href && href.startsWith('/')) {
              return (
                <Link
                  to={href}
                  className="text-brand-accent font-medium hover:underline decoration-brand-accent/50 underline-offset-2 transition-colors"
                  {...props}
                >
                  {children}
                </Link>
              )
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent font-medium hover:underline decoration-brand-accent/50 underline-offset-2 transition-colors"
                {...props}
              >
                {children}
              </a>
            )
          },
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')

            if (!inline && (match || codeString.includes('\n'))) {
              return <CodeBlock code={codeString} language={match ? match[1] : 'text'} />
            }

            return (
              <code
                className="font-mono text-xs px-1.5 py-0.5 rounded bg-code-bg text-brand-accent border border-border"
                {...props}
              >
                {children}
              </code>
            )
          },
          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
              <table className="w-full text-left text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-surface-hover/80 text-fg font-semibold border-b border-border" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-border bg-surface text-fg-muted" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-surface-hover/50 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-3 font-semibold text-fg" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 text-fg-muted" {...props}>
              {children}
            </td>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-5 border-l-4 border-brand-accent bg-brand/5 px-4 py-3 rounded-r-lg text-fg-muted text-sm leading-relaxed"
              {...props}
            >
              {children}
            </blockquote>
          ),
          ul: ({ children, ...props }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-fg-muted" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-fg-muted" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Lightbox Image Preview Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview modal"
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
            aria-label="Close image modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-w-full max-h-[82vh] w-auto h-auto rounded-xl border-2 border-brand-accent/60 shadow-2xl object-contain bg-black/40"
            />
            {activeImage.alt && (
              <p className="mt-3 text-center text-xs sm:text-sm font-medium text-white/90 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xs max-w-lg truncate">
                {activeImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
