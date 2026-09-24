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
        title: 'Project Structure',
        slug: 'project-structure',
        path: '/docs/project-structure',
        folder: 'core-concepts',
        keywords: ['project', 'structure', 'folders', 'files', 'directory', 'organization'],
      },

      {
        title: 'Application',
        slug: 'application',
        path: '/docs/application',
        folder: 'core-concepts',
        keywords: ['app', 'application', 'server', 'instance', 'create', 'configuration'],
      },

      {
        title: 'Routing',
        slug: 'routing',
        path: '/docs/routing',
        folder: 'core-concepts',
        keywords: ['router', 'route', 'endpoint', 'path', 'url', 'methods', 'routegroup'],
      },

      {
        title: 'Requests',
        slug: 'requests',
        path: '/docs/requests',
        folder: 'core-concepts',
        keywords: ['request', 'req', 'headers', 'body', 'query', 'params', 'http'],
      },

      {
        title: 'Responses',
        slug: 'responses',
        path: '/docs/responses',
        folder: 'core-concepts',
        keywords: ['response', 'res', 'json', 'status', 'headers', 'payload', 'http'],
      },

      {
        title: 'HTTP Methods',
        slug: 'http-methods',
        path: '/docs/http-methods',
        folder: 'core-concepts',
        keywords: ['http', 'methods', 'get', 'post', 'put', 'patch', 'delete', 'crud'],
      },

      {
        title: 'JSON Responses',
        slug: 'json-responses',
        path: '/docs/json-responses',
        folder: 'core-concepts',
        keywords: ['json', 'response', 'payload', 'serialize', 'object', 'api'],
      },

    ],
  },
  {
    group: 'Middleware',
    folder: 'middleware',
    items: [
      {
        title: 'Introduction',
        slug: 'introduction-middleware',
        path: '/docs/introduction-middleware',
        folder: 'middleware',
        keywords: [
          'middleware',
          'request pipeline',
          'pipeline',
          'hooks',
          'http',
          'request',
          'response',
        ],
      },

      {
        title: 'Creating Middleware',
        slug: 'creating-middleware',
        path: '/docs/creating-middleware',
        folder: 'middleware',
        keywords: [
          'middleware',
          'create',
          'custom',
          'function',
          'handler',
          'next',
          'request',
          'response',
        ],
      },

      {
        title: 'Request Middleware',
        slug: 'request-middleware',
        path: '/docs/request-middleware',
        folder: 'middleware',
        keywords: [
          'request',
          'middleware',
          'before',
          'pre',
          'headers',
          'authentication',
          'validation',
        ],
      },

      {
        title: 'Response Middleware',
        slug: 'response-middleware',
        path: '/docs/response-middleware',
        folder: 'middleware',
        keywords: [
          'response',
          'middleware',
          'after',
          'post',
          'headers',
          'logging',
          'status',
        ],
      },

      {
        title: 'Middleware Order',
        slug: 'middleware-order',
        path: '/docs/middleware-order',
        folder: 'middleware',
        keywords: [
          'middleware',
          'order',
          'execution',
          'chain',
          'pipeline',
          'sequence',
          'next',
        ],
      },

      {
        title: 'Built-in Middleware',
        slug: 'built-in-middleware',
        path: '/docs/built-in-middleware',
        folder: 'middleware',
        keywords: [
          'middleware',
          'built-in',
          'cors',
          'logging',
          'security',
          'static',
          'prebuilt',
        ],
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

