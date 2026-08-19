import type { Transaction } from '../types/transaction'

type TransactionDetailsProps = {
  transaction?: Transaction
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <aside className="detail-panel" data-testid="transaction-details">
      <div className="section-heading">
        <h2 className="section-title">Transaction details</h2>
      </div>

      {!transaction ? (
        <p className="detail-empty">Select a transaction to see its details.</p>
      ) : (
        <dl className="detail-list">
          <div className="detail-item">
            <dt className="detail-label">Merchant</dt>
            <dd className="detail-value">{transaction.merchant}</dd>
          </div>
          <div className="detail-item">
            <dt className="detail-label">Amount</dt>
            <dd className="detail-value">{currency.format(transaction.amount)}</dd>
          </div>
          <div className="detail-item">
            <dt className="detail-label">Category</dt>
            <dd className="detail-value">{transaction.category}</dd>
          </div>
          <div className="detail-item">
            <dt className="detail-label">Date</dt>
            <dd className="detail-value">{transaction.date}</dd>
          </div>
          <div className="detail-item">
            <dt className="detail-label">Payment method</dt>
            <dd className="detail-value">{transaction.method}</dd>
          </div>
        </dl>
      )}
    </aside>
  )
}
