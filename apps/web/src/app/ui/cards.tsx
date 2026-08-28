import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, DollarSign, Eye, MessageCircle, Star, CheckCircle, FileText, Upload, ExternalLink, ChevronRight, Clock, Plus, Shield, Award, Briefcase, Zap, Hammer, Droplets, Wrench, Paintbrush, Grid, Home, UserPlus, Check, AlertCircle, Hourglass, TrendingUp, CreditCard, Settings, LogOut, Bell, Sun, Moon, BookOpen, ThumbsUp, Camera, Paperclip, Search, X, Loader2, ChevronDown, ChevronUp, ArrowLeft, Send, MoreHorizontal, Users, BadgeCheck } from 'lucide-react'
import { JOB_STATUS_META, CATEGORIES, categoryLabel, SUBSCRIPTION_PLANS, planLabel } from '@worklink/constants'
import type { Job, User, Review, Credential as CredentialType, Conversation, Message, JobStatus, PlanId } from '@worklink/types'
import { useCurrentUser, useUser } from '@worklink/state'
import { cn, Card, Badge, StatusChip, Avatar, StarRating, Button, EmptyState, Skeleton, Stat, SectionHeader, DemoPill } from './primitives'
import { formatMoney, timeAgo, formatDate, formatDateFull, formatTime, initials } from '../../shared/format'

const categoryIcons: Record<string, typeof Droplets> = {
  water: Droplets,
  flash: Zap,
  hammer: Hammer,
  wrench: Wrench,
  paint: Paintbrush,
  grid: Grid,
  default: Home,
}

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = categoryIcons[icon] ?? categoryIcons.default
  return <Icon className={cn('h-5 w-5', className)} />
}

export function CategoryCard({ meta, onClick }: { meta: { id: string; label: string; tagline: string; icon: string }; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-primary-soft hover:border-primary/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <CategoryIcon icon={meta.icon} />
      </div>
      <span className="text-sm font-semibold text-ink-strong">{meta.label}</span>
      <span className="text-xs text-ink-muted">{meta.tagline}</span>
    </button>
  )
}

