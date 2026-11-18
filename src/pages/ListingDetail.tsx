import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, MapPin, Phone, MessageCircle, Tag, DollarSign, RotateCcw, Share2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { api } from '@/lib/api'
import type { PartListing, User } from '@/types'
import { formatPrice, formatDate, getConditionLabel, getConditionColor, cn } from '@/lib/utils'
import { initTelegram, openTelegramLink, hapticFeedback, closeApp } from '@/lib/telegram'

export function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentListing, setCurrentListing, setLoading } = useStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [seller, setSeller] = useState<User | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)

  const listing = currentListing

  const allImages = [
    ...(listing?.image_urls || []),
    ...(listing?.telegram_file_ids || []),
  ]

  const primaryImage = allImages[0]

  const handleContactSeller = () => {
    hapticFeedback('light')
    if (seller?.telegram_id) {
      openTelegramLink(`tg://user?id=${seller.telegram_id}`)
    }
  }

  const handleShare = () => {
    hapticFeedback('light')
    if (navigator.share) {
      navigator.share({
        title: `${listing?.brand} ${listing?.model_name} - ${listing?.part_name}`,
        text: `${formatPrice(listing?.price || 0)} - ${getConditionLabel(listing?.condition || '')}`,
        url: window.location.href,
      })
    }
  }

  const goBack = () => {
    hapticFeedback('light')
    navigate(-1)
  }

  const closeModal = () => {
    setShowImageModal(false)
  }

  // Fetch listing if not in store
  // In a real app, you'd use useEffect to fetch on mount
  // For now, assume it's passed via store or fetched by parent

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={goBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate mx-8">
            {listing.brand} {listing.model_name}
          </h1>
          <button onClick={handleShare} className="p-2 -mr-2 text-gray-600 hover:text-gray-900">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.part_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Tag className="w-16 h-16" />
            </div>
          )}

          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Click to open fullscreen */}
          <button
            onClick={() => setShowImageModal(true)}
            className="absolute inset-0"
            aria-label="View fullscreen"
          />
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-4">
        {/* Title & Condition */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{listing.part_name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn('px-3 py-1 text-sm rounded-full', getConditionColor(listing.condition))}>
              {getConditionLabel(listing.condition)}
            </span>
            {listing.is_negotiable && (
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Negotiable
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between p-4 bg-white rounded-xl border border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold text-primary-600">{formatPrice(listing.price)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-primary-600" />
        </div>

        {/* Seller Info */}
        {seller && (
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Seller Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="font-medium">{seller.full_name}</span>
                {seller.shop_name && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">{seller.shop_name}</span>
                )}
              </div>
              {seller.shop_location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{seller.shop_location}</span>
                </div>
              )}
              {seller.phone_number && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{seller.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}

        {/* Meta */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Category ID</span>
            <span className="font-medium text-gray-900">{listing.category_id}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Posted</span>
            <span className="font-medium text-gray-900">{formatDate(listing.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-inset-bottom">
        <button
          onClick={handleContactSeller}
          className="w-full btn-primary py-3 text-lg"
          disabled={!seller?.telegram_id}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Contact Seller
        </button>
      </div>

      {/* Fullscreen Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
            }}
            className="absolute left-4 p-2 bg-white/10 rounded-full text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={allImages[currentImageIndex]}
            alt={`${listing.part_name} ${currentImageIndex + 1}`}
            className="max-w-[90%] max-h-[90%] object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
            }}
            className="absolute right-4 p-2 bg-white/10 rounded-full text-white"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}