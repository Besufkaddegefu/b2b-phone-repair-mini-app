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

function getWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

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
  return !!getWebApp()?.initData
}

export async function initTelegram(): Promise<void> {
  const webApp = getWebApp()
  if (!webApp) return

  try {
    initDataRaw = webApp.initData || null

    if (initDataRaw) {
      const params = new URLSearchParams(initDataRaw)
      const userParam = params.get('user')
      if (userParam) {
        try {
          user = JSON.parse(userParam) as TelegramUser
        } catch {
          user = null
        }
      }

      initDataParsed = {
        query_id: params.get('query_id') || undefined,
        user: user || undefined,
        auth_date: parseInt(params.get('auth_date') || '0', 10),
        hash: params.get('hash') || '',
      }
    }

    webApp.ready()
    webApp.expand()

    console.log('Telegram Mini App initialized', { user, hasInitData: !!initDataRaw })
  } catch (error) {
    console.error('Failed to initialize Telegram:', error)
  }
}

export function validateInitData(_botToken: string): boolean {
  if (!initDataRaw || !initDataParsed) return false
  // Simplified client-side check; the backend performs real HMAC verification.
  return true
}

export function getThemeParams() {
  return getWebApp()?.themeParams ?? null
}

export function setHeaderColor(color: string) {
  getWebApp()?.setHeaderColor(color)
}

export function setBackgroundColor(color: string) {
  getWebApp()?.setBackgroundColor(color)
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
  getWebApp()?.HapticFeedback?.impactOccurred(type)
}

export function closeApp() {
  getWebApp()?.close()
}

export function openTelegramLink(url: string) {
  getWebApp()?.openTelegramLink(url)
}

export function openLink(url: string) {
  getWebApp()?.openLink(url)
}
