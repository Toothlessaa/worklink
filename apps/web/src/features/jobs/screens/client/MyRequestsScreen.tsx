import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Briefcase, Calendar, DollarSign, MapPin, Users, MessageCircle, CheckCircle2 } from 'lucide-react'
import { JOB_STATUS_ORDER } from '@worklink/constants'
import type { JobStatus } from '@worklink/types'
import { useCurrentUser, useJobsStore } from '@worklink/state'
import { Button, Card, Tabs, StatusChip, EmptyState, Skeleton, Avatar } from '../../../../app/ui'
import { formatMoney, timeAgo } from '../../../../shared/format'

const statusTabs: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  ...JOB_STATUS_ORDER.map((s) => ({ value: s as JobStatus | 'all', label: s === 'reviewing' ? 'Reviewing' : s === 'inProgress' ? 'In Progress' : s === 'completed' ? 'Completed' : 'Open' })),
]

function NextAction({ jobId, status }: { jobId: string; status: JobStatus }) {
  const navigate = useNavigate()
  if (status === 'open') {
    return (
      <Button size="sm" onClick={() => navigate(`/app/requests/${jobId}`)}>
        View request
      </Button>
    )
  }
  if (status === 'reviewing') {
    return (
      <Button size="sm" variant="secondary" onClick={() => navigate(`/app/requests/${jobId}`)}>
        <Users className="h-4 w-4" /> Review members
      </Button>
    )
  }
  if (status === 'inProgress') {
    return (
      <Button size="sm" variant="secondary" onClick={() => navigate(`/app/requests/${jobId}`)}>
        <MessageCircle className="h-4 w-4" /> Track progress
      </Button>
    )
  }
  return (
    <Button size="sm" variant="secondary" onClick={() => navigate(`/app/requests/${jobId}`)}>
      <CheckCircle2 className="h-4 w-4" /> View details
    </Button>
  )
}

export function MyRequestsScreen() {
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const myJobs = useMemo(() => {
    const list = jobs
      .filter((j) => j.clientId === user?.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return filter === 'all' ? list : list.filter((j) => j.status === filter)
  }, [jobs, user, filter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 }
    const mine = jobs.filter((j) => j.clientId === user?.id)
    c.all = mine.length
    for (const s of JOB_STATUS_ORDER) c[s] = mine.filter((j) => j.status === s).length
    return c
  }, [jobs, user])

  useMemo(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">My Requests</h1>
          <p className="mt-1 text-ink-soft">Every job you have posted, and what to do next.</p>
        </div>
        <Button onClick={() => navigate('/app/post')}>
          <PlusCircle className="h-4 w-4" /> Post a Job
        </Button>
      </div>

      <div className="mt-6">
        <Tabs
          options={statusTabs.map((t) => ({ ...t, count: counts[t.value] }))}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : myJobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title={filter === 'all' ? 'No job requests yet' : `No ${filter} requests`}
            message={
              filter === 'all'
                ? 'Post your first job request to start finding the right professional.'
                : 'Try another status filter to see more of your requests.'
            }
            action={
              filter === 'all' ? (
                <Button onClick={() => navigate('/app/post')}>
                  <PlusCircle className="h-4 w-4" /> Post a job
                </Button>
              ) : undefined
            }
          />
        ) : (
          myJobs.map((job) => (
            <Card key={job.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink-strong">{job.title}</h3>
                    <StatusChip status={job.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-ink-muted" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-ink-muted" />
                      {formatMoney(job.budget.amount, job.budget.type)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-ink-muted" />
                      {new Date(job.preferredDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-ink-muted">Posted {timeAgo(job.createdAt)}</span>
                  </div>
                  {job.interestedMemberIds.length > 0 && job.status !== 'completed' && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning">
                      <Users className="h-3.5 w-3.5" />
                      {job.interestedMemberIds.length} member{job.interestedMemberIds.length > 1 ? 's' : ''} interested
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <NextAction jobId={job.id} status={job.status} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}