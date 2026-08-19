import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { authenticateMockSession, setInsightScenario } from '../mocks/handlers'
import {
  completeSpendingInsight,
  insightChunkDelayMs,
  spendingInsightChunks,
} from '../mocks/fixtures/insight'
import { serverTransactions } from '../mocks/fixtures/transactions'
import { SpendingInsight } from './SpendingInsight'

afterEach(cleanup)

function renderSpendingInsight() {
  authenticateMockSession()
  render(
    <SpendingInsight
      monthlyIncome={5240}
      monthlySpending={1684.27}
      transactions={serverTransactions}
    />,
  )
}

describe('SpendingInsight streaming lifecycle', () => {
  it('reveals a partial response before the complete insight arrives', async () => {
    const user = userEvent.setup()
    renderSpendingInsight()

    await user.click(screen.getByRole('button', { name: /generate insight/i }))

    expect(screen.getByRole('status')).toHaveTextContent('Generating insight...')
    expect(await screen.findByText(spendingInsightChunks[0], { exact: true })).toBeInTheDocument()
    expect(screen.queryByText(completeSpendingInsight, { exact: true })).not.toBeInTheDocument()
    expect(await screen.findByText(completeSpendingInsight, { exact: true })).toBeInTheDocument()
  })

  it('stops future chunks without presenting cancellation as an error', async () => {
    const user = userEvent.setup()
    renderSpendingInsight()

    await user.click(screen.getByRole('button', { name: /generate insight/i }))
    await screen.findByText(spendingInsightChunks[0], { exact: true })

    const output = screen.getByTestId('insight-output')
    const partialOutput = output.textContent
    const stopButton = screen.getByRole('button', { name: /stop/i })

    expect(stopButton).toBeInTheDocument()
    await user.click(stopButton)
    await new Promise((resolve) => setTimeout(resolve, insightChunkDelayMs * 3))

    expect(output).toHaveTextContent(partialOutput ?? '')
    expect(output).not.toHaveTextContent(completeSpendingInsight)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows useful feedback for a rate-limited request', async () => {
    const user = userEvent.setup()
    setInsightScenario('rate-limit')
    renderSpendingInsight()

    await user.click(screen.getByRole('button', { name: /generate insight/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Too many requests. Try again shortly.',
    )
  })
})
