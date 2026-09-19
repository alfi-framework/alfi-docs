export const navigation = [
  {
    group: 'Getting Started',
    items: [
      {
        title: 'Introduction',
        slug: 'introduction',
        path: '/docs/introduction',
        keywords: ['intro', 'overview', 'getting started', 'basics', 'architecture', 'c++20'],
      },
      {
        title: 'Installation',
        slug: 'installation',
        path: '/docs/installation',
        keywords: ['cmake', 'fetchcontent', 'vcpkg', 'conan', 'build', 'setup', 'install', 'compiler'],
      },
      {
        title: 'Quick Start',
        slug: 'quick-start',
        path: '/docs/quick-start',
        keywords: ['starter', 'hello world', 'example', 'run', 'main', 'launch'],
      },
    ],
  },
  {
    group: 'Core Concepts',
    items: [
      {
        title: 'Routing',
        slug: 'routing',
        path: '/docs/routing',
        keywords: ['router', 'endpoint', 'path', 'params', 'match', 'url', 'trie', 'routegroup'],
      },
      {
        title: 'Route & Query Params',
        slug: 'route-query-params',
        path: '/docs/route-query-params',
        keywords: ['query', 'url', 'parameters', 'extract', 'bind', 'searchparams'],
      },
      {
        title: 'Requests & Responses',
        slug: 'requests-responses',
        path: '/docs/requests-responses',
        keywords: ['request', 'response', 'payload', 'context', 'json', 'body', 'req', 'res'],
      },
      {
        title: 'Headers & Status Codes',
        slug: 'headers-status-codes',
        path: '/docs/headers-status-codes',
        keywords: ['headers', 'status', 'http', 'codes', 'metadata', 'content-type', 'auth'],
      },
      {
        title: 'Request Body & JSON',
        slug: 'request-body-json',
        path: '/docs/request-body-json',
        keywords: ['body', 'json', 'parse', 'payload', 'serialize', 'struct', 'extract'],
      },
    ],
  },
  {
    group: 'Advanced',
    items: [
      {
        title: 'Error Handling',
        slug: 'error-handling',
        path: '/docs/error-handling',
        keywords: ['exception', 'handler', 'try', 'catch', 'middleware', 'error', 'fault'],
      },
      {
        title: 'Configuration',
        slug: 'configuration',
        path: '/docs/configuration',
        keywords: ['config', 'settings', 'options', 'env', 'threads', 'port', 'timeout'],
      },
      {
        title: 'Concurrency',
        slug: 'concurrency',
        path: '/docs/concurrency',
        keywords: ['async', 'threads', 'coroutine', 'multithreading', 'concurrency', 'event loop'],
      },
      {
        title: 'Graceful Shutdown',
        slug: 'graceful-shutdown',
        path: '/docs/graceful-shutdown',
        keywords: ['shutdown', 'sigterm', 'sigint', 'drain', 'stop', 'terminate', 'exit'],
      },
    ],
  },
  {
    group: 'Tooling',
    items: [
      {
        title: 'CLI',
        slug: 'cli',
        path: '/docs/cli',
        keywords: ['command', 'terminal', 'generator', 'scaffold', 'cli', 'tooling'],
      },
      {
        title: 'OpenAPI / Swagger',
        slug: 'openapi-swagger',
        path: '/docs/openapi-swagger',
        keywords: ['swagger', 'openapi', 'spec', 'api', 'schema', 'documentation', 'json'],
      },
    ],
  },
  {
    group: 'Extensions',
    items: [
      {
        title: 'Database Integration',
        slug: 'database',
        path: '#',
        disabled: true,
        badge: 'Soon',
        keywords: ['database', 'sql', 'orm', 'db', 'sqlite', 'postgres'],
      },
    ],
  },
]

// Flattened list of active docs for next/prev pagination
export const flatNavigation = navigation
  .flatMap((cat) => cat.items)
  .filter((item) => !item.disabled)
