import { describe, it, expect } from 'vitest'
import { navigation, flatNavigation } from '../features/docs/data/navigation'

describe('Navigation Data Structure', () => {
  it('contains valid navigation groups', () => {
    expect(Array.isArray(navigation)).toBe(true)
    expect(navigation.length).toBeGreaterThan(0)
    navigation.forEach((group) => {
      expect(group).toHaveProperty('group')
      expect(group).toHaveProperty('items')
      expect(Array.isArray(group.items)).toBe(true)
    })
  })

  it('flatNavigation extracts all items with valid slugs and paths', () => {
    expect(Array.isArray(flatNavigation)).toBe(true)
    expect(flatNavigation.length).toBeGreaterThan(0)
    flatNavigation.forEach((item) => {
      expect(item.slug).toBeDefined()
      expect(item.path).toContain('/docs/')
      expect(item.title).toBeTruthy()
    })
  })
})
