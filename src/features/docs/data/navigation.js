export const navigation = [
  {
    group: 'Getting Started',
    folder: 'getting-started',
    items: [
      {
        title: 'Introduction',
        slug: 'introduction',
        path: '/docs/introduction',
        folder: 'getting-started',
        keywords: ['intro', 'overview', 'getting started', 'basics', 'architecture', 'c++20'],
      },
      {
        title: 'Installation',
        slug: 'installation',
        path: '/docs/installation',
        folder: 'getting-started',
        keywords: ['cmake', 'fetchcontent', 'vcpkg', 'conan', 'build', 'setup', 'install', 'compiler'],
      },
      {
        title: 'Quick Start',
        slug: 'quick-start',
        path: '/docs/quick-start',
        folder: 'getting-started',
        keywords: ['starter', 'hello world', 'example', 'run', 'main', 'launch'],
      },
    ],
  },
  {
    group: 'Core Concepts',
    folder: 'core-concepts',
    items: [
      {
        title: 'Routing',
        slug: 'routing',
        path: '/docs/routing',
        folder: 'core-concepts',
        keywords: ['router', 'endpoint', 'path', 'params', 'match', 'url', 'trie', 'routegroup'],
      },
      {
        title: 'Route & Query Params',
        slug: 'route-query-params',
        path: '/docs/route-query-params',
        folder: 'core-concepts',
        keywords: ['query', 'url', 'parameters', 'extract', 'bind', 'searchparams'],
      },
      {
        title: 'Requests & Responses',
        slug: 'requests-responses',
        path: '/docs/requests-responses',
        folder: 'core-concepts',
        keywords: ['request', 'response', 'payload', 'context', 'json', 'body', 'req', 'res'],
      },
      {
        title: 'Headers & Status Codes',
        slug: 'headers-status-codes',
        path: '/docs/headers-status-codes',
        folder: 'core-concepts',
        keywords: ['headers', 'status', 'http', 'codes', 'metadata', 'content-type', 'auth'],
      },
      {
        title: 'Request Body & JSON',
        slug: 'request-body-json',
        path: '/docs/request-body-json',
        folder: 'core-concepts',
        keywords: ['body', 'json', 'parse', 'payload', 'serialize', 'struct', 'extract'],
      },
    ],
  },
  {
    group: 'Advanced',
    folder: 'advanced',
    items: [
      {
        title: 'Error Handling',
        slug: 'error-handling',
        path: '/docs/error-handling',
        folder: 'advanced',
        keywords: ['exception', 'handler', 'try', 'catch', 'middleware', 'error', 'fault'],
      },
      {
        title: 'Configuration',
        slug: 'configuration',
        path: '/docs/configuration',
        folder: 'advanced',
        keywords: ['config', 'settings', 'options', 'env', 'threads', 'port', 'timeout'],
      },
      {
        title: 'Concurrency',
        slug: 'concurrency',
        path: '/docs/concurrency',
        folder: 'advanced',
        keywords: ['async', 'threads', 'coroutine', 'multithreading', 'concurrency', 'event loop'],
      },
      {
        title: 'Graceful Shutdown',
        slug: 'graceful-shutdown',
        path: '/docs/graceful-shutdown',
        folder: 'advanced',
        keywords: ['shutdown', 'sigterm', 'sigint', 'drain', 'stop', 'terminate', 'exit'],
      },
    ],
  },
  {
    group: 'Tooling',
    folder: 'tooling',
    items: [
      {
        title: 'CLI',
        slug: 'cli',
        path: '/docs/cli',
        folder: 'tooling',
        keywords: ['command', 'terminal', 'generator', 'scaffold', 'cli', 'tooling'],
      },
      {
        title: 'OpenAPI / Swagger',
        slug: 'openapi-swagger',
        path: '/docs/openapi-swagger',
        folder: 'tooling',
        keywords: ['swagger', 'openapi', 'spec', 'api', 'schema', 'documentation', 'json'],
      },
    ],
  },
  {
    group: 'Extensions',
    folder: 'extensions',
    items: [
      {
        title: 'Database Integration',
        slug: 'database',
        path: '#',
        folder: 'extensions',
        disabled: true,
        badge: 'Soon',
        keywords: ['database', 'sql', 'orm', 'db', 'sqlite', 'postgres'],
      },
    ],
  },
]

// Flattened list of active docs for next/prev pagination
export const flatNavigation = navigation
  .flatMap((cat) => cat.items.map((item) => ({ ...item, folder: cat.folder })))
  .filter((item) => !item.disabled)

