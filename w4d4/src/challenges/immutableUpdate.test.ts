import { describe, expect, it } from 'vitest'
import { markAsReviewed, type Item } from './immutableUpdate'

describe('markAsReviewed', () => {
  it('updates the matching item without mutating the input', () => {
    const items: Item[] = [
      { id: 1, reviewed: false },
      { id: 2, reviewed: false },
    ]

    const result = markAsReviewed(items, 2)

    expect(result).not.toBe(items)
    expect(result[1]).not.toBe(items[1])
    expect(result[0]).toBe(items[0])
    expect(result[1].reviewed).toBe(true)
    expect(items[1].reviewed).toBe(false)
  })
})
