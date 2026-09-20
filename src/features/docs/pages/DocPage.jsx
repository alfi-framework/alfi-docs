import { useParams, Navigate } from 'react-router-dom'
import { DocsLayout } from '../components/DocsLayout'
import { CustomMarkdown } from '../components/CustomMarkdown'
import { TableOfContents } from '../components/TableOfContents'
import { DocPagination } from '../components/DocPagination'
import { EditOnGithub } from '../components/EditOnGithub'
import { useScrollToHash } from '../hooks/useScrollToHash'

// Import markdown files eagerly via Vite glob map
const modules = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function DocPage() {
  const { slug } = useParams()
  const contentKey = `../content/${slug}.md`
  const markdownContent = modules[contentKey]

  useScrollToHash(markdownContent)

  if (!slug) {
    return <Navigate to="/docs/introduction" replace />
  }

  if (!markdownContent) {
    return (
      <DocsLayout>
        <div className="py-16 text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold text-fg mb-3">Topic Not Found</h1>
          <p className="text-fg-muted text-sm mb-6">
            The requested documentation page{' '}
            <code className="font-mono px-1.5 py-0.5 rounded bg-code-bg text-brand-accent border border-border">
              {slug}
            </code>{' '}
            could not be located.
          </p>
        </div>
      </DocsLayout>
    )
  }

  return (
    <DocsLayout>
      <div className="flex gap-8">
        <article className="flex-1 max-w-3xl min-w-0">
          <CustomMarkdown content={markdownContent} />
          <EditOnGithub slug={slug} />
          <DocPagination />
        </article>
        <TableOfContents content={markdownContent} />
      </div>
    </DocsLayout>
  )
}
