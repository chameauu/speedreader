export function getFocusIndex(word: string) {
  const length = Array.from(word.matchAll(/[\p{L}\p{N}]/gu)).length

  if (length <= 1) return 0
  if (length <= 5) return 1
  if (length <= 9) return 2
  if (length <= 13) return 3
  return 4
}
