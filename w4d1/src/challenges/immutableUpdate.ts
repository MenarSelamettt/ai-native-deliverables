type Item = {
  id: number
  reviewed: boolean
}

export function markAsReviewed(items: Item[], itemId: number) {
  const item = items.find((candidate) => candidate.id === itemId)

  if (item) {
    item.reviewed = true
  }

  return items
}
