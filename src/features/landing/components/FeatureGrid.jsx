import React from 'react'
import { Cpu, Zap, Route, ShieldCheck, Layers, Feather } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Modern C++20 Core',
    description:
      'Leverages modern concepts and standard facilities for compile-time safety and expressive syntax.',
  },
  {
    icon: Zap,
    title: 'Async Execution Engine',
    description:
      'Non-blocking I/O event dispatcher designed to sustain maximum request throughput under concurrency.',
  },
  {
    icon: Route,
    title: 'Zero-Allocation Routing',
    description:
      'Trie-based path matching minimizes heap allocations during route parameters extraction.',
  },
  {
    icon: ShieldCheck,
    title: 'Type-Safe Extractors',
    description:
      'Safely deserialize query parameters, headers, and JSON bodies directly into C++ objects.',
  },
  {
    icon: Layers,
    title: 'HTTP/1.1 & HTTP/2 Ready',
    description:
      'Multi-protocol framing pipeline with automatic connection management and multiplexing.',
  },
  {
    icon: Feather,
    title: 'Lightweight Footprint',
    description:
      'Minimal background memory consumption for compact, low-overhead microservice binaries.',
  },
]

export function FeatureGrid() {
  return (
    <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
          Engineered for Performance & DX
        </h2>
        <p className="mt-3 text-fg-muted max-w-xl mx-auto text-sm sm:text-base">
          Built for C++ developers who demand uncompromised performance and modern developer ergonomics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon
          return (
            <div
              key={feat.title}
              className="p-6 rounded-2xl border border-border bg-surface hover:border-brand/40 hover:bg-surface-hover transition-all duration-200 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand-accent flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-fg mb-2">{feat.title}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                {feat.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
