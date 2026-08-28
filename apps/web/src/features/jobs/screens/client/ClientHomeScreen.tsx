import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, ArrowRight, Sparkles, Briefcase, Clock } from 'lucide-react'
import { CATEGORIES, JOB_STATUS_META } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJobsStore } from '@worklink/state'
import { Button, Card, SectionHeader, Avatar, StarRating, StatusChip, EmptyState, CategoryCard, ActivityItem, cn } from '../../../../app/ui'
import { timeAgo } from '../../../../shared/format'
import { toast } from '../../../../shared/toast'

export function ClientHomeScreen() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const activity = useJobsStore((s) => s.activity)
  const users = useAuthStore((s) => s.users)

  const myJobs = jobs.filter((j) => j.clientId === user?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const activeCount = myJobs.filter((j) => j.status !== 'completed').length
  const myActivity = activity
    .filter((a) => myJobs.some((j) => j.id === a.jobId))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)

  const recommended = users
    .filter((u) => u.role === 'member' && (u.averageRating ?? 0) >= 4.6)
    .slice(0, 3)

  const jobForActivity = (jobId?: string) => myJobs.find((j) => j.id === jobId)
  const userForId = (id?: string) => users.find((u) => u.id === id)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">
            {greeting}, {user?.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-ink-soft">
            {activeCount > 0
              ? `You have ${activeCount} active job request${activeCount > 1 ? 's' : ''}.`
              : 'Ready to get something done around the house?'}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-strong p-6 text-on-primary shadow-card lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold lg:text-2xl">Need a job done?</h2>
            <p className="mt-1 max-w-md text-sm text-on-primary/85">
              Post a request in under a minute and get matched with verified professionals in your area.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="!bg-white !text-primary hover:!bg-on-primary/90"
            onClick={() => navigate('/app/post')}
          >
            <PlusCircle className="h-5 w-5" />
            Post a Job Request
          </Button>
        </div>
      </div>

      <section>
        <SectionHeader title="What do you need done?" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} meta={c} onClick={() => navigate('/app/post')} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionHeader
            title="Your requests"
            subtitle="Follow what is happening with each job."
            action={
              <Link to="/app/requests" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {myJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No job requests yet"
              message="Post your first request to start finding the right professional."
              action={
                <Button onClick={() => navigate('/app/post')}>
                  <PlusCircle className="h-4 w-4" /> Post a job
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {myJobs.slice(0, 3).map((job) => (
                <Card key={job.id} hover className="p-4" onClick={() => navigate(`/app/requests/${job.id}`)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink-strong">{job.title}</h3>
                        <StatusChip status={job.status} />
                      </div>
                      <p className="mt-1 text-sm text-ink-soft">{job.location}</p>
                    </div>
                    <div className="shrink-0 text-right text-sm">
                      <p className="font-semibold text-ink-strong">${job.budget.amount.toLocaleString()}</p>
                      <p className="text-xs text-ink-muted">{timeAgo(job.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Recent activity" />
          <Card className="px-4 py-2">
            {myActivity.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-muted">No activity yet.</p>
            ) : (
              myActivity.map((a) => (
                <ActivityItem
                  key={a.id}
                  type={a.type}
                  jobTitle={jobForActivity(a.jobId)?.title}
                  userName={userForId(a.userId)?.name}
                  at={a.at}
                />
              ))
            )}
          </Card>
        </section>
      </div>

      <section>
        <SectionHeader
          title="Recommended professionals"
          subtitle="Top-rated members who can handle your kind of work."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {recommended.map((m) => (
            <Card key={m.id} hover className="p-5" onClick={() => navigate(`/app/profile/${m.id}`)}>
              <div className="flex flex-col items-center text-center">
                <Avatar user={m} size="xl" showVerified={m.verification === 'fullyVerified'} />
                <h3 className="mt-3 font-semibold text-ink-strong">{m.name}</h3>
                <p className="text-sm text-ink-soft">{m.profession}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <StarRating value={m.averageRating ?? 0} />
                  <span className="text-xs font-medium text-ink-soft">{m.averageRating?.toFixed(1)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">{m.completedJobs} jobs completed</p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate(`/app/profile/${m.id}`)}>
                  View profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}