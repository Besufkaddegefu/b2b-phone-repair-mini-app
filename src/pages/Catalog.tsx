import { useEffect, useRef, useCallback } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import { useStore } from '@/store'
import { useListings, useCategories } from '@/hooks'
import { ListingCard, ListingSkeleton } from '@/components/ListingCard'
import { SearchBar, CategoryFilter, BrandFilter } from '@/components/SearchBar'
import { initTelegram, hapticFeedback } from '@/lib/telegram'

export function Catalog() {
  const {
    listings,
    isLoading,
    hasMore,
    searchParams,
    loadMore,
    search,
    clearSearch,
  } = useListings()
  const { categories } = useCategories()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Initialize Telegram
  useEffect(() => {
    initTelegram()
  }, [])

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, loadMore])

  const hasActiveFilters = searchParams.category_id || searchParams.brand || searchParams.model_name

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom safe-area-inset-top">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Find Parts</h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <SearchBar />
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-3">
          <CategoryFilter />
        </div>

        {/* Brand Filter & View Toggle */}
        <div className="px-4 pb-4 flex items-center gap-3 border-t border-gray-100">
          <BrandFilter />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-auto">
            <button
              onClick={() => { hapticFeedback('light'); setViewMode('grid') }}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => { hapticFeedback('light'); setViewMode('list') }}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
            {searchParams.category_id && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full flex items-center gap-1">
                {categories.find(c => c.id === searchParams.category_id)?.name}
                <button onClick={() => search({ category_id: undefined })} className="hover:text-primary-900">×</button>
              </span>
            )}
            {searchParams.brand && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full flex items-center gap-1">
                {searchParams.brand}
                <button onClick={() => search({ brand: undefined })} className="hover:text-primary-900">×</button>
              </span>
            )}
            {searchParams.model_name && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full flex items-center gap-1">
                {searchParams.model_name}
                <button onClick={() => search({ model_name: undefined })} className="hover:text-primary-900">×</button>
              </span>
            )}
            <button
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        )}
      </header>

      {/* Results */}
      <main className="p-4 pb-20">
        {isLoading && listings.length === 0 ? (
          // Loading skeletons
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No parts found</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Be the first to post a part!'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearSearch} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          // Listings
          <div
            className={viewMode === 'grid'
              ? 'grid grid-cols-2 gap-3'
              : 'space-y-3'}
          >
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} compact={viewMode === 'list'} />
            ))}
          </div>
        )}

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-10" />
        {hasMore && (
          <div className="py-4 text-center text-gray-500 text-sm">
            Scroll for more...
          </div>
        )}
        {isLoading && listings.length > 0 && (
          <div className="py-4 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              Loading more...
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

import { useState } from 'react'