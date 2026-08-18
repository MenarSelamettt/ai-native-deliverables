import type { Transaction } from '../types/transaction'

type TransactionRowProps = {
  transaction: Transaction
  isSelected: boolean
  onSelect: (id: number) => void
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function TransactionRow({ transaction, isSelected, onSelect }: TransactionRowProps) {
  const amountPrefix = transaction.type === 'income' ? '+' : '-'

  return (
    <li>
      <button
        className={`transaction-row${isSelected ? ' selected' : ''}`}
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(transaction.id)}
      >
        <span className="transaction-main">
          <span className="transaction-merchant">{transaction.merchant}</span>
          <span className="transaction-meta">
            {transaction.category} · {transaction.date}
          </span>
        </span>
        <span>
          <span className={`transaction-amount ${transaction.type}`}>
            {amountPrefix}{currency.format(transaction.amount)}
          </span>
          <span className={`transaction-type ${transaction.type}`}>{transaction.type}</span>
        </span>
      </button>
    </li>
  )
}
