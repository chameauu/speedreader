export function getFocusIndex(word: string) {
  const length = Array.from(word.matchAll(/[\p{L}\p{N}]/gu)).length

  if (length <= 1) return 0
  if (length <= 5) return 1
  if (length <= 9) return 2
  if (length <= 13) return 3
  return 4
}

export function tokenizeText(text: string): string[] {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

export function getWordDelayMs(word: string, wordsPerMinute: number): number {
  const safeWpm = Math.min(1000, Math.max(100, wordsPerMinute))
  const baseDelay = 60000 / safeWpm
  const trimmed = word.trim()

  let delay = baseDelay

  if (/[,:;]$/.test(trimmed)) {
    delay += baseDelay * 0.5
  }

  if (/[.!?]$/.test(trimmed)) {
    delay += baseDelay * 1
  }

  const letterCount = Array.from(trimmed.matchAll(/[\p{L}\p{N}]/gu)).length
  if (letterCount >= 12) {
    delay += baseDelay * 0.15
  }

  return Math.round(delay)
}