export function JobCard({
  job,
  user,
  isClientView,
  onClick,
}: {
  job: Job
  user?: Pick<User, 'name' | 'avatarHue' | 'verification'>
  isClientView?: boolean
  onClick?: () => void
}) {
  const meta = CATEGORIES.find((c) => c.id === job.category)
  return (
    <Card hover onClick={onClick} className="p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <CategoryIcon icon={meta?.icon ?? 'default'} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-ink-strong">{job.title}</h3>
              <p className="mt-0.5 text-xs text-ink-muted">{meta?.label} · {job.location}</p>
            </div>
            <StatusChip status={job.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{job.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {formatMoney(job.budget.amount, job.budget.type)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(job.preferredDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(job.createdAt)}
            </span>
            {!isClientView && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {job.interestedMemberIds.length} interested
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function MemberCard({
  member,
  onViewProfile,
  onSelect,
  isSelected,
}: {
  member: User
  onViewProfile?: () => void
  onSelect?: () => void
  isSelected?: boolean
}) {
  const credentials = member.skills?.slice(0, 2) ?? []
  return (
    <Card hover className="p-4">
      <div className="flex items-start gap-4">
        <Avatar user={member} size="lg" showVerified={member.verification === 'fullyVerified'} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-ink-strong">{member.name}</h3>
            {member.verification === 'fullyVerified' && <BadgeCheck className="h-4 w-4 text-primary" />}
          </div>
          <p className="text-sm text-ink-soft">{member.profession}</p>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={member.averageRating ?? 0} />
            <span className="text-xs font-medium text-ink-soft">{member.averageRating?.toFixed(1)}</span>
            <span className="text-xs text-ink-muted">({member.completedJobs} jobs)</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {member.skills?.slice(0, 3).map((s) => (
              <Badge key={s} tone="neutral">{s}</Badge>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {onViewProfile && (
            <Button variant="secondary" size="sm" onClick={onViewProfile}>
              View Profile
            </Button>
          )}
          {onSelect && !isSelected && (
            <Button variant="primary" size="sm" onClick={onSelect}>
              Select
            </Button>
          )}
          {isSelected && (
            <Badge tone="success">Selected</Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

export function ReviewCard({ review, reviewer }: { review: Review; reviewer: Pick<User, 'name' | 'avatarHue' | 'verification'> }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar user={reviewer} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink-strong">{reviewer.name}</span>
            <span className="text-xs text-ink-muted">{formatDateFull(review.createdAt)}</span>
          </div>
          <StarRating value={review.rating} />
          <p className="mt-1.5 text-sm text-ink-soft">{review.comment}</p>
        </div>
      </div>
    </Card>
  )
}

export function CredentialCard({ credential }: { credential: CredentialType }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {credential.status === 'verified' ? <Award className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-ink-strong">{credential.title}</h4>
            <Badge tone={credential.status === 'verified' ? 'success' : 'warning'}>
              {credential.status === 'verified' ? 'Verified' : 'Pending'}
            </Badge>
          </div>
          <p className="text-sm text-ink-soft">{credential.issuer}</p>
          {credential.number && <p className="text-xs text-ink-muted"># {credential.number}</p>}
          <p className="mt-1 text-xs text-ink-muted">
            Issued {formatDate(credential.issuedAt)}
            {credential.expiresAt && ` · Expires ${formatDate(credential.expiresAt)}`}
          </p>
        </div>
      </div>
    </Card>
  )
}

export function PlanCard({
  plan,
  isCurrent,
  onSelect,
}: {
  plan: typeof SUBSCRIPTION_PLANS[0]
  isCurrent?: boolean
  onSelect?: () => void
}) {
  return (
    <Card className={cn('relative p-6', plan.highlighted && 'ring-2 ring-primary')}>
      {plan.highlighted && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-on-primary">
          Recommended
        </span>
      )}
      <div className="text-center">
        <h3 className="text-lg font-bold text-ink-strong">{plan.name}</h3>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-ink-strong">${plan.price}</span>
          <span className="text-sm text-ink-muted">{plan.period}</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">{plan.tagline}</p>
      </div>
      <ul className="mt-4 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {isCurrent ? (
          <Button variant="secondary" fullWidth disabled>
            Current Plan
          </Button>
        ) : (
          <Button variant={plan.highlighted ? 'primary' : 'secondary'} fullWidth onClick={onSelect}>
            Choose {plan.name}
          </Button>
        )}
      </div>
    </Card>
  )
}

export function ConversationItem({
  conversation,
  otherUser,
  lastMessage,
  unread,
  active,
  onClick,
}: {
  conversation: Conversation
  otherUser: Pick<User, 'name' | 'avatarHue' | 'verification' | 'profession'>
  lastMessage?: string
  unread?: number
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border-b border-divider px-4 py-3 text-left transition-colors last:border-0',
        active ? 'bg-primary-soft' : 'hover:bg-surface-muted',
      )}
    >
      <Avatar user={otherUser} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium text-ink-strong">{otherUser.name}</span>
          <span className="shrink-0 text-xs text-ink-muted">{timeAgo(conversation.updatedAt)}</span>
        </div>
        <p className="truncate text-xs text-ink-soft">{otherUser.profession}</p>
        {lastMessage && <p className="mt-0.5 truncate text-sm text-ink-muted">{lastMessage}</p>}
      </div>
      {unread && unread > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-on-primary">
          {unread}
        </span>
      ) : null}
    </button>
  )
}

export function MessageBubble({
  message,
  isOwn,
}: {
  message: Message
  isOwn: boolean
}) {
  const isAttachment = message.kind === 'attachment'
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm',
          isOwn ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-muted text-ink-strong rounded-bl-md',
        )}
      >
        {isAttachment ? (
          <div className="flex items-center gap-2 text-ink-soft">
            <Paperclip className="h-4 w-4" />
            {message.text}
          </div>
        ) : (
          <p>{message.text}</p>
        )}
        <p className={cn('mt-1 text-right text-[10px]', isOwn ? 'text-on-primary/70' : 'text-ink-muted')}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

export function ActivityItem({
  type,
  jobTitle,
  userName,
  at,
}: {
  type: string
  jobTitle?: string
  userName?: string
  at: string
}) {
  const icons: Record<string, typeof Plus> = {
    jobCreated: Plus,
    interest: UserPlus,
    selected: CheckCircle,
    completed: Check,
    review: Star,
  }
  const Icon = icons[type] ?? Plus
  const labels: Record<string, string> = {
    jobCreated: 'Posted a new job',
    interest: 'expressed interest',
    selected: 'was selected for',
    completed: 'completed',
    review: 'left a review on',
  }
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink-strong">
          {userName && <span className="font-medium">{userName}</span>}{' '}
          <span className="text-ink-soft">{labels[type]}</span>
          {jobTitle && <span className="font-medium"> {jobTitle}</span>}
        </p>
        <p className="text-xs text-ink-muted">{timeAgo(at)}</p>
      </div>
    </div>
  )
}