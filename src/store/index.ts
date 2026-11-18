import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, PartListing, PartListingSearchParams, Category } from '@/types'

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // Listings
  listings: PartListing[]
  currentListing: PartListing | null
  searchParams: PartListingSearchParams
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  isLoading: boolean
  hasMore: boolean
  setListings: (listings: PartListing[], pagination?: Partial<AppState['pagination']>) => void
  appendListings: (listings: PartListing[]) => void
  setCurrentListing: (listing: PartListing | null) => void
  setSearchParams: (params: Partial<PartListingSearchParams>) => void
  resetSearchParams: () => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void

  // Categories
  categories: Category[]
  setCategories: (categories: Category[]) => void

  // UI
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

const defaultSearchParams: PartListingSearchParams = {
  is_available: true,
  page: 1,
  page_size: 20,
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Listings
      listings: [],
      currentListing: null,
      searchParams: defaultSearchParams,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
      },
      isLoading: false,
      hasMore: true,
      setListings: (listings, pagination) =>
        set((state) => ({
          listings,
          pagination: { ...state.pagination, ...pagination },
          hasMore: pagination ? pagination.page! < pagination.totalPages! : true,
        })),
      appendListings: (newListings) =>
        set((state) => ({
          listings: [...state.listings, ...newListings],
          pagination: { ...state.pagination, page: state.pagination.page + 1 },
          hasMore: state.pagination.page + 1 < state.pagination.totalPages,
        })),
      setCurrentListing: (listing) => set({ currentListing: listing }),
      setSearchParams: (params) =>
        set((state) => ({
          searchParams: { ...state.searchParams, ...params, page: 1 },
        })),
      resetSearchParams: () => set({ searchParams: defaultSearchParams }),
      setLoading: (loading) => set({ isLoading: loading }),
      setHasMore: (hasMore) => set({ hasMore }),

      // Categories
      categories: [],
      setCategories: (categories) => set({ categories }),

      // UI
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: 'b2b-mini-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        searchParams: state.searchParams,
      }),
    }
  )
)