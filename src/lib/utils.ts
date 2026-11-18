import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    original_pulled: 'Original (Pulled)',
    oem_new: 'OEM New',
    aftermarket: 'Aftermarket',
    for_parts_only: 'For Parts Only',
  }
  return labels[condition] || condition
}

export function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    original_pulled: 'bg-blue-100 text-blue-800',
    oem_new: 'bg-green-100 text-green-800',
    aftermarket: 'bg-yellow-100 text-yellow-800',
    for_parts_only: 'bg-red-100 text-red-800',
  }
  return colors[condition] || 'bg-gray-100 text-gray-800'
}

export function getImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/media/${imageUrl}`
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}