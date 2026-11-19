import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Store,
  Heart,
  Pencil,
  LifeBuoy,
  Info,
  RefreshCw,
  BadgeCheck,
  Crown,
  CalendarDays,
  Phone,
  MapPin,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react'
import { useAuth, useFavorites, useMyListings } from '@/hooks'
import { api } from '@/lib/api'
import { useStore } from '@/store'
import { Avatar, Badge, Button, Card, EmptyState, Input, Sheet } from '@/components/ui'
import { toast } from '@/components/Toaster'
import { formatDate } from '@/lib/utils'
import { hapticFeedback, openTelegramLink } from '@/lib/telegram'
import type { Subscription, SubscriptionStatus } from '@/types'

const statusLabels: Record<SubscriptionStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  active: { label: 'Active', variant: 'success' },
  pending_approval: { label: 'Pending approval', variant: 'warning' },
  past_due: { label: 'Past due', variant: 'danger' },
  canceled: { label: 'Canceled', variant: 'neutral' },
}

export function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, refreshAuth, logout } = useAuth()
  const { favorites } = useFavorites()
  const { items: myListings } = useMyListings()
  const setUser = useStore((state) => state.setUser)

  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    shop_name: '',
    shop_location: '',
    phone_number: '',
  })

  useEffect(() => {
    if (!user) return
    setForm({
      full_name: user.full_name || '',
      shop_name: user.shop_name || '',
      shop_location: user.shop_location || '',
      phone_number: user.phone_number || '',
    })
    api
      .getSubscription()
      .then(setSubscription)
      .catch(() => undefined)
  }, [user])

  const openEdit = () => {
    if (!user) return
    setForm({
      full_name: user.full_name || '',
      shop_name: user.shop_name || '',
      shop_location: user.shop_location || '',
      phone_number: user.phone_number || '',
    })
    setEditOpen(true)
  }

  const saveProfile = async () => {
    if (!form.full_name.trim()) return toast('Enter your full name', 'error')
    if (!form.phone_number.trim()) return toast('Enter your phone number', 'error')
    setIsSaving(true)
    try {
      const updated = await api.updateProfile({
        full_name: form.full_name.trim(),
        shop_name: form.shop_name.trim() || null,
        shop_location: form.shop_location.trim() || null,
        phone_number: form.phone_number.trim(),
      })
      setUser({ ...user!, ...updated })
      setEditOpen(false)
      hapticFeedback('success')
      toast('Profile updated')
    } catch {
      toast('Could not update profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'pixelrepiarbot'

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 pt-[calc(2rem+env(safe-area-inset-top))]">
        <EmptyState
          icon={<Store className="h-8 w-8" />}
          title="You are not signed in"
          description="Open the app from Telegram and refresh your account to continue."
          action={<Button onClick={refreshAuth}>Refresh account</Button>}
        />
      </div>
    )
  }

  const status = subscription ? statusLabels[subscription.status] : null

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 pb-16 pt-[calc(1rem+env(safe-area-inset-top))] text-white">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-primary-500/20 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={user.full_name} size="lg" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold">{user.full_name || 'Technician'}</h1>
                {user.is_verified && <BadgeCheck className="h-4 w-4 text-sky-400" />}
              </div>
              <p className="text-xs text-white/60">{user.shop_name || 'Independent shop'}</p>
              <p className="mt-1 text-[11px] text-white/40">@{user.telegram_username || 'telegram user'}</p>
            </div>
          </div>
          <button onClick={openEdit} className="rounded-xl bg-white/10 p-2 ring-1 ring-white/15" aria-label="Edit profile">
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-5 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-3 ring-1 ring-white/10 backdrop-blur">
          <div className="text-center">
            <p className="text-lg font-bold">{myListings.length}</p>
            <p className="text-[10px] text-white/50">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{favorites.length}</p>
            <p className="text-[10px] text-white/50">Saved</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{user.role === 'admin' ? 'Admin' : 'Pro'}</p>
            <p className="text-[10px] text-white/50">Account</p>
          </div>
        </div>
      </header>

      <main className="-mt-8 space-y-3 px-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Crown className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Subscription</p>
                <p className="text-xs text-gray-500">{subscription ? `ETB ${subscription.monthly_rate}/month` : 'No plan yet'}</p>
              </div>
            </div>
            {status ? <Badge variant={status.variant}>{status.label}</Badge> : <Badge>Not active</Badge>}
          </div>

          <div className="mt-3 space-y-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-gray-400" /> Member since</span>
              <span className="font-medium text-gray-900">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-gray-400" /> Renews</span>
              <span className="font-medium text-gray-900">
                {subscription?.current_period_end ? formatDate(subscription.current_period_end) : '—'}
              </span>
            </div>
          </div>

          <Button
            block
            className="mt-3"
            onClick={() => openTelegramLink(`https://t.me/${botUsername}?start=subscribe`)}
          >
            Manage subscription
          </Button>
        </Card>

        <Card>
          {[
            { label: 'My listings', icon: Store, onClick: () => navigate('/my-listings'), value: String(myListings.length) },
            { label: 'Saved parts', icon: Heart, onClick: () => navigate('/favorites'), value: String(favorites.length) },
            { label: 'Edit profile', icon: Pencil, onClick: openEdit },
{ label: 'Settings', icon: SettingsIcon, onClick: () => navigate('/settings') },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => {
                  hapticFeedback('light')
                  item.onClick()
                }}
                className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-left last:border-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                {item.value && <span className="text-xs text-gray-400">{item.value}</span>}
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            )
          })}
        </Card>

        <Card>
          <button
            onClick={() => openTelegramLink(`https://t.me/${botUsername}`)}
            className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
              <LifeBuoy className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-sm font-medium text-gray-800">Help & support</span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </button>
          <button onClick={() => setAboutOpen(true)} className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
              <Info className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-sm font-medium text-gray-800">About B2B Phone Repair</span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </button>
          <button onClick={refreshAuth} className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
              <RefreshCw className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-sm font-medium text-gray-800">Refresh session</span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </button>
          <button
            onClick={() => {
              logout()
              toast('Signed out', 'info')
              navigate('/')
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <LogOut className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-sm font-medium text-red-500">Sign out</span>
          </button>
        </Card>

        <p className="pb-2 text-center text-[11px] text-gray-400">
          {user.shop_location ? (
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {user.shop_location}</span>
          ) : (
            'B2B Phone Repair · Ethiopia'
          )}
        </p>
      </main>

      <Sheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        description="Buyers use these details to reach you"
        footer={
          <Button block loading={isSaving} onClick={saveProfile}>
            Save changes
          </Button>
        }
      >
        <div className="space-y-3">
          <Input
            label="Full name"
            required
            value={form.full_name}
            onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
          />
          <Input
            label="Shop name"
            value={form.shop_name}
            onChange={(event) => setForm((current) => ({ ...current, shop_name: event.target.value }))}
            placeholder="e.g. Selam Phone Repair"
          />
          <Input
            label="Shop location"
            value={form.shop_location}
            onChange={(event) => setForm((current) => ({ ...current, shop_location: event.target.value }))}
            placeholder="e.g. Merkato, Addis Ababa"
          />
          <Input
            label="Phone number"
            required
            type="tel"
            value={form.phone_number}
            onChange={(event) => setForm((current) => ({ ...current, phone_number: event.target.value }))}
            placeholder="09xxxxxxxx"
          />
        </div>
      </Sheet>

      <Sheet open={aboutOpen} onClose={() => setAboutOpen(false)} title="About">
        <div className="space-y-3 text-sm leading-relaxed text-gray-600">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <Phone className="h-6 w-6 text-primary-600" />
            <div>
              <p className="font-semibold text-gray-900">B2B Phone Repair</p>
              <p className="text-xs text-gray-500">Ethiopia's parts marketplace for repair professionals.</p>
            </div>
          </div>
          <p>
            Buy and sell original, OEM and aftermarket phone parts. Connect directly with verified repair shops, compare
            prices and keep your bench stocked.
          </p>
          <p className="text-xs text-gray-400">Version 1.0 · Built for Telegram Mini Apps</p>
        </div>
      </Sheet>
    </div>
  )
}
