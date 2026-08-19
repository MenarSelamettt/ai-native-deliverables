import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { authenticateMockSession, setInsightScenario } from '../mocks/handlers'
import { completeSpendingInsight } from '../mocks/fixtures/insight'
import { serverTransactions } from '../mocks/fixtures/transactions'
import { SpendingInsight } from './SpendingInsight'

afterEach(cleanup)

describe('SpendingInsight', () => {
  it('renders the completed mock insight', async () => {
    const user = userEvent.setup()
    authenticateMockSession()

    render(
      <SpendingInsight
        monthlyIncome={5240}
        monthlySpending={1684.27}
        transactions={serverTransactions}
      />,
    )

    await user.click(screen.getByRole('button', { name: /generate insight/i }))

    expect(screen.getByRole('status')).toHaveTextContent('Generating insight...')
    expect(await screen.findByText(completeSpendingInsight)).toBeInTheDocument()
  })

  it('renders request failure feedback', async () => {
    const user = userEvent.setup()
    authenticateMockSession()
    setInsightScenario('rate-limit')

    render(
      <SpendingInsight
        monthlyIncome={5240}
        monthlySpending={1684.27}
        transactions={serverTransactions}
      />,
    )

    await user.click(screen.getByRole('button', { name: /generate insight/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong.')
  })
})
