import { Image, MapPin, Tag, MessageCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PartListing } from '@/types'
import { cn, formatPrice, formatRelativeTime, getConditionLabel, getConditionColor } from '@/lib/utils'

interface ListingCardProps {
  listing: PartListing
  compact?: boolean
}

export function ListingCard({ listing, compact = false }: ListingCardProps) {
  const primaryImage = listing.image_urls[0] || listing.telegram_file_ids[0]

  if (compact) {
    return (
      <Link
        to={`/listing/${listing.id}`}
        className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
      >
        <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img src={primaryImage} alt={listing.part_name} className="w-full h-full object-cover" />
          ) : (
            <Image className="w-full h-full text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{listing.brand} {listing.model_name}</h3>
          <p className="text-sm text-gray-500 truncate">{listing.part_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('px-2 py-0.5 text-xs rounded-full', getConditionColor(listing.condition))}>
              {getConditionLabel(listing.condition)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-primary-600">{formatPrice(listing.price)}</p>
          <p className="text-xs text-gray-400">{listing.is_negotiable ? 'Negotiable' : 'Fixed'}</p>
        </div>
      </Link>
    )
  }

  return (
    <article className="card group">
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.part_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image className="w-12 h-12" />
            </div>
          )}
          {listing.telegram_file_ids.length > 1 && (
            <div className="absolute top-2 right-2">
              <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                +{listing.telegram_file_ids.length - 1}
              </span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={cn('px-2 py-0.5 text-xs rounded-full', getConditionColor(listing.condition))}>
              {getConditionLabel(listing.condition)}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {listing.brand} {listing.model_name}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">{listing.part_name}</p>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[120px]">{listing.seller?.shop_location || 'Location not specified'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-lg font-bold text-primary-600">{formatPrice(listing.price)}</p>
              <p className="text-xs text-gray-500">{listing.is_negotiable ? 'Negotiable' : 'Fixed Price'}</p>
            </div>
            <MessageCircle className="w-5 h-5 text-primary-600" />
          </div>
        </div>
      </Link>
    </article>
  )
}

export function ListingSkeleton() {
  return (
    <article className="card animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-3">
          <div className="h-4 bg-gray-200 rounded flex-1" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </article>
  )
}