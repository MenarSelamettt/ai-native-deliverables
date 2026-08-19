import { useCompletion } from '@ai-sdk/react'
import { buildSpendingInsightPrompt } from '../api/insights'
import type { Transaction } from '../types/transaction'

type SpendingInsightProps = {
  monthlyIncome: number
  monthlySpending: number
  transactions: Transaction[]
}

function getInsightErrorMessage(error: Error | undefined) {
  if (!error) {
    return null
  }

  if (/too many requests|rate limit|429/i.test(error.message)) {
    return 'Too many requests. Try again shortly.'
  }

  return 'We could not generate an insight. Try again.'
}

export function SpendingInsight({
  monthlyIncome,
  monthlySpending,
  transactions,
}: SpendingInsightProps) {
  const { completion, complete, error, isLoading, setCompletion, stop } = useCompletion({
    api: '/api/insights/spending',
    credentials: 'include',
    streamProtocol: 'text',
    fetch: (input, init) => globalThis.fetch(input, init),
  })

  function handleGenerate() {
    setCompletion('')
    void complete(buildSpendingInsightPrompt({ monthlyIncome, monthlySpending, transactions }))
  }

  const errorMessage = getInsightErrorMessage(error)

  return (
    <section className="insight-panel" aria-labelledby="spending-insight-heading">
      <div className="insight-header">
        <div>
          <h2 className="section-title" id="spending-insight-heading">Spending Insight</h2>
          <p className="insight-copy">
            Generate a short observation from this month's income and spending activity.
          </p>
        </div>
        <div className="insight-actions">
          <button
            className="insight-button"
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
          >
            Generate Insight
          </button>
          {isLoading ? (
            <button className="stop-button" type="button" onClick={stop}>Stop</button>
          ) : null}
        </div>
      </div>

      <div className="insight-output" data-testid="insight-output" aria-live="polite">
        {isLoading && !completion ? <p role="status">Generating insight...</p> : null}
        {completion ? <p role={isLoading ? 'status' : undefined}>{completion}</p> : null}
        {!isLoading && !completion && !errorMessage ? (
          <p className="insight-placeholder">Your generated insight will appear here.</p>
        ) : null}
      </div>

      {errorMessage ? <p className="insight-error" role="alert">{errorMessage}</p> : null}
    </section>
  )
}
