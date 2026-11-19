import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Sell } from '@/pages/Sell'
import { Favorites } from '@/pages/Favorites'
import { Profile } from '@/pages/Profile'
import { MyListings } from '@/pages/MyListings'
import { ListingDetail } from '@/pages/ListingDetail'
import { Settings } from '@/pages/Settings'
import { BottomNav } from '@/components/BottomNav'
import { Toaster } from '@/components/Toaster'
import { useAuth } from '@/hooks'
import { initTelegram, setBackgroundColor, setHeaderColor } from '@/lib/telegram'
import { Button, Card } from '@/components/ui'

function LoginPage() {
  const { refreshAuth } = useAuth()
  const inTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-primary-600 to-sky-400 shadow-xl shadow-primary-600/25">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">B2B Phone Repair</h1>
          <p className="mt-1 text-sm text-gray-500">Parts marketplace for repair professionals</p>
        </div>

        <Card className="mt-6 p-5">
          <p className="text-center text-sm leading-relaxed text-gray-600">
            {inTelegram
              ? 'Tap below to sign in with your Telegram account.'
              : 'This app runs inside Telegram. Open @pixelrepiarbot and launch the mini app to sign in.'}
          </p>
          <Button block className="mt-4" onClick={refreshAuth} disabled={!inTelegram}>
            {inTelegram ? 'Sign in with Telegram' : 'Open in Telegram'}
          </Button>
        </Card>
      </div>
    </div>
  )
}

export function App() {
  useAuth()
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/listing/') || location.pathname === '/login'

  useEffect(() => {
    initTelegram()
    setHeaderColor('#0284c7')
    setBackgroundColor('#f8fafc')
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-gray-50 shadow-sm">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/catalog" element={<Navigate to="/search" replace />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideNav && <BottomNav />}
      <Toaster />
    </div>
  )
}
