export const GITHUB_URL = 'https://github.com/alfi-framework'
export const GITHUB_EDIT_BASE_URL = `${GITHUB_URL}/blob/main/src/features/docs/content`
export const SPONSOR_URL = 'https://buymeatea.online/abdulkadir'

export const siteConfig = {
  name: 'Alfi',
  title: 'Alfi — Ultra-Fast Async C++ HTTP Framework',
  description:
    'Ultra-fast, asynchronous C++ HTTP framework built with C++20 for high throughput, zero-allocation routing, and minimal footprint.',
  version: '0.1.0',
  previewBadge: 'v0.1 Developer Preview',
  githubUrl: GITHUB_URL,
  sponsorUrl: SPONSOR_URL,
  getEditUrl: (slug, folder) =>
    folder
      ? `${GITHUB_EDIT_BASE_URL}/${folder}/${slug}.md`
      : `${GITHUB_EDIT_BASE_URL}/${slug}.md`,
}
