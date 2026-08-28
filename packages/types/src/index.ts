export type Role = 'client' | 'member'

export type JobStatus = 'open' | 'reviewing' | 'inProgress' | 'completed'

export type CategoryId =
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'homeRepair'
  | 'painting'
  | 'other'

export type CredentialCategory =
  | 'license'
  | 'certification'
  | 'training'
  | 'verification'

export type CredentialStatus = 'verified' | 'pending'

export type VerificationLevel = 'email' | 'idVerified' | 'fullyVerified'

export type PlanId = 'basic' | 'pro' | 'premium'

export interface User {
  id: string
  role: Role
  name: string
  email: string
  location: string
  bio: string
  joinedAt: string
  avatarHue: number
  verification: VerificationLevel
  profession?: string
  skills?: string[]
  rate?: string
  experienceYears?: number
  completedJobs?: number
  averageRating?: number
}

export interface JobBudget {
  type: 'fixed' | 'hourly'
  amount: number
}

export interface Job {
  id: string
  clientId: string
  title: string
  category: CategoryId
  description: string
  location: string
  preferredDate: string
  budget: JobBudget
  createdAt: string
  completedAt?: string
  status: JobStatus
  interestedMemberIds: string[]
  selectedMemberId?: string
  photoCount: number
}

export interface Credential {
  id: string
  memberId: string
  category: CredentialCategory
  title: string
  issuer: string
  number?: string
  issuedAt: string
  expiresAt?: string
  status: CredentialStatus
}

export interface Review {
  id: string
  jobId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Conversation {
  id: string
  jobId: string
  clientId: string
  memberId: string
  createdAt: string
  updatedAt: string
  unreadFor: Record<string, number>
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
  kind: 'text' | 'attachment'
}

export type ActivityType = 'jobCreated' | 'interest' | 'selected' | 'completed' | 'review'

export interface ActivityEvent {
  id: string
  type: ActivityType
  jobId?: string
  userId?: string
  at: string
}

export interface SubscriptionPlan {
  id: PlanId
  name: string
  price: number
  period: string
  tagline: string
  features: string[]
  highlighted?: boolean
}

export interface CreateJobInput {
  title: string
  category: CategoryId
  description: string
  location: string
  preferredDate: string
  budget: JobBudget
  photoCount: number
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  location: string
  role: Role
  profession?: string
}
