import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PreferencesState = {
  category: string
  setCategory: (category: string) => void
}

export const preferencesStorageKey = 'spending-dashboard-preferences'

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      category: 'All',
      setCategory: (category) => set({ category }),
    }),
    {
      name: preferencesStorageKey,
      partialize: (state) => ({ category: state.category }),
    },
  ),
)
