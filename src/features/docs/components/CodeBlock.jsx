import React, { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import { codeToHtml } from 'shiki'

export function CodeBlock({ code, language = 'text' }) {
  const [copied, setCopied] = useState(false)
  const [highlightedHtml, setHighlightedHtml] = useState('')

  const cleanLang = (language || 'text')
    .toLowerCase()
    .replace('language-', '')
    .trim()

  const validLang = ['cpp', 'bash', 'cmake', 'json', 'sh', 'c++'].includes(cleanLang)
    ? cleanLang === 'c++'
      ? 'cpp'
      : cleanLang === 'sh'
      ? 'bash'
      : cleanLang
    : 'text'

  useEffect(() => {
    let isMounted = true

    async function highlight() {
      try {
        const html = await codeToHtml(code.trim(), {
          lang: validLang,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        })
        if (isMounted) {
          setHighlightedHtml(html)
        }
      } catch (err) {
        if (isMounted) {
          setHighlightedHtml('')
        }
      }
    }

    highlight()
    return () => {
      isMounted = false
    }
  }, [code, validLang])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  return (
    <div className="group relative my-5 rounded-xl border border-border bg-code-bg overflow-hidden shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/60 border-b border-border text-xs text-fg-muted font-mono select-none">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-brand-accent">
          {validLang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed">
        {highlightedHtml ? (
          <div
            className="[&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="text-fg font-mono m-0 p-0">
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
