import { create } from 'zustand'
import type { Review, Credential, PlanId } from '@worklink/types'
import { buildMockWorld } from '@worklink/mock'
import { uid } from './auth'

const world = buildMockWorld()

export interface ReviewsState {
  reviews: Review[]
  seed: (reviews: Review[]) => void
  addReview: (input: {
    jobId: string
    reviewerId: string
    revieweeId: string
    rating: number
    comment: string
  }) => void
  hasReviewed: (jobId: string, userId: string) => boolean
}

export const useReviewsStore = create<ReviewsState>()((set, get) => ({
  reviews: structuredClone(world.reviews),
  seed: (reviews) => set({ reviews }),
  addReview: (input) => {
    const review: Review = {
      id: uid('r'),
      jobId: input.jobId,
      reviewerId: input.reviewerId,
      revieweeId: input.revieweeId,
      rating: input.rating,
      comment: input.comment.trim(),
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ reviews: [...s.reviews, review] }))
  },
  hasReviewed: (jobId, userId) =>
    get().reviews.some((r) => r.jobId === jobId && r.reviewerId === userId),
}))

export function useReviewsForUser(userId: string): Review[] {
  const reviews = useReviewsStore((s) => s.reviews)
  return reviews.filter((r) => r.revieweeId === userId)
}

export function useAverageRating(userId: string): number | null {
  const reviews = useReviewsForUser(userId)
  if (reviews.length === 0) return null
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export interface CredentialsState {
  credentials: Credential[]
  seed: (credentials: Credential[]) => void
  addCredential: (input: Omit<Credential, 'id' | 'status'>) => Credential
  verifyCredential: (id: string) => void
}

export const useCredentialsStore = create<CredentialsState>()((set) => ({
  credentials: structuredClone(world.credentials),
  seed: (credentials) => set({ credentials }),
  addCredential: (input) => {
    const credential: Credential = {
      ...input,
      id: uid('c'),
      status: 'pending',
    }
    set((s) => ({ credentials: [...s.credentials, credential] }))
    return credential
  },
  verifyCredential: (id) => {
    set((s) => ({
      credentials: s.credentials.map((c) =>
        c.id === id ? { ...c, status: 'verified' } : c,
      ),
    }))
  },
}))

export function useCredentialsForMember(memberId: string): Credential[] {
  const credentials = useCredentialsStore((s) => s.credentials)
  return credentials.filter((c) => c.memberId === memberId)
}

export interface SubscriptionState {
  subscriptions: Record<string, PlanId>
  seed: (subscriptions: Record<string, PlanId>) => void
  setPlan: (memberId: string, plan: PlanId) => void
}

export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  subscriptions: structuredClone(world.subscriptions),
  seed: (subscriptions) => set({ subscriptions }),
  setPlan: (memberId, plan) =>
    set((s) => ({ subscriptions: { ...s.subscriptions, [memberId]: plan } })),
}))

export function useCurrentPlan(memberId: string): PlanId {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  return subscriptions[memberId] ?? 'basic'
}