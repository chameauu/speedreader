import { describe, expect, it } from 'vitest'
import { getFocusIndex, getWordDelayMs, tokenizeText } from './reader'

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

describe('tokenizeText', () => {
  it('splits plain text into words and keeps punctuation attached', () => {
    expect(tokenizeText('Hello, world!')).toEqual(['Hello,', 'world!'])
  })

  it('ignores extra whitespace and line breaks', () => {
    expect(tokenizeText('  one\n\n two\tthree  ')).toEqual([
      'one',
      'two',
      'three',
    ])
  })

  it('returns an empty array for empty or whitespace-only input', () => {
    expect(tokenizeText('')).toEqual([])
    expect(tokenizeText('   \n  ')).toEqual([])
  })
})

describe('getWordDelayMs', () => {
  it('returns the base delay for neutral words', () => {
    expect(getWordDelayMs('reading', 300)).toBe(200)
  })

  it('adds extra delay for commas, semicolons, and colons', () => {
    const base = getWordDelayMs('word', 300)
    expect(getWordDelayMs('word,', 300)).toBeGreaterThan(base)
    expect(getWordDelayMs('word;', 300)).toBeGreaterThan(base)
    expect(getWordDelayMs('word:', 300)).toBeGreaterThan(base)
  })

  it('adds more delay for sentence-ending punctuation', () => {
    const mid = getWordDelayMs('word,', 300)
    expect(getWordDelayMs('word.', 300)).toBeGreaterThan(mid)
    expect(getWordDelayMs('word!', 300)).toBeGreaterThan(mid)
    expect(getWordDelayMs('word?', 300)).toBeGreaterThan(mid)
  })

  it('adds a small delay for unusually long words', () => {
    const base = getWordDelayMs('short', 300)
    expect(getWordDelayMs('characterization', 300)).toBeGreaterThan(base)
  })
})
