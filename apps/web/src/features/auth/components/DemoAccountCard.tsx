import { ChevronRight } from 'lucide-react'
import { initials } from '../../../shared/format'

export function DemoAccountCard({
  name,
  initialsText,
  avatarColor,
  subtitle,
  onPress,
}: {
  name: string
  initialsText: string
  avatarColor: string
  subtitle: string
  onPress: () => void
}) {
  return (
    <button
      onClick={onPress}
      aria-label={`Continue as ${name}, ${subtitle}`}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-left transition-all hover:bg-surface-muted active:scale-[0.985]"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: avatarColor }}
      >
        {initialsText}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-strong">{name}</p>
        <p className="text-xs text-ink-muted">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" />
    </button>
  )
}
