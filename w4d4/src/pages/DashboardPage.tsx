import { useState } from 'react'
import { SpendingInsight } from '../components/SpendingInsight'
import { SummaryCard } from '../components/SummaryCard'
import { TransactionWorkspace } from '../components/TransactionWorkspace'
import { currentBalance } from '../data/account'
import { useLogoutMutation } from '../hooks/useLogoutMutation'
import { useSessionQuery } from '../hooks/useSessionQuery'
import { useTransactionsQuery } from '../hooks/useTransactionsQuery'
import { usePreferencesStore } from '../stores/usePreferencesStore'

export function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null)
  const category = usePreferencesStore((state) => state.category)
  const sessionQuery = useSessionQuery()
  const transactionQuery = useTransactionsQuery()
  const logoutMutation = useLogoutMutation()

  const user = sessionQuery.data

  if (!user) {
    return null
  }

  const dashboardHeader = (
    <header className="dashboard-header">
      <div className="dashboard-header-row">
        <div>
          <p className="eyebrow">Monthly overview</p>
          <h1>Personal Spending Dashboard</h1>
          <p className="dashboard-intro">A clear view of where your money came from and went.</p>
        </div>
        <div className="session-summary">
          <span>
            <span className="session-name">{user.name}</span>
            <span className="session-email">{user.email}</span>
          </span>
          <button
            className="secondary-button"
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </header>
  )

  if (transactionQuery.isPending) {
    return (
      <main className="dashboard-shell">
        {dashboardHeader}
        <section className="async-state" role="status">
          <h2 className="async-title">Loading transactions...</h2>
          <p className="async-message">Retrieving your account activity from the server.</p>
        </section>
      </main>
    )
  }

  if (transactionQuery.isError) {
    return (
      <main className="dashboard-shell">
        {dashboardHeader}
        <section className="async-state" role="alert">
          <h2 className="async-title">We couldn't load your transactions</h2>
          <p className="async-message">{transactionQuery.error.message}</p>
          <button className="retry-button" type="button" onClick={() => void transactionQuery.refetch()}>
            Try again
          </button>
        </section>
      </main>
    )
  }

  const transactions = transactionQuery.data

  if (transactions.length === 0) {
    return (
      <main className="dashboard-shell">
        {dashboardHeader}
        <section className="async-state">
          <h2 className="async-title">No transactions yet</h2>
          <p className="async-message">Your account does not have any transaction activity to show.</p>
        </section>
      </main>
    )
  }

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
      {dashboardHeader}

      <div className="dashboard-content">
        <section className="summary-grid" aria-label="Account summary">
          <SummaryCard label="Current balance" value={currentBalance} note="Available now" />
          <SummaryCard label="Monthly income" value={monthlyIncome} note="Received this month" tone="income" />
          <SummaryCard label="Monthly spending" value={monthlySpending} note="Spent this month" tone="spending" />
        </section>

        <SpendingInsight
          monthlyIncome={monthlyIncome}
          monthlySpending={monthlySpending}
          transactions={transactions}
        />

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
