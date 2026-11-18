import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private client: AxiosInstance
  private initData: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.initData) {
          config.headers['X-Telegram-Init-Data'] = this.initData
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Handle auth error
          console.error('Authentication required')
        }
        return Promise.reject(error)
      }
    )
  }

  setInitData(initData: string) {
    this.initData = initData
  }

  clearInitData() {
    this.initData = null
  }

  // Categories
  async getCategories() {
    const response = await this.client.get<Category[]>('/categories')
    return response.data
  }

  // Listings
  async getListings(params: PartListingSearchParams) {
    const response = await this.client.get<PaginatedResponse<PartListing>>('/listings', { params })
    return response.data
  }

  async getListing(id: string) {
    const response = await this.client.get<PartListing>(`/listings/${id}`)
    return response.data
  }

  async createListing(data: Partial<PartListing>) {
    const response = await this.client.post<PartListing>('/listings', data)
    return response.data
  }

  async updateListing(id: string, data: Partial<PartListing>) {
    const response = await this.client.patch<PartListing>(`/listings/${id}`, data)
    return response.data
  }

  async deleteListing(id: string) {
    await this.client.delete(`/listings/${id}`)
  }

  // User
  async getProfile() {
    const response = await this.client.get<User>('/users/me')
    return response.data
  }

  async updateProfile(data: Partial<User>) {
    const response = await this.client.patch<User>('/users/me', data)
    return response.data
  }
}

export const api = new ApiClient()

// Re-export types for convenience
export type {
  User,
  Subscription,
  Transaction,
  Category,
  PartListing,
  PartListingSearchParams,
  PaginatedResponse,
}