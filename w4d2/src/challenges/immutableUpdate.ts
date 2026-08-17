export type Item = {
  id: number
  reviewed: boolean
}

export function markAsReviewed(items: Item[], itemId: number) {
  return items.map((item) =>
    item.id === itemId ? { ...item, reviewed: true } : item,
  )
}
