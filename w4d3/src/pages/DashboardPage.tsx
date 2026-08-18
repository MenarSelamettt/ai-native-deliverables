import { useState } from 'react'
import { SummaryCard } from '../components/SummaryCard'
import { TransactionWorkspace } from '../components/TransactionWorkspace'
import { currentBalance, transactions } from '../data/transactions'
import { usePreferencesStore } from '../stores/usePreferencesStore'

export function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null)
  const category = usePreferencesStore((state) => state.category)

  // TODO: Replace this static Day 2 source with the transaction query and handle its UI states.
  const monthlyIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const monthlySpending = transactions
    .filter((transaction) => transaction.type === 'spending')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const categories = [...new Set(transactions.map((transaction) => transaction.category))]
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.merchant.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch)
    const matchesCategory = category === 'All' || transaction.category === category

    return matchesSearch && matchesCategory
  })
  const selectedTransaction = filteredTransactions.find(
    (transaction) => transaction.id === selectedTransactionId,
  )

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <p className="eyebrow">Monthly overview</p>
        <h1>Personal Spending Dashboard</h1>
        <p className="dashboard-intro">A clear view of where your money came from and went.</p>
      </header>

      <div className="dashboard-content">
        <section className="summary-grid" aria-label="Account summary">
          <SummaryCard label="Current balance" value={currentBalance} note="Available now" />
          <SummaryCard label="Monthly income" value={monthlyIncome} note="Received this month" tone="income" />
          <SummaryCard label="Monthly spending" value={monthlySpending} note="Spent this month" tone="spending" />
        </section>

        <TransactionWorkspace
          searchTerm={searchTerm}
          categories={categories}
          filteredTransactions={filteredTransactions}
          selectedTransactionId={selectedTransactionId}
          selectedTransaction={selectedTransaction}
          onSearchChange={setSearchTerm}
          onSelectTransaction={setSelectedTransactionId}
        />
      </div>
    </main>
  )
}
