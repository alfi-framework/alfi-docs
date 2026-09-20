import { describe, it, expect } from 'vitest'
import { siteConfig, GITHUB_URL, SPONSOR_URL } from '../docs/siteConfig'

describe('Site Configuration', () => {
  it('has valid site properties', () => {
    expect(siteConfig.name).toBe('Alfi')
    expect(siteConfig.githubUrl).toBe(GITHUB_URL)
    expect(siteConfig.sponsorUrl).toBe(SPONSOR_URL)
  })

  it('generates edit url correctly', () => {
    const editUrl = siteConfig.getEditUrl('introduction')
    expect(editUrl).toContain('introduction.md')
    expect(editUrl).toContain(GITHUB_URL)
  })
})
