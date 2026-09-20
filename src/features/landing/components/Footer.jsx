import { Link } from 'react-router-dom'
import { Logo } from '../../../shared/components/ui/Logo'
import { siteConfig } from '../../../docs'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40 py-12 text-sm text-fg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Logo />
          <p className="text-xs text-fg-muted mt-1">
            High-performance C++ HTTP Framework.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-medium">
          <Link to="/docs/introduction" className="hover:text-fg transition-colors">
            Docs
          </Link>
          <Link to="/docs/installation" className="hover:text-fg transition-colors">
            Installation
          </Link>
          <Link to="/docs/quick-start" className="hover:text-fg transition-colors">
            Quick Start
          </Link>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg transition-colors"
          >
            GitHub
          </a>
        </div>

        <div className="text-xs text-fg-muted/60 select-none text-center md:text-right">
          © {new Date().getFullYear()} {siteConfig.name} Framework. Open-source documentation shell.
        </div>
      </div>
    </footer>
  )
}
