type SummaryCardProps = {
  label: string
  value: number
  note: string
  tone?: 'income' | 'spending'
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function SummaryCard({ label, value, note, tone }: SummaryCardProps) {
  const className = tone ? `summary-card ${tone}` : 'summary-card'

  return (
    <article className={className}>
      <p className="summary-label">{label}</p>
      <p className="summary-value">{currency.format(value)}</p>
      <p className="summary-note">{note}</p>
    </article>
  )
}
