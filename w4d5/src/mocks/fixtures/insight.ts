// This fixture belongs to the mock HTTP server. Application code must not import it.
export const spendingInsightChunks = [
  'Your highest spending category is Housing',
  ', at $1,125.00 this month.',
  ' Income exceeds spending by $3,555.73,',
  ' which gives you room to review',
  ' recurring costs before next month.',
] as const

export const completeSpendingInsight = spendingInsightChunks.join('')
export const insightChunkDelayMs = 180
