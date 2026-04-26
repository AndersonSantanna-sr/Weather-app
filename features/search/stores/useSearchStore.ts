import { zustandStorage } from '@/lib/storage/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchLocation } from '../types/search';

interface SearchState {
  selectedQuery: string | null;
  recentSearches: SearchLocation[];
  setSelectedQuery: (query: string | null) => void;
  addRecentSearch: (location: SearchLocation) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      selectedQuery: null,
      recentSearches: [],
      setSelectedQuery: (query) => set({ selectedQuery: query }),
      addRecentSearch: (location) =>
        set((state) => {
          const filtered = state.recentSearches.filter((r) => r.id !== location.id);
          return { recentSearches: [location, ...filtered].slice(0, 5) };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'search-store',
      storage: zustandStorage,
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
