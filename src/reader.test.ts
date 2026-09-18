import { describe, expect, it } from 'vitest'
import { getFocusIndex } from './reader'

describe('getFocusIndex', () => {
  it.each([
    ['I', 0],
    ['read', 1],
    ['easier', 2],
    ['recognition', 3],
    ['internationalization', 4],
  ])('places the focus point for %s at index %i', (word, expectedIndex) => {
    expect(getFocusIndex(word)).toBe(expectedIndex)
  })

  it('ignores punctuation when choosing the focus point', () => {
    expect(getFocusIndex('still.')).toBe(1)
  })

  it('supports Unicode letters', () => {
    expect(getFocusIndex('éclair')).toBe(2)
  })
})
