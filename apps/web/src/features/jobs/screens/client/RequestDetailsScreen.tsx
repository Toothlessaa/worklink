import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Pencil,
  MessageCircle,
  Star,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react'
import { categoryLabel, CATEGORIES } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJob, useUser, useConversationForJob, selectMemberForJob } from '@worklink/state'
import { Button, Card, SectionHeader, StatusChip, Avatar, Badge, EmptyState, MemberCard, CategoryIcon } from '../../../../app/ui'
import { formatMoney, timeAgo, formatDateFull, monthName } from '../../../../shared/format'
import { toast } from '../../../../shared/toast'

export function RequestDetailsScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const job = useJob(id)
  const user = useCurrentUser()
  const users = useAuthStore((s) => s.users)
  const conversation = useConversationForJob(id ?? '')
  const client = useUser(job?.clientId)

  if (!job) {
    return (
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="Request not found"
        message="This job request may have been removed."
        action={<Button onClick={() => navigate('/app/requests')}>Back to My Requests</Button>}
      />
    )
  }

  const isOwner = user?.id === job.clientId
  const interested = users.filter((u) => job.interestedMemberIds.includes(u.id))
  const selectedMember = users.find((u) => u.id === job.selectedMemberId)

  const handleSelect = (memberId: string) => {
    selectMemberForJob(job.id, memberId)
    toast(`You selected ${users.find((u) => u.id === memberId)?.name}. You are now connected through chat.`)
  }

  const canEdit = job.status === 'open'

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/app/requests"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink-strong"
      >
        <ArrowLeft className="h-4 w-4" /> My Requests
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <CategoryIcon icon={CATEGORIES.find((c) => c.id === job.category)?.icon ?? 'default'} className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">{job.title}</h1>
              <StatusChip status={job.status} />
            </div>
            <p className="mt-1 text-sm text-ink-soft">{categoryLabel(job.category)}</p>
          </div>
        </div>
        {canEdit && isOwner && (
          <Button variant="secondary" onClick={() => navigate(`/app/requests/${job.id}/edit`)}>
            <Pencil className="h-4 w-4" /> Edit request
          </Button>
        )}
        {!canEdit && isOwner && (
          <Badge tone="neutral">
            <Clock className="h-3.5 w-3.5" /> Editing locked — request is {job.status === 'reviewing' ? 'being reviewed' : 'in progress'}
          </Badge>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="font-semibold text-ink-strong">Job details</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{job.description}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                <MapPin className="h-5 w-5 text-ink-muted" />
                <div>
                  <p className="text-xs text-ink-muted">Location</p>
                  <p className="text-sm font-medium text-ink-strong">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                <Calendar className="h-5 w-5 text-ink-muted" />
                <div>
                  <p className="text-xs text-ink-muted">Preferred date</p>
                  <p className="text-sm font-medium text-ink-strong">{formatDateFull(job.preferredDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                <DollarSign className="h-5 w-5 text-ink-muted" />
                <div>
                  <p className="text-xs text-ink-muted">Budget</p>
                  <p className="text-sm font-medium text-ink-strong">
                    {formatMoney(job.budget.amount, job.budget.type)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                <Clock className="h-5 w-5 text-ink-muted" />
                <div>
                  <p className="text-xs text-ink-muted">Posted</p>
                  <p className="text-sm font-medium text-ink-strong">{timeAgo(job.createdAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          {job.status === 'inProgress' && selectedMember && (
            <Card className="border-success/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar user={selectedMember} size="lg" showVerified={selectedMember.verification === 'fullyVerified'} />
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-success uppercase">Selected member</p>
                    <h3 className="font-semibold text-ink-strong">{selectedMember.name}</h3>
                    <p className="text-sm text-ink-soft">{selectedMember.profession}</p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    conversation
                      ? navigate(`/app/messenger/${conversation.id}`)
                      : navigate('/app/messenger')
                  }
                >
                  <MessageCircle className="h-4 w-4" /> Open conversation
                </Button>
              </div>
            </Card>
          )}

          {job.status === 'completed' && (
            <Card className="border-success/40 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-semibold text-ink-strong">Job completed — Done Deal!</h3>
              <p className="mt-1 text-sm text-ink-soft">
                {selectedMember?.name} completed this job. Leave a rating and review to share your experience.
              </p>
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={() => navigate(`/app/profile/${selectedMember?.id}`)}>
                  <Star className="h-4 w-4" /> Review {selectedMember?.name.split(' ')[0]}
                </Button>
              </div>
            </Card>
          )}

          {isOwner && job.status !== 'completed' && (
            <Card className="p-6">
              <h2 className="font-semibold text-ink-strong">Interested Members</h2>
              {interested.length === 0 ? (
                <p className="mt-2 text-sm text-ink-muted">
                  No members have expressed interest yet. New requests are usually seen quickly.
                </p>
              ) : job.status === 'inProgress' && job.selectedMemberId ? (
                <div className="mt-4 space-y-3">
                  {interested.map((m) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      isSelected={m.id === job.selectedMemberId}
                      onViewProfile={() => navigate(`/app/profile/${m.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {interested.map((m) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      onViewProfile={() => navigate(`/app/profile/${m.id}`)}
                      onSelect={() => handleSelect(m.id)}
                    />
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {client && (
            <Card className="p-5">
              <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">Posted by</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar user={client} size="lg" />
                <div>
                  <p className="font-semibold text-ink-strong">{client.name}</p>
                  <p className="text-xs text-ink-muted">{client.location}</p>
                </div>
                {client.verification !== 'email' && (
                  <Badge tone="success">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </Badge>
                )}
              </div>
              <p className="mt-3 text-xs text-ink-muted">Member since {monthName(client.joinedAt)}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}