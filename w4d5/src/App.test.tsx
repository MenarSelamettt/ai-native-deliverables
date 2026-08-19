import '@testing-library/jest-dom/vitest'
import { act, cleanup, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { transactionsQueryKey } from './hooks/useTransactionsQuery'
import {
  authenticateMockSession,
  expireMockSession,
  setTransactionScenario,
} from './mocks/handlers'
import { usePreferencesStore } from './stores/usePreferencesStore'
import { renderApp } from './test/renderApp'

afterEach(() => {
  cleanup()
  usePreferencesStore.setState({ category: 'All' })
  window.localStorage.clear()
})

describe('Day 5 application', () => {
  it('redirects unauthenticated dashboard access to login', async () => {
    renderApp('/dashboard')

    expect(await screen.findByRole('heading', { name: /sign in to continue/i })).toBeInTheDocument()
  })

  it('shows useful feedback for invalid credentials', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'demo@uptimecrew.dev')
    await user.type(screen.getByLabelText(/password/i), 'incorrect')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.')
  })

  it('logs in and renders the server user, transactions, and derived totals', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'demo@uptimecrew.dev')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('heading', { name: /personal spending dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('Demo User')).toBeInTheDocument()
    expect(await screen.findByText('8 transactions')).toBeInTheDocument()
    expect(screen.getByText('$4,280.65')).toBeInTheDocument()
    expect(screen.getByText('$5,240.00')).toBeInTheDocument()
    expect(screen.getByText('$1,684.27')).toBeInTheDocument()
  })

  it('preserves filtering, visible counts, selection, and hidden-detail behavior', async () => {
    const user = userEvent.setup()
    authenticateMockSession()
    renderApp('/dashboard')

    await screen.findByText('8 transactions')
    await user.click(screen.getByRole('button', { name: /fresh basket market/i }))

    const details = screen.getByTestId('transaction-details')
    expect(within(details).getByText('Fresh Basket Market')).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'Utilities')

    expect(screen.getByText('Utilities · 1 transaction')).toBeInTheDocument()
    expect(within(details).queryByText('Fresh Basket Market')).not.toBeInTheDocument()
    expect(within(details).getByText('Select a transaction to see its details.')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /search transactions/i }), 'metro')
    expect(screen.getByText('No transactions match your filters.')).toBeInTheDocument()
  })

  it('logs out, removes authenticated transaction cache, and preserves category', async () => {
    const user = userEvent.setup()
    authenticateMockSession()
    usePreferencesStore.setState({ category: 'Utilities' })
    const { queryClient } = renderApp('/dashboard')

    await screen.findByText('Utilities · 1 transaction')
    expect(queryClient.getQueryData(transactionsQueryKey)).toBeDefined()

    await user.click(screen.getByRole('button', { name: /sign out/i }))

    expect(await screen.findByRole('heading', { name: /sign in to continue/i })).toBeInTheDocument()
    expect(queryClient.getQueryData(transactionsQueryKey)).toBeUndefined()
    expect(usePreferencesStore.getState().category).toBe('Utilities')
  })

  it('shows a meaningful transaction service error', async () => {
    authenticateMockSession()
    setTransactionScenario('error')
    renderApp('/dashboard')

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByRole('heading', { name: /couldn't load your transactions/i })).toBeInTheDocument()
    expect(alert).toHaveTextContent('Transactions are temporarily unavailable.')
  })

  it('allows retrying a failed transaction request', async () => {
    authenticateMockSession()
    setTransactionScenario('error')
    renderApp('/dashboard')

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows a meaningful empty transaction state', async () => {
    authenticateMockSession()
    setTransactionScenario('empty')
    renderApp('/dashboard')

    expect(await screen.findByRole('heading', { name: /no transactions yet/i })).toBeInTheDocument()
  })

  it('removes protected access when transactions report an expired session', async () => {
    authenticateMockSession()
    const { queryClient } = renderApp('/dashboard')

    await screen.findByText('8 transactions')
    expireMockSession()

    await act(async () => {
      await queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
    })

    expect(await screen.findByRole('heading', { name: /sign in to continue/i })).toBeInTheDocument()
  })
})
