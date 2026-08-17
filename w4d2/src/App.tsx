import { useEffect, useState } from 'react'
import { SummaryCard } from './components/SummaryCard'
import { TransactionWorkspace } from './components/TransactionWorkspace'
import { currentBalance, transactions } from './data/transactions'
import './styles/global.css'
import './styles/dashboard.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  const monthlyIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const monthlySpending = transactions
    .filter((transaction) => transaction.type === 'spending')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const categories = [...new Set(transactions.map((transaction) => transaction.category))]

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    setFilteredTransactions(
      transactions.filter((transaction) => {
        const matchesSearch =
          transaction.merchant.toLowerCase().includes(normalizedSearch) ||
          transaction.category.toLowerCase().includes(normalizedSearch)
        const matchesCategory = category === 'All' || transaction.category === category

        return matchesSearch && matchesCategory
      }),
    )
  }, [searchTerm, category])

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
          category={category}
          categories={categories}
          filteredTransactions={filteredTransactions}
          selectedTransactionId={selectedTransactionId}
          selectedTransaction={selectedTransaction}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategory}
          onSelectTransaction={setSelectedTransactionId}
        />
      </div>
    </main>
  )
}

export default App
