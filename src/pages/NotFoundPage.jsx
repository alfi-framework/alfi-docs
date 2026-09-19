import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../shared/components/ui/Navbar'
import { Button } from '../shared/components/ui/Button'
import { Footer } from '../features/landing/components/Footer'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand-accent flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-fg mb-3">
            404 — Page Not Found
          </h1>
          <p className="text-fg-muted text-sm leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button as={Link} to="/" variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Home</span>
            </Button>
            <Button as={Link} to="/docs/introduction" variant="primary">
              <span>Go to Docs</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
