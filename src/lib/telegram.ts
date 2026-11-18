import { init as initBridge, signalWebAppReady } from '@telegram-apps/bridge'
import { init as initSDK, isTMA } from '@telegram-apps/sdk'
import { retrieveLaunchParams } from '@telegram-apps/bridge'
import type { InitData } from '@telegram-apps/bridge'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export interface TelegramInitData {
  query_id?: string
  user?: TelegramUser
  receiver?: TelegramUser
  chat?: TelegramUser
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
}

let initDataRaw: string | null = null
let initDataParsed: TelegramInitData | null = null
let user: TelegramUser | null = null

export function getInitDataRaw(): string | null {
  return initDataRaw
}

export function getInitDataParsed(): TelegramInitData | null {
  return initDataParsed
}

export function getTelegramUser(): TelegramUser | null {
  return user
}

export function isTelegramMiniApp(): boolean {
  return isTMA()
}

export async function initTelegram(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Initialize bridge first
    await initBridge()

    // Retrieve launch params (contains initData)
    const launchParams = retrieveLaunchParams()
    initDataRaw = launchParams.tgWebAppData || null

    if (initDataRaw) {
      // Parse initData
      const params = new URLSearchParams(initDataRaw)
      const userParam = params.get('user')
      if (userParam) {
        try {
          user = JSON.parse(userParam) as TelegramUser
        } catch {
          user = null
        }
      }

      // Parse full initData
      initDataParsed = {
        query_id: params.get('query_id') || undefined,
        user: user || undefined,
        auth_date: parseInt(params.get('auth_date') || '0', 10),
        hash: params.get('hash') || '',
      }
    }

    // Initialize SDK
    await initSDK()

    // Signal ready
    signalWebAppReady()

    // Set viewport
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }

    console.log('Telegram Mini App initialized', { user, hasInitData: !!initDataRaw })
  } catch (error) {
    console.error('Failed to initialize Telegram:', error)
  }
}

export function validateInitData(botToken: string): boolean {
  if (!initDataRaw || !initDataParsed) return false

  // This is a simplified validation - in production, use proper HMAC-SHA256 verification
  // The backend should do the actual validation
  return true
}

export function getThemeParams() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return null
  return window.Telegram.WebApp.themeParams
}

export function setHeaderColor(color: string) {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return
  window.Telegram.WebApp.setHeaderColor(color)
}

export function setBackgroundColor(color: string) {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return
  window.Telegram.WebApp.setBackgroundColor(color)
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp?.HapticFeedback) return
  window.Telegram.WebApp.HapticFeedback.impactOccurred(type)
}

export function closeApp() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return
  window.Telegram.WebApp.close()
}

export function openTelegramLink(url: string) {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return
  window.Telegram.WebApp.openTelegramLink(url)
}

export function openLink(url: string) {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return
  window.Telegram.WebApp.openLink(url)
}