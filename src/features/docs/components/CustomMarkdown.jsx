import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Link } from 'react-router-dom'
import { CodeBlock } from './CodeBlock'

export function CustomMarkdown({ content }) {
  return (
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
        code: ({ node, inline, className, children, ...props }) => {
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
  )
}
