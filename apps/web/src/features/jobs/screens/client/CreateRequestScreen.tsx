import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { CreateJobInput } from '@worklink/types'
import { useCurrentUser, useJobsStore } from '@worklink/state'
import { Card, Button } from '../../../../app/ui'
import { JobForm } from '../../components/JobForm'
import { toast } from '../../../../shared/toast'

export function CreateRequestScreen() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const createJob = useJobsStore((s) => s.createJob)

  const handleSubmit = (input: CreateJobInput) => {
    if (!user) return
    const job = createJob(input, user.id)
    toast('Job request posted! Members can now find it.')
    navigate(`/app/requests/${job.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/app/home"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink-strong"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
      <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Post a Job Request</h1>
      <p className="mt-1 text-ink-soft">
        Tell us what you need done. Professionals in your area will see it right away.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft p-4 text-sm text-primary">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        Your request will be visible to Members as soon as you post it.
      </div>

      <Card className="mt-6 p-6 lg:p-8">
        <JobForm submitLabel="Post Job Request" onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}