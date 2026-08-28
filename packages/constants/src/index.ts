import type {
  CategoryId,
  JobStatus,
  PlanId,
  SubscriptionPlan,
  VerificationLevel,
} from '@worklink/types'
import type { Tone } from '@worklink/theme'

export interface CategoryMeta {
  id: CategoryId
  label: string
  tagline: string
  icon: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'plumbing', label: 'Plumbing', tagline: 'Pipes, faucets, leaks', icon: 'water' },
  { id: 'electrical', label: 'Electrical', tagline: 'Wiring, fans, fixtures', icon: 'flash' },
  { id: 'carpentry', label: 'Carpentry', tagline: 'Cabinets, trim, doors', icon: 'hammer' },
  { id: 'homeRepair', label: 'Home Repair', tagline: 'Fixes and maintenance', icon: 'wrench' },
  { id: 'painting', label: 'Painting', tagline: 'Walls and finishes', icon: 'paint' },
  { id: 'other', label: 'Other Services', tagline: 'Anything else', icon: 'grid' },
]

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Other'
}

export const JOB_STATUS_META: Record<JobStatus, { label: string; tone: Tone }> = {
  open: { label: 'Open', tone: 'primary' },
  reviewing: { label: 'Reviewing Members', tone: 'warning' },
  inProgress: { label: 'In Progress', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
}

export const JOB_STATUS_ORDER: JobStatus[] = ['open', 'reviewing', 'inProgress', 'completed']

export const VERIFICATION_LABELS: Record<VerificationLevel, string> = {
  email: 'Email verified',
  idVerified: 'ID verified',
  fullyVerified: 'Fully verified',
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: '/mo',
    tagline: 'Get started with a standard profile',
    features: [
      'Standard profile page',
      'Browse available jobs',
      'Limited job opportunities',
      'Standard search placement',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    period: '/mo',
    tagline: 'More jobs, more visibility',
    highlighted: true,
    features: [
      'Everything in Basic',
      'More job opportunities',
      'Increased profile visibility',
      'Additional profile features',
      'Priority interest placement',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39,
    period: '/mo',
    tagline: 'The most for active professionals',
    features: [
      'Everything in Pro',
      'Priority visibility',
      'Premium badge',
      'Maximum job opportunities',
      'Top search placement',
    ],
  },
]

export function planLabel(id: PlanId): string {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id)?.name ?? 'Basic'
}

export const BUDGET_PRESETS = [50, 100, 150, 200, 300, 500, 800, 1000, 1500, 2000]

export const LOCATION_PRESETS = [
  'Maplewood',
  'South Orange',
  'West Orange',
  'Montclair',
  'Bloomfield',
  'Irvington',
  'Newark',
]

export const SKILL_SUGGESTIONS = [
  'Pipe repair',
  'Faucets and fixtures',
  'Water heaters',
  'Drain cleaning',
  'Wiring and outlets',
  'Ceiling fans',
  'Lighting',
  'Electrical panels',
  'Custom cabinets',
  'Furniture building',
  'Trim and molding',
  'Doors and frames',
  'Drywall',
  'Painting and finishes',
  'Caulking',
  'Minor home repairs',
]
