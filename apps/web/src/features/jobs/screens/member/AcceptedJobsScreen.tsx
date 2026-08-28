import { useNavigate } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Briefcase } from 'lucide-react'
import { useAuthStore, useCurrentUser, useJobsStore, useChatStore } from '@worklink/state'
import { Button, Card, StatusChip, EmptyState } from '../../../../app/ui'

export function AcceptedJobsScreen() {
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const conversations = useChatStore((s) => s.conversations)
  const navigate = useNavigate()

  const accepted = jobs
    .filter((j) => j.selectedMemberId === user?.id && j.status !== 'completed')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const active = accepted.find((j) => j.status === 'inProgress')

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Accepted Jobs</h1>
      <p className="mt-1 text-ink-soft">Jobs where a client chose you.</p>

      {active && (
        <div className="mt-6 rounded-3xl bg-gradient-to-r from-success to-emerald-600 p-6 text-white shadow-card lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">You have been selected!</p>
                <h2 className="text-xl font-bold">{active.title}</h2>
              </div>
            </div>
            <Button
              variant="secondary"
              className="!bg-white !text-success"
              onClick={() => navigate(`/app/jobs/${active.id}`)}
            >
              View job details
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {accepted.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title="No accepted jobs yet"
            message="When a client selects you for a job, it will show up here."
            action={
              <Button onClick={() => navigate('/app/jobs')}>
                Browse available jobs
              </Button>
            }
          />
        ) : (
          accepted.map((job) => {
            const conversation = conversations.find((c) => c.jobId === job.id)
            return (
              <Card key={job.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink-strong">{job.title}</h3>
                      <StatusChip status={job.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{job.location}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {conversation && (
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/app/messenger/${conversation.id}`)}
                      >
                        <MessageCircle className="h-4 w-4" /> Message
                      </Button>
                    )}
                    <Button onClick={() => navigate(`/app/jobs/${job.id}`)}>View</Button>
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