import type { Transaction } from '../types/transaction'

type SpendingInsightInput = {
  monthlyIncome: number
  monthlySpending: number
  transactions: Transaction[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function buildSpendingInsightPrompt({
  monthlyIncome,
  monthlySpending,
  transactions,
}: SpendingInsightInput) {
  const categoryTotals = new Map<string, number>()

  for (const transaction of transactions) {
    if (transaction.type === 'spending') {
      const currentTotal = categoryTotals.get(transaction.category) ?? 0
      categoryTotals.set(transaction.category, currentTotal + transaction.amount)
    }
  }

  const categories = [...categoryTotals.entries()]
    .map(([category, amount]) => `${category}: ${currencyFormatter.format(amount)}`)
    .join(', ')

  return [
    'Write one concise plain-text spending insight for this account.',
    `Monthly income: ${currencyFormatter.format(monthlyIncome)}.`,
    `Monthly spending: ${currencyFormatter.format(monthlySpending)}.`,
    `Spending by category: ${categories}.`,
  ].join(' ')
}
