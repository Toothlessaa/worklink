import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import type { CreateJobInput } from '@worklink/types'
import { useJob, useJobsStore } from '@worklink/state'
import { Card, Button, StatusChip, EmptyState } from '../../../../app/ui'
import { JobForm } from '../../components/JobForm'
import { toast } from '../../../../shared/toast'

export function EditRequestScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const job = useJob(id)
  const updateJob = useJobsStore((s) => s.updateJob)

  if (!job) {
    return (
      <EmptyState
        icon={<Lock className="h-6 w-6" />}
        title="Request not found"
        message="This job request may have been removed."
        action={<Button onClick={() => navigate('/app/requests')}>Back to My Requests</Button>}
      />
    )
  }

  const handleSubmit = (input: CreateJobInput) => {
    updateJob(job.id, input)
    toast('Request updated successfully.')
    navigate(`/app/requests/${job.id}`)
  }

  if (job.status !== 'open') {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          to={`/app/requests/${job.id}`}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink-strong"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <EmptyState
          icon={<Lock className="h-6 w-6" />}
          title="This request can no longer be edited"
          message={`The request is currently ${job.status === 'reviewing' ? 'being reviewed by interested members' : 'in progress'}. Editing is only available while a request is Open.`}
          action={
            <Button onClick={() => navigate(`/app/requests/${job.id}`)}>
              View request details
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to={`/app/requests/${job.id}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink-strong"
      >
        <ArrowLeft className="h-4 w-4" /> Back to request
      </Link>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Edit Request</h1>
        <StatusChip status={job.status} />
      </div>
      <p className="mt-1 text-ink-soft">
        Update the details below. Changes are visible to Members immediately.
      </p>
      <Card className="mt-6 p-6 lg:p-8">
        <JobForm initial={job} submitLabel="Save Changes" onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}