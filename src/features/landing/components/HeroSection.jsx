import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { siteConfig } from '../../../docs'

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-12 md:pt-20 md:pb-20 overflow-hidden">
      {/* Ambient glow - active in dark mode only for clean light mode aesthetic */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-brand/15 blur-[130px] rounded-full hidden dark:block"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand-accent text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{siteConfig.previewBadge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-fg leading-[1.12]">
          Ultra-Fast Async{' '}
          <span className="text-brand-accent dark:bg-gradient-to-r dark:from-brand dark:via-brand-300 dark:to-brand-accent dark:bg-clip-text dark:text-transparent">
            C++ HTTP Framework
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-fg-muted max-w-2xl mx-auto leading-relaxed">
          Engineered for maximum throughput, zero-allocation routing, and modern C++20 ergonomics. Build resilient web services with minimal overhead.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            as={Link}
            to="/docs/introduction"
            size="lg"
            variant="primary"
            className="w-full sm:w-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            as="a"
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <GithubIcon className="w-4 h-4 mr-1" />
            <span>Star on GitHub</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
