import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Home,
  PlusCircle,
  Briefcase,
  MessageCircle,
  User,
  Search,
  CheckCircle2,
  Trophy,
  Award,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'
import { useAuthStore, useCurrentUser } from '@worklink/state'
import { cn, Logo, Avatar, RoleSwitcher, ThemeToggle, DemoPill, Button } from '../ui'

interface NavItem {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
}

const clientNav: NavItem[] = [
  { to: '/app/home', label: 'Home', icon: Home, end: true },
  { to: '/app/post', label: 'Post a Job', icon: PlusCircle },
  { to: '/app/requests', label: 'My Requests', icon: Briefcase },
  { to: '/app/messenger', label: 'Messenger', icon: MessageCircle },
  { to: '/app/profile', label: 'Profile', icon: User },
]

const memberNav: NavItem[] = [
  { to: '/app/discover', label: 'Find Jobs', icon: Search, end: true },
  { to: '/app/accepted', label: 'Accepted Jobs', icon: CheckCircle2 },
  { to: '/app/done', label: 'Done Deal', icon: Trophy },
  { to: '/app/messenger', label: 'Messenger', icon: MessageCircle },
  { to: '/app/credentials', label: 'Credentials', icon: Award },
  { to: '/app/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/app/profile', label: 'Profile', icon: User },
]

const clientBottomNav: NavItem[] = [
  { to: '/app/home', label: 'Home', icon: Home, end: true },
  { to: '/app/requests', label: 'Requests', icon: Briefcase },
  { to: '/app/messenger', label: 'Messages', icon: MessageCircle },
  { to: '/app/profile', label: 'Profile', icon: User },
]

const memberBottomNav: NavItem[] = [
  { to: '/app/discover', label: 'Discover', icon: Search, end: true },
  { to: '/app/accepted', label: 'Accepted', icon: CheckCircle2 },
  { to: '/app/done', label: 'Done Deal', icon: Trophy },
  { to: '/app/messenger', label: 'Messages', icon: MessageCircle },
  { to: '/app/profile', label: 'Profile', icon: User },
]

const secondaryNav: NavItem[] = [
  { to: '/app/credentials', label: 'Credentials', icon: Award },
  { to: '/app/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

function NavList({ variant = 'sidebar', onNavigate }: { variant?: 'sidebar' | 'drawer'; onNavigate?: () => void }) {
  const role = useAuthStore((s) => s.role)
  const nav = role === 'member' ? memberNav : clientNav
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)
  const items = variant === 'drawer' ? secondaryNav : nav

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-soft text-primary'
                : 'text-ink-soft hover:bg-surface-muted hover:text-ink-strong',
            )
          }
        >
          <item.icon className="h-4.5 w-4.5" />
          {item.label}
        </NavLink>
      ))}
      {variant === 'drawer' && (
        <div className="mt-4 border-t border-divider pt-3">
          <button
            onClick={() => {
              signOut()
              navigate('/login')
              onNavigate?.()
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-error-soft hover:text-error"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </div>
      )}
      {variant === 'sidebar' && (
        <div className="mt-auto space-y-1 border-t border-divider pt-3">
          <NavLink
            to="/app/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
          >
            <Settings className="h-4.5 w-4.5" />
            Settings
          </NavLink>
          <button
            onClick={() => {
              signOut()
              navigate('/login')
              onNavigate?.()
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-error-soft hover:text-error"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}

function UserCard() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  if (!user) return null
  return (
    <button
      onClick={() => navigate(`/app/profile/${user.id}`)}
      className="flex w-full items-center gap-3 rounded-xl border-t border-divider px-3 py-3 text-left transition-colors hover:bg-surface-muted"
    >
      <Avatar user={user} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-strong">{user.name}</p>
        <p className="truncate text-xs capitalize text-ink-muted">
          {user.role === 'member' ? (user.profession ?? 'Member') : 'Client'}
        </p>
      </div>
      <ChevronDown className="h-4 w-4 text-ink-muted" />
    </button>
  )
}

function BottomNav() {
  const role = useAuthStore((s) => s.role)
  const nav = role === 'member' ? memberBottomNav : clientBottomNav

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-divider bg-surface lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-16 items-stretch">
        {role === 'client' ? (
          <>
            {nav.slice(0, 2).map((item) => (
              <BottomNavItem key={item.to} item={item} />
            ))}
            <BottomNavPostButton />
            {nav.slice(2).map((item) => (
              <BottomNavItem key={item.to} item={item} />
            ))}
          </>
        ) : (
          nav.map((item) => <BottomNavItem key={item.to} item={item} />)
        )}
      </div>
    </nav>
  )
}

function BottomNavItem({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-colors',
          isActive ? 'text-primary' : 'text-ink-muted hover:text-ink-soft',
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn('h-5 w-5', isActive && 'fill-current')} />
          <span className="text-[10px] leading-tight font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

function BottomNavPostButton() {
  return (
    <NavLink to="/app/post" className="relative flex flex-1 items-start justify-center">
      {({ isActive }) => (
        <div
          className={cn(
            'flex h-13 w-13 -mt-4 items-center justify-center rounded-full shadow-pop transition-colors',
            isActive ? 'bg-primary-strong' : 'bg-primary',
          )}
        >
          <PlusCircle className="h-7 w-7 text-on-primary" />
        </div>
      )}
    </NavLink>
  )
}

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user = useCurrentUser()
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)
  const role = useAuthStore((s) => s.role)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex h-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-divider bg-surface lg:flex">
        <div className="px-5 py-5">
          <button onClick={() => navigate(role === 'member' ? '/app/discover' : '/app/home')}>
            <Logo />
          </button>
        </div>
        <NavList />
        <div className="px-3 pb-4">
          <UserCard />
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-pop">
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList variant="drawer" onNavigate={() => setDrawerOpen(false)} />
            <div className="px-3 pb-4">
              <UserCard />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-divider bg-background/90 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl border border-border bg-surface p-2 text-ink-soft lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-xs font-medium text-ink-soft">
              Connecting people with skilled workers
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-1.5 sm:flex">
              <DemoPill />
              <RoleSwitcher />
            </div>
            <ThemeToggle />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="rounded-xl border border-border bg-surface p-1.5 transition-colors hover:bg-surface-muted"
              >
                {user && <Avatar user={user} size="sm" />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface shadow-pop">
                  {user && (
                    <div className="border-b border-divider px-4 py-3">
                      <p className="font-semibold text-ink-strong">{user.name}</p>
                      <p className="text-xs text-ink-muted">{user.email}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate(`/app/profile/${user?.id}`)
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-muted"
                  >
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/app/settings')
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-muted"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      signOut()
                      navigate('/login')
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error-soft"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-20 lg:px-8 lg:py-8 lg:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}