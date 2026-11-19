import { useState } from 'react'
import { ArrowLeft, Bell, Shield, Globe, Moon, ChevronRight, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { toast } from '@/components/Toaster'

const sections = [
  { title: 'Account', items: [
    { icon: Bell, label: 'Notifications', desc: 'Push, email, and in-app alerts' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, sessions, data' },
    { icon: Globe, label: 'Language & Region', desc: 'English (US)' },
  ]},
  { title: 'Preferences', items: [
    { icon: Moon, label: 'Dark mode', desc: 'Follow system' },
  ]},
]

export function Settings() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-xl p-2 text-gray-600 hover:bg-gray-100" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Settings</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg space-y-4 px-4 pt-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{section.title}</p>
            <Card className="divide-y divide-gray-100 overflow-hidden">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => toast('Coming soon', 'info')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </button>
                )
              })}
            </Card>
          </div>
        ))}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Dark mode</p>
              <p className="text-xs text-gray-500">Toggle appearance</p>
            </div>
            <button
              onClick={() => { setDark(!dark); toast(dark ? 'Light mode' : 'Dark mode', 'info') }}
              className={`relative h-7 w-12 rounded-full transition ${dark ? 'bg-primary-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${dark ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </Card>
        <Button block variant="danger" onClick={() => toast('Signed out', 'info')}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </main>
    </div>
  )
}
