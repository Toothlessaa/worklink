import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { BadgeCheck, Star, StarHalf, Sun, Moon, X, Check, Loader2 } from 'lucide-react'
import { JOB_STATUS_META } from '@worklink/constants'
import type { JobStatus } from '@worklink/types'
import type { Tone } from '@worklink/theme'
import type { User } from '@worklink/types'
import { useAuthStore } from '@worklink/state'
import { useSettingsStore } from '@worklink/state'
import { useToastStore } from '../../shared/toast'
import { initials } from '../../shared/format'

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

const toneBadge: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  error: 'bg-error-soft text-error',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-muted text-ink-soft',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneBadge[tone],
      )}
    >
      {children}
    </span>
  )
}

export function StatusChip({ status }: { status: JobStatus }) {
  const meta = JOB_STATUS_META[status]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-strong',
  secondary: 'bg-surface text-ink-strong border border-border hover:bg-surface-muted',
  ghost: 'text-ink-strong hover:bg-surface-muted',
  danger: 'bg-error text-white hover:opacity-90',
  success: 'bg-success text-white hover:opacity-90',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  )
}

export function Card({
  className,
  children,
  hover,
  onClick,
}: {
  className?: string
  children: ReactNode
  hover?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-border bg-surface shadow-card',
        hover && 'transition-shadow hover:shadow-pop',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-ink-strong">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Avatar({
  user,
  size = 'md',
  showVerified = false,
  className,
}: {
  user: Pick<User, 'name' | 'avatarHue' | 'verification'>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showVerified?: boolean
  className?: string
}) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' }
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold text-white select-none',
          sizes[size],
        )}
        style={{ backgroundColor: `hsl(${user.avatarHue} 52% 45%)` }}
      >
        {initials(user.name)}
      </div>
      {showVerified && (
        <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-surface p-0.5">
          <BadgeCheck className="h-4 w-4 text-primary" />
        </span>
      )}
    </div>
  )
}

export function StarRating({
  value,
  size = 16,
  interactive,
  onChange,
}: {
  value: number
  size?: number
  interactive?: boolean
  onChange?: (v: number) => void
}) {
  const rounded = Math.round(value)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          className={cn(!interactive && 'cursor-default')}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              i <= rounded ? 'text-rating' : 'text-border',
              i <= rounded && 'fill-rating',
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function RatingBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-3 text-xs font-medium text-ink-soft">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-rating"
          style={{ width: `${max === 0 ? 0 : (value / max) * 100}%` }}
        />
      </div>
      <span className="w-6 text-right text-xs text-ink-muted">{value}</span>
    </div>
  )
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink-strong">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

export function Input({
  className,
  error,
  icon,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean; icon?: ReactNode }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted">
          {icon}
        </span>
      )}
      <input
        className={cn(
          'w-full rounded-xl border bg-surface py-2.5 text-sm text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          error ? 'border-error' : 'border-border',
          icon ? 'pl-10' : 'pl-3.5',
          'pr-3.5',
          className,
        )}
        {...rest}
      />
    </div>
  )
}

export function Textarea({
  className,
  error,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary/30',
        error ? 'border-error' : 'border-border',
        className,
      )}
      {...rest}
    />
  )
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink-strong focus:outline-none focus:ring-2 focus:ring-primary/30',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            value === o.value
              ? 'border-primary bg-primary-soft text-primary'
              : 'border-border bg-surface text-ink-soft hover:bg-surface-muted',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
            value === o.value ? 'bg-surface text-ink-strong shadow-card' : 'text-ink-muted hover:text-ink-soft',
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="text-xs text-ink-muted">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full rounded-2xl bg-surface p-6 shadow-pop',
          wide ? 'max-w-2xl' : 'max-w-lg',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-bold text-ink-strong">{title}</h3>}
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-ink-strong">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>
      </div>
      {action}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-surface-muted', className)} />
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold text-ink-strong">{value}</div>
      <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
    </div>
  )
}

export function Logo({ size = 'md', light }: { size?: 'md' | 'lg'; light?: boolean }) {
  const box = size === 'lg' ? 'h-10 w-10 rounded-xl text-xl' : 'h-8 w-8 rounded-lg text-base'
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn('flex items-center justify-center bg-primary font-bold text-on-primary', box)}>
        W
      </div>
      <span
        className={cn(
          'font-bold tracking-tight',
          size === 'lg' ? 'text-2xl' : 'text-lg',
          light ? 'text-white' : 'text-ink-strong',
        )}
      >
        WorkLink
      </span>
    </div>
  )
}

export function GradientButton({
  onClick,
  type = 'button',
  loading,
  disabled,
  children,
  className,
  fullWidth,
}: {
  onClick?: () => void
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
  children?: ReactNode
  className?: string
  fullWidth?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-strong px-6 py-4 text-base font-bold text-on-primary shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
    </button>
  )
}

export function WorkLinkLogo({ size = 72 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[22px] bg-gradient-to-br from-primary to-primary-strong shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 48 48" fill="none">
        <path
          d="M9 35 L16 13 L24 29 L32 13 L39 35"
          stroke="#FFFFFF"
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={16} cy={13} r={3.6} fill="#FFFFFF" />
        <circle cx={32} cy={13} r={3.6} fill="#FFFFFF" />
      </svg>
    </div>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSettingsStore((s) => s.mode)
  const toggleMode = useSettingsStore((s) => s.toggleMode)
  return (
    <button
      onClick={toggleMode}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-ink-soft shadow-sm transition-all hover:bg-surface-muted',
        className,
      )}
      aria-label="Toggle theme"
    >
      {mode === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
    </button>
  )
}

export function RoleSwitcher({ className }: { className?: string }) {
  const currentUserId = useAuthStore((s) => s.currentUserId)
  const switchTo = useAuthStore((s) => s.switchTo)
  const demoClientId = useAuthStore((s) => s.demoClientId)
  const demoMemberId = useAuthStore((s) => s.demoMemberId)
  return (
    <div className={cn('flex items-center gap-1 rounded-xl border border-border bg-surface p-1', className)}>
      <button
        onClick={() => switchTo(demoClientId)}
        className={cn(
          'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
          currentUserId === demoClientId ? 'bg-primary text-on-primary' : 'text-ink-muted hover:text-ink-strong',
        )}
      >
        Sarah · Client
      </button>
      <button
        onClick={() => switchTo(demoMemberId)}
        className={cn(
          'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
          currentUserId === demoMemberId ? 'bg-primary text-on-primary' : 'text-ink-muted hover:text-ink-strong',
        )}
      >
        John · Member
      </button>
    </div>
  )
}

export function DemoPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-warning uppercase">
      Demo
    </span>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  const tones = {
    success: 'border-success/30 bg-success-soft text-success',
    error: 'border-error/30 bg-error-soft text-error',
    info: 'border-info/30 bg-info-soft text-info',
  }
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-pop',
            tones[t.tone],
          )}
        >
          {t.tone === 'success' && <Check className="h-4 w-4" />}
          {t.message}
          <button onClick={() => dismiss(t.id)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}