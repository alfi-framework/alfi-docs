export const navigation = [
  {
    group: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'introduction', path: '/docs/introduction' },
      { title: 'Installation', slug: 'installation', path: '/docs/installation' },
      { title: 'Quick Start', slug: 'quick-start', path: '/docs/quick-start' },
    ],
  },
  {
    group: 'Core Concepts',
    items: [
      { title: 'Routing', slug: 'routing', path: '/docs/routing' },
      { title: 'Route & Query Params', slug: 'route-query-params', path: '/docs/route-query-params' },
      { title: 'Requests & Responses', slug: 'requests-responses', path: '/docs/requests-responses' },
      { title: 'Headers & Status Codes', slug: 'headers-status-codes', path: '/docs/headers-status-codes' },
      { title: 'Request Body & JSON', slug: 'request-body-json', path: '/docs/request-body-json' },
    ],
  },
  {
    group: 'Advanced',
    items: [
      { title: 'Error Handling', slug: 'error-handling', path: '/docs/error-handling' },
      { title: 'Configuration', slug: 'configuration', path: '/docs/configuration' },
      { title: 'Concurrency', slug: 'concurrency', path: '/docs/concurrency' },
      { title: 'Graceful Shutdown', slug: 'graceful-shutdown', path: '/docs/graceful-shutdown' },
    ],
  },
  {
    group: 'Tooling',
    items: [
      { title: 'CLI', slug: 'cli', path: '/docs/cli' },
      { title: 'OpenAPI / Swagger', slug: 'openapi-swagger', path: '/docs/openapi-swagger' },
    ],
  },
  {
    group: 'Extensions',
    items: [
      { title: 'Database Integration', slug: 'database', path: '#', disabled: true, badge: 'Soon' },
    ],
  },
]

// Flattened list of active docs for next/prev pagination
export const flatNavigation = navigation
  .flatMap((cat) => cat.items)
  .filter((item) => !item.disabled)
