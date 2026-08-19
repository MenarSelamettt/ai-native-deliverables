import { afterEach, describe, expect, it } from 'vitest'
import { preferencesStorageKey, usePreferencesStore } from './usePreferencesStore'

afterEach(() => {
  usePreferencesStore.setState({ category: 'All' })
  window.localStorage.clear()
})

describe('usePreferencesStore', () => {
  it('updates the category preference', () => {
    usePreferencesStore.getState().setCategory('Utilities')

    expect(usePreferencesStore.getState().category).toBe('Utilities')
    expect(JSON.parse(window.localStorage.getItem(preferencesStorageKey) ?? '{}').state).toEqual({
      category: 'Utilities',
    })
  })

  it('restores the persisted category preference', async () => {
    window.localStorage.setItem(
      preferencesStorageKey,
      JSON.stringify({ state: { category: 'Dining' }, version: 0 }),
    )

    await usePreferencesStore.persist.rehydrate()

    expect(usePreferencesStore.getState().category).toBe('Dining')
  })
})
