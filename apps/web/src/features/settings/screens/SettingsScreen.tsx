import { useNavigate } from 'react-router-dom'
import { User, Bell, RotateCcw, LogOut, Palette, ShieldCheck } from 'lucide-react'
import { useAuthStore, useCurrentUser, useSettingsStore } from '@worklink/state'
import { Card, SectionHeader, Avatar, Switch, RoleSwitcher, DemoPill, Button } from '../../../app/ui'
import { toast } from '../../../shared/toast'

export function SettingsScreen() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)
  const mode = useSettingsStore((s) => s.mode)
  const setMode = useSettingsStore((s) => s.setMode)
  const notifications = useSettingsStore((s) => s.notifications)
  const toggleNotification = useSettingsStore((s) => s.toggleNotification)
  const resetDemo = useSettingsStore((s) => s.resetDemo)

  const notificationRows: { key: keyof typeof notifications; label: string; text: string }[] = [
    { key: 'jobAlerts', label: 'Job alerts', text: 'Notify me when new jobs match my skills' },
    { key: 'messages', label: 'Messages', text: 'Notify me when I get a new message' },
    { key: 'marketing', label: 'Updates & tips', text: 'Occasional product updates and tips' },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Settings</h1>
      <p className="mt-1 text-ink-soft">Manage your account and preferences.</p>

      <section className="mt-6">
        <SectionHeader title="Account" />
        <Card className="p-5">
          {user && (
            <div className="flex items-center gap-4">
              <Avatar user={user} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-strong">{user.name}</p>
                <p className="truncate text-sm text-ink-muted">{user.email}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/app/profile/${user.id}`)}>
                <User className="h-4 w-4" /> View profile
              </Button>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-divider pt-4">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-ink-muted" />
              <div>
                <p className="font-medium text-ink-strong">Sign out</p>
                <p className="text-xs text-ink-muted">Log out of your WorkLink account</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                signOut()
                navigate('/login')
              }}
            >
              Sign out
            </Button>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionHeader title="Appearance" />
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Palette className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink-strong">Theme</p>
              <p className="text-xs text-ink-muted">Switch between light and dark mode</p>
            </div>
            <div className="flex rounded-xl border border-border bg-surface-muted p-1">
              {(['light', 'dark'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                    mode === m ? 'bg-surface text-ink-strong shadow-card' : 'text-ink-muted'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionHeader title="Notifications" />
        <Card className="divide-y divide-divider px-5">
          {notificationRows.map((row) => (
            <div key={row.key} className="flex items-center gap-3 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink-strong">{row.label}</p>
                <p className="text-xs text-ink-muted">{row.text}</p>
              </div>
              <Switch
                checked={notifications[row.key]}
                onChange={() => toggleNotification(row.key)}
              />
            </div>
          ))}
        </Card>
      </section>

      <section className="mt-6">
        <SectionHeader title="Demo controls" />
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-soft text-warning">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-strong">Switch demo role</p>
                  <DemoPill />
                </div>
                <p className="text-xs text-ink-muted">
                  Toggle between Sarah (Client) and John (Member) to walk the full journey.
                </p>
              </div>
            </div>
            <RoleSwitcher />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-divider pt-4">
            <div>
              <p className="font-medium text-ink-strong">Reset demo data</p>
              <p className="text-xs text-ink-muted">Restore all mock data to its original state</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                resetDemo()
                toast('Demo data reset.')
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}