import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock, Users, CheckCircle, Briefcase, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { categoryLabel, CATEGORIES } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJob, useJobsStore, useUser, useConversationForJob } from '@worklink/state'
import { Button, Card, StatusChip, Avatar, StarRating, Badge, EmptyState, CategoryIcon, SectionHeader } from '../../../../app/ui'
import { formatMoney, timeAgo, formatDateFull, monthName } from '../../../../shared/format'
import { toast } from '../../../../shared/toast'

export function JobDetailsScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const job = useJob(id)
  const user = useCurrentUser()
  const expressInterest = useJobsStore((s) => s.expressInterest)
  const users = useAuthStore((s) => s.users)
  const client = useUser(job?.clientId)
  const conversation = useConversationForJob(id ?? '')

  if (!job) {
    return (
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="Job not found"
        message="This job may have been removed or is no longer available."
        action={<Button onClick={() => navigate('/app/jobs')}>Browse jobs</Button>}
      />
    )
  }

  const isInterested = job.interestedMemberIds.includes(user?.id ?? '')
  const isSelected = job.selectedMemberId === user?.id
  const isCompleted = job.status === 'completed'
  const isClient = job.clientId === user?.id

  const handleInterest = () => {
    if (!user) return
    expressInterest(job.id, user.id)
    toast('Interest sent! The client will be notified.')
  }

  const handleComplete = () => {
    useJobsStore.getState().markComplete(job.id)
    toast('Job marked as complete!')
  }

  const meta = CATEGORIES.find((c) => c.id === job.category)

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/app/jobs"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink-strong"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <CategoryIcon icon={meta?.icon ?? 'default'} className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">{job.title}</h1>
              <StatusChip status={job.status} />
            </div>
            <p className="mt-1 text-sm text-ink-soft">{meta?.label} · {job.location} · Posted {timeAgo(job.createdAt)}</p>
          </div>
        </div>
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

          {isSelected && !isCompleted && (
            <Card className="border-success/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-soft text-success">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-strong">You have been selected!</p>
                    <p className="text-sm text-ink-soft">{client?.name} chose you for this job.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {conversation && (
                    <Button variant="secondary" onClick={() => navigate(`/app/messenger/${conversation.id}`)}>
                      <MessageCircle className="h-4 w-4" /> Open conversation
                    </Button>
                  )}
                  <Button onClick={handleComplete}>
                    <CheckCircle2 className="h-4 w-4" /> Mark as Complete
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isCompleted && (
            <Card className="border-success/40 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-semibold text-ink-strong">Job Completed — Done Deal!</h3>
              <p className="mt-1 text-sm text-ink-soft">
                This job is complete. Check your Done Deal archive for the record.
              </p>
              <Button variant="secondary" className="mt-4" onClick={() => navigate('/app/done')}>
                View Done Deal
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {client && (
            <Card className="p-5">
              <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">Client</p>
              <div className="mt-3">
                <div className="flex items-center gap-3">
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
              </div>
            </Card>
          )}

          <Card className="p-5">
            <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">Interest</p>
            <div className="mt-3">
              {isInterested ? (
                <div className="rounded-xl bg-success-soft p-3 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
                  <p className="mt-1 font-semibold text-success">Interest sent!</p>
                  <p className="text-xs text-ink-soft">Waiting for the client's decision.</p>
                </div>
              ) : job.status === 'open' || job.status === 'reviewing' ? (
                <Button fullWidth onClick={handleInterest} size="lg">
                  <Sparkles className="h-4 w-4" /> I'm Interested
                </Button>
              ) : (
                <p className="text-sm text-ink-muted">This job is no longer accepting interest.</p>
              )}
              {job.interestedMemberIds.length > 0 && (
                <p className="mt-2 text-center text-xs text-ink-muted">
                  {job.interestedMemberIds.length} member{job.interestedMemberIds.length > 1 ? 's' : ''} interested
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}