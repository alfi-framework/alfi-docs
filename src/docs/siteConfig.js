export const GITHUB_URL = 'https://github.com/alfi-framework/alfi-docs'
export const GITHUB_EDIT_BASE_URL = `${GITHUB_URL}/blob/main/docs/content`

export const siteConfig = {
  name: 'Alfi',
  title: 'Alfi — Ultra-Fast Async C++ HTTP Framework',
  description:
    'Ultra-fast, asynchronous C++ HTTP framework built with C++20 for high throughput, zero-allocation routing, and minimal footprint.',
  version: '0.1.0',
  previewBadge: 'v0.1 Developer Preview',
  githubUrl: GITHUB_URL,
  getEditUrl: (slug) => `${GITHUB_EDIT_BASE_URL}/${slug}.md`,
}
