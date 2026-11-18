import { Routes, Route, Navigate } from 'react-router-dom'
import { Catalog } from '@/pages/Catalog'
import { ListingDetail } from '@/pages/ListingDetail'
import { useAuth } from '@/hooks'
import { initTelegram, setHeaderColor, setBackgroundColor } from '@/lib/telegram'
import { useEffect } from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTelegram()
    setHeaderColor('#0ea5e9')
    setBackgroundColor('#f8fafc')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function LoginPage() {
  const { refreshAuth } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">B2B Phone Repair</h1>
          <p className="text-gray-500 mt-1">Parts Marketplace</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-center text-gray-600 mb-6">
            Please open this Mini App from Telegram to authenticate automatically.
          </p>

          <button
            onClick={refreshAuth}
            className="w-full btn-primary py-3"
            disabled={typeof window === 'undefined' || !window.Telegram?.WebApp}
          >
            {window.Telegram?.WebApp ? 'Refresh Authentication' : 'Open in Telegram'}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            This app works only inside Telegram Mini App environment.
          </p>
        </div>
      </div>
    </div>
  )
}