import { Search, Filter, ChevronDown, X } from 'lucide-react'
import { useStore } from '@/store'
import { useCategories } from '@/hooks'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const { searchParams, search, clearSearch } = useStore()
  const { categories } = useCategories()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    search({
      model_name: formData.get('model') as string || undefined,
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="model"
            placeholder="Search model (e.g., S22 Ultra)..."
            defaultValue={searchParams.model_name}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        {searchParams.model_name && (
          <button
            type="button"
            onClick={() => clearSearch()}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  )
}

export function CategoryFilter() {
  const { searchParams, search } = useStore()
  const { categories } = useCategories()

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
          !searchParams.category_id
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
        onClick={() => search({ category_id: undefined })}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            searchParams.category_id === cat.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          onClick={() => search({ category_id: cat.id })}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export function BrandFilter() {
  const { searchParams, search } = useStore()
  const brands = ['Samsung', 'Apple', 'Xiaomi', 'Tecno', 'Infinix', 'Huawei', 'Oppo', 'Vivo', 'Nokia']

  return (
    <select
      value={searchParams.brand || ''}
      onChange={(e) => search({ brand: e.target.value || undefined })}
      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
    >
      <option value="">All Brands</option>
      {brands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  )
}