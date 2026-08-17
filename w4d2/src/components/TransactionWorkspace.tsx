import type { Transaction } from '../types/transaction'
import { TransactionDetails } from './TransactionDetails'
import { TransactionFilters } from './TransactionFilters'
import { TransactionRow } from './TransactionRow'
import { TransactionStatus } from './TransactionStatus'

type TransactionWorkspaceProps = {
  searchTerm: string
  category: string
  categories: string[]
  filteredTransactions: Transaction[]
  selectedTransactionId: number | null
  selectedTransaction?: Transaction
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSelectTransaction: (id: number) => void
}

export function TransactionWorkspace({
  searchTerm,
  category,
  categories,
  filteredTransactions,
  selectedTransactionId,
  selectedTransaction,
  onSearchChange,
  onCategoryChange,
  onSelectTransaction,
}: TransactionWorkspaceProps) {
  const visibleCount = filteredTransactions.length

  return (
    <>
      <TransactionFilters
        searchTerm={searchTerm}
        category={category}
        categories={categories}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
      />

      <div className="content-grid">
        <section className="transaction-panel">
          <div className="section-heading">
            <h2 className="section-title">Transactions</h2>
            <TransactionStatus visibleCount={visibleCount} category={category} />
          </div>

          {visibleCount === 0 ? (
            <p className="empty-state">No transactions match your filters.</p>
          ) : (
            <ul className="transaction-list">
              {filteredTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={transaction.id === selectedTransactionId}
                  onSelect={onSelectTransaction}
                />
              ))}
            </ul>
          )}
        </section>

        <TransactionDetails transaction={selectedTransaction} />
      </div>
    </>
  )
}
