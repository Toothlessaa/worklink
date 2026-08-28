import { useState } from 'react'
import { Star, MessageSquarePlus } from 'lucide-react'
import type { Review, User } from '@worklink/types'
import { useAuthStore, useReviewsStore, useJobsStore, useUser } from '@worklink/state'
import { Card, Avatar, StarRating, RatingBar, EmptyState, Button, Field, Textarea, Modal, Badge } from '../../../app/ui'
import { formatDateFull } from '../../../shared/format'

export function RatingSummary({ userId, reviews }: { userId: string; reviews: Review[] }) {
  const avg = reviews.length
    ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10
    : 0
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-ink-strong">Ratings & Reviews</h2>
      {reviews.length === 0 ? (
        <div className="mt-4 flex flex-col items-center py-6 text-center">
          <Star className="h-8 w-8 text-ink-muted" />
          <p className="mt-2 font-medium text-ink-strong">No reviews yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Reviews from completed jobs will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="text-center">
            <p className="text-4xl font-bold text-ink-strong">{avg.toFixed(1)}</p>
            <div className="mt-1 flex justify-center">
              <StarRating value={avg} />
            </div>
            <p className="mt-1 text-xs text-ink-muted">{reviews.length} reviews</p>
          </div>
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <RatingBar key={d.star} label={String(d.star)} value={d.count} max={reviews.length} />
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const users = useAuthStore((s) => s.users)
  const jobs = useJobsStore((s) => s.jobs)
  if (reviews.length === 0) return null
  return (
    <div className="space-y-3">
      {reviews.map((r) => {
        const reviewer = users.find((u) => u.id === r.reviewerId)
        const job = jobs.find((j) => j.id === r.jobId)
        return (
          <Card key={r.id} className="p-5">
            <div className="flex items-start gap-3">
              {reviewer && <Avatar user={reviewer} size="sm" />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink-strong">{reviewer?.name ?? 'Reviewer'}</span>
                  <Badge tone="neutral">{job?.title}</Badge>
                  <span className="ml-auto text-xs text-ink-muted">{formatDateFull(r.createdAt)}</span>
                </div>
                <div className="mt-1">
                  <StarRating value={r.rating} size={14} />
                </div>
                <p className="mt-2 text-sm text-ink-soft">{r.comment}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export function LeaveReviewModal({
  open,
  onClose,
  jobId,
  reviewerId,
  revieweeId,
  onSubmitted,
}: {
  open: boolean
  onClose: () => void
  jobId: string
  reviewerId: string
  revieweeId: string
  onSubmitted?: () => void
}) {
  const addReview = useReviewsStore((s) => s.addReview)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const reviewee = useUser(revieweeId)

  const handleSubmit = () => {
    if (rating === 0) return
    addReview({ jobId, reviewerId, revieweeId, rating, comment })
    onSubmitted?.()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Review ${reviewee?.name ?? 'this user'}`}>
      <div className="flex flex-col items-center gap-3 py-2">
        <StarRating value={rating} size={32} interactive onChange={setRating} />
        <p className="text-sm text-ink-soft">
          {rating === 0 ? 'Tap a star to rate' : `You rated ${rating} out of 5`}
        </p>
      </div>
      <Field label="Your review" hint="Share what it was like working together.">
        <Textarea
          rows={4}
          placeholder="How was the work? How was the experience?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Field>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button disabled={rating === 0} onClick={handleSubmit}>
          <MessageSquarePlus className="h-4 w-4" /> Submit review
        </Button>
      </div>
    </Modal>
  )
}