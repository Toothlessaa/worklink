import { Link, useNavigate } from 'react-router-dom'
import { Search, Sparkles, Briefcase, TrendingUp, ArrowRight, Clock, DollarSign, MapPin } from 'lucide-react'
import { CATEGORIES } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJobsStore, useUser } from '@worklink/state'
import { Button, Card, SectionHeader, Avatar, StarRating, StatusChip, JobCard, CategoryCard, EmptyState, Input } from '../../../../app/ui'
import { formatMoney, timeAgo } from '../../../../shared/format'

export function JobDiscoveryScreen() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const users = useAuthStore((s) => s.users)

  const openJobs = jobs.filter((j) => j.status === 'open' || j.status === 'reviewing')
  const recommended = openJobs
    .filter((j) => user?.skills?.some((s) => j.description.toLowerCase().includes(s.slice(0, 6).toLowerCase())))
    .slice(0, 3)
  const recent = [...openJobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

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
            {openJobs.length > 0
              ? `There are ${openJobs.length} jobs available right now.`
              : 'No open jobs at the moment. Check back soon.'}
          </p>
        </div>
        <Link to="/app/jobs" className="hidden sm:block">
          <Button variant="secondary">
            <Search className="h-4 w-4" /> Browse all jobs
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-strong p-6 text-on-primary shadow-card lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold lg:text-2xl">Looking for work?</h2>
            <p className="mt-1 max-w-md text-sm text-on-primary/85">
              Browse available jobs, express interest, and get hired by clients who need your skills.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="!bg-white !text-primary hover:!bg-on-primary/90"
            onClick={() => navigate('/app/jobs')}
          >
            <Search className="h-5 w-5" />
            Browse all jobs
          </Button>
        </div>
      </div>

      <section>
        <SectionHeader
          title="Recommended for you"
          subtitle="Based on your skills and profile."
        />
        {recommended.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-ink-muted">
              Update your profile with your skills to get personalized job recommendations.
            </p>
            <Button variant="secondary" className="mt-3" onClick={() => navigate('/app/profile/edit')}>
              Edit profile
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => navigate(`/app/jobs/${job.id}`)} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Recently posted"
          action={
            <Link to="/app/jobs" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="space-y-3">
          {recent.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/app/jobs/${job.id}`)} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Browse by category" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} meta={c} onClick={() => navigate('/app/jobs')} />
          ))}
        </div>
      </section>
    </div>
  )
}