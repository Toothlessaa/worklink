import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Pencil, ShieldCheck, Award, Star, MessageSquarePlus, Briefcase, Clock, BadgeCheck } from 'lucide-react'
import { VERIFICATION_LABELS } from '@worklink/constants'
import { useCurrentUser, useUser, useCredentialsForMember, useReviewsStore, useAuthStore, useJobsStore } from '@worklink/state'
import { Button, Card, Avatar, StarRating, Badge, Stat, SectionHeader, CredentialCard, EmptyState } from '../../../app/ui'
import { RatingSummary, ReviewList, LeaveReviewModal } from '../../reviews'
import { monthName } from '../../../shared/format'
import { toast } from '../../../shared/toast'

export function PublicProfileScreen() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const user = useUser(userId)
  const me = useCurrentUser()
  const credentials = useCredentialsForMember(userId ?? '')
  const reviews = useReviewsStore((s) => s.reviews).filter((r) => r.revieweeId === userId)
  const jobs = useJobsStore((s) => s.jobs)
  const [reviewModal, setReviewModal] = useState(false)

  if (!user) {
    return (
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="Profile not found"
        message="This user may have been removed."
        action={<Button onClick={() => navigate('/app')}>Back</Button>}
      />
    )
  }

  const isOwn = me?.id === user.id
  const completedWithUser = jobs.filter(
    (j) => j.status === 'completed' && (j.clientId === user.id || j.selectedMemberId === user.id),
  )
  const canReview = !isOwn

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="p-6 lg:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <Avatar user={user} size="xl" showVerified={user.verification === 'fullyVerified'} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">{user.name}</h1>
              {user.verification === 'fullyVerified' && (
                <Badge tone="success">
                  <ShieldCheck className="h-3.5 w-3.5" /> {VERIFICATION_LABELS.fullyVerified}
                </Badge>
              )}
              {user.verification === 'idVerified' && (
                <Badge tone="info">
                  <BadgeCheck className="h-3.5 w-3.5" /> {VERIFICATION_LABELS.idVerified}
                </Badge>
              )}
              {user.verification === 'email' && (
                <Badge tone="neutral">{VERIFICATION_LABELS.email}</Badge>
              )}
            </div>
            {user.profession && (
              <p className="mt-1 text-lg text-ink-soft">{user.profession}</p>
            )}
            <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
              <MapPin className="h-3.5 w-3.5" /> {user.location}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-6">
              {user.averageRating !== undefined && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <StarRating value={user.averageRating} />
                    <span className="font-semibold text-ink-strong">{user.averageRating.toFixed(1)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">Average rating</p>
                </div>
              )}
              {user.completedJobs !== undefined && (
                <Stat value={user.completedJobs} label="Jobs completed" />
              )}
              {user.experienceYears !== undefined && (
                <Stat value={`${user.experienceYears}y`} label="Experience" />
              )}
              <Stat value={monthName(user.joinedAt).split(' ')[0]} label="Member since" />
            </div>
          </div>
          {isOwn && (
            <Button variant="secondary" onClick={() => navigate('/app/profile/edit')}>
              <Pencil className="h-4 w-4" /> Edit profile
            </Button>
          )}
        </div>

        <div className="mt-6 border-t border-divider pt-5">
          <h2 className="font-semibold text-ink-strong">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{user.bio}</p>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="mt-5">
            <h2 className="font-semibold text-ink-strong">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <Badge key={s} tone="neutral">{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {user.role === 'member' && (
        <section className="mt-6">
          <SectionHeader
            title="Credentials"
            subtitle="Licenses, certifications, and training."
            action={
              isOwn ? (
                <Button variant="secondary" size="sm" onClick={() => navigate('/app/credentials')}>
                  <Award className="h-4 w-4" /> Manage
                </Button>
              ) : undefined
            }
          />
          {credentials.length === 0 ? (
            <Card className="p-6 text-center text-sm text-ink-muted">
              No credentials submitted yet.
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {credentials.map((c) => (
                <CredentialCard key={c.id} credential={c} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-6 space-y-6">
        <RatingSummary userId={userId ?? ''} reviews={reviews} />
        {reviews.length > 0 && <ReviewList reviews={reviews} />}
      </section>

      <div className="mt-6 flex justify-end">
        {canReview && (
          <Button onClick={() => setReviewModal(true)}>
            <MessageSquarePlus className="h-4 w-4" /> Leave a review
          </Button>
        )}
      </div>

      <LeaveReviewModal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        jobId={completedWithUser[0]?.id ?? ''}
        reviewerId={me?.id ?? ''}
        revieweeId={user.id}
        onSubmitted={() => toast('Review submitted! Thank you for sharing your experience.')}
      />
    </div>
  )
}