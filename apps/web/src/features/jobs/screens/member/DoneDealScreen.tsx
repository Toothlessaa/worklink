import { useNavigate } from 'react-router-dom'
import { Trophy, Star, MessageSquarePlus, CalendarCheck2 } from 'lucide-react'
import { useAuthStore, useCurrentUser, useJobsStore, useUser, useReviewsStore } from '@worklink/state'
import { Button, Card, StatusChip, Avatar, EmptyState, Badge } from '../../../../app/ui'
import { formatDateShort } from '../../../../shared/format'

export function DoneDealScreen() {
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const users = useAuthStore((s) => s.users)
  const reviews = useReviewsStore((s) => s.reviews)
  const navigate = useNavigate()

  const done = jobs
    .filter((j) => j.selectedMemberId === user?.id && j.status === 'completed')
    .sort((a, b) => (b.completedAt ?? b.createdAt).localeCompare(a.completedAt ?? a.createdAt))

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Done Deal</h1>
          <p className="mt-1 text-ink-soft">Your completed jobs and professional history.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-success-soft px-4 py-2 text-sm font-semibold text-success">
          <Trophy className="h-5 w-5" />
          {done.length} job{done.length !== 1 ? 's' : ''} completed
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {done.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-6 w-6" />}
            title="No completed jobs yet"
            message="Completed jobs will appear here with their ratings and review status."
          />
        ) : (
          done.map((job) => {
            const client = users.find((u) => u.id === job.clientId)
            const review = reviews.find((r) => r.jobId === job.id && r.reviewerId === user?.id)
            const rating = reviews.find((r) => r.jobId === job.id && r.revieweeId === user?.id)
            return (
              <Card key={job.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink-strong">{job.title}</h3>
                      <StatusChip status={job.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                      {client && (
                        <span className="flex items-center gap-2">
                          <Avatar user={client} size="sm" />
                          {client.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-ink-muted">
                        <CalendarCheck2 className="h-3.5 w-3.5" />
                        Completed {job.completedAt ? formatDateShort(job.completedAt) : 'Recently'}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 space-y-2 text-right">
                    {rating ? (
                      <Badge tone="success">
                        <Star className="h-3.5 w-3.5" /> {rating.rating}.0 received
                      </Badge>
                    ) : (
                      <Badge tone="neutral">No rating yet</Badge>
                    )}
                    {review ? (
                      <Badge tone="success">Review submitted</Badge>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/app/profile/${job.clientId}`)}>
                        <MessageSquarePlus className="h-4 w-4" /> Leave a review
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}