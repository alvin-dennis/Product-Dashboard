import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: 'default' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  priceRange: [0, 2000],
  sortBy: 'default',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'all',
      priceRange: [0, 2000],
      sortBy: 'default',
    }),
}));
