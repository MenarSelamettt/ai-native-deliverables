type TransactionStatusProps = {
  visibleCount: number
  category: string
}

export function TransactionStatus({ visibleCount, category }: TransactionStatusProps) {
  const transactionLabel = `${visibleCount} ${visibleCount === 1 ? 'transaction' : 'transactions'}`
  const statusLabel = category === 'All' ? transactionLabel : `${category} · ${transactionLabel}`

  return <span className="count-badge">{statusLabel}</span>
}
