import { useCompletion } from '@ai-sdk/react'
import { useState } from 'react'
import { buildSpendingInsightPrompt } from '../api/insights'
import type { Transaction } from '../types/transaction'

type SpendingInsightProps = {
  monthlyIncome: number
  monthlySpending: number
  transactions: Transaction[]
}

export function SpendingInsight({
  monthlyIncome,
  monthlySpending,
  transactions,
}: SpendingInsightProps) {
  const [finishedCompletion, setFinishedCompletion] = useState('')
  const [lifecycleError, setLifecycleError] = useState<string | null>(null)
  const { complete, error, isLoading, stop } = useCompletion({
    api: '/api/insights/spending',
    credentials: 'include',
    streamProtocol: 'text',
    fetch: (input, init) => globalThis.fetch(input, init),
    onFinish: (_prompt, finalCompletion) => setFinishedCompletion(finalCompletion),
  })

  function handleGenerate() {
    setFinishedCompletion('')
    setLifecycleError(null)
    void complete(buildSpendingInsightPrompt({ monthlyIncome, monthlySpending, transactions }))
  }

  function handleStop() {
    stop()
    setLifecycleError('Something went wrong.')
  }

  const errorMessage = lifecycleError ?? (error ? 'Something went wrong.' : null)

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
            <button className="stop-button" type="button" onClick={handleStop}>Stop</button>
          ) : null}
        </div>
      </div>

      <div className="insight-output" data-testid="insight-output" aria-live="polite">
        {isLoading ? <p role="status">Generating insight...</p> : null}
        {finishedCompletion ? <p>{finishedCompletion}</p> : null}
        {!isLoading && !finishedCompletion && !errorMessage ? (
          <p className="insight-placeholder">Your generated insight will appear here.</p>
        ) : null}
      </div>

      {errorMessage ? <p className="insight-error" role="alert">{errorMessage}</p> : null}
    </section>
  )
}
