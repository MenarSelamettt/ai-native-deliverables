import '@testing-library/jest-dom/vitest'
import { cleanup, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { usePreferencesStore } from './stores/usePreferencesStore'
import { renderApp } from './test/renderApp'

afterEach(() => {
  cleanup()
  usePreferencesStore.setState({ category: 'All' })
  window.localStorage.clear()
})

describe('App', () => {
  it('renders the application', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: /personal spending dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('8 transactions')).toBeInTheDocument()
  })

  it('derives summary values from the supplied dataset', () => {
    renderApp()

    expect(screen.getByText('$4,280.65')).toBeInTheDocument()
    expect(screen.getByText('$5,240.00')).toBeInTheDocument()
    expect(screen.getByText('$1,684.27')).toBeInTheDocument()
  })

  it('filters transactions by search text', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('searchbox', { name: /search transactions/i }), 'fresh basket')

    expect(screen.getByRole('button', { name: /fresh basket market/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /cedar grove apartments/i })).not.toBeInTheDocument()
    expect(screen.getByText('1 transaction')).toBeInTheDocument()
  })

  it('filters transactions by category', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'Utilities')

    expect(screen.getByRole('button', { name: /city utilities/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /metro transit/i })).not.toBeInTheDocument()
    expect(screen.getByText('Utilities · 1 transaction')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /search transactions/i }), 'metro')

    expect(screen.getByText('No transactions match your filters.')).toBeInTheDocument()
  })

  it('shows details only while the selected transaction remains visible', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /fresh basket market/i }))

    const details = screen.getByTestId('transaction-details')
    expect(within(details).getByText('Fresh Basket Market')).toBeInTheDocument()
    expect(within(details).getByText('Debit card')).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'Utilities')

    expect(within(details).queryByText('Fresh Basket Market')).not.toBeInTheDocument()
    expect(within(details).getByText('Select a transaction to see its details.')).toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('searchbox', { name: /search transactions/i }), 'not a real merchant')

    expect(screen.getByText('No transactions match your filters.')).toBeInTheDocument()
    expect(screen.getByText('0 transactions')).toBeInTheDocument()
  })

  it('renders the supplied login route', () => {
    renderApp('/login')

    expect(screen.getByRole('heading', { name: /sign in to continue/i })).toBeInTheDocument()
    expect(screen.getByText('demo@uptimecrew.dev')).toBeInTheDocument()
  })
})
