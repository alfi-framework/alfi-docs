import { Edit3 } from 'lucide-react'
import { siteConfig } from '../../../docs'

export function EditOnGithub({ slug, folder }) {
  const githubEditUrl = siteConfig.getEditUrl(slug, folder)

  return (
    <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-fg-muted">
      <a
        href={githubEditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-brand-accent transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Edit this page on GitHub</span>
      </a>
      <span className="text-[11px] text-fg-muted/60">
        Last updated: {new Date().toLocaleDateString()}
      </span>
    </div>
  )
}
