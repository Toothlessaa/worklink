import { create } from 'zustand'
import type { RegisterInput, User, Role } from '@worklink/types'
import { buildMockWorld, DEMO_CLIENT_ID, DEMO_MEMBER_ID, isoDaysFromNow } from '@worklink/mock'

let seq = 0
export function uid(prefix: string): string {
  seq += 1
  return `${prefix}-${Date.now().toString(36)}-${seq}`
}

const world = buildMockWorld()

export interface AuthState {
  users: User[]
  currentUserId: string | null
  demoClientId: string
  demoMemberId: string
  seed: (users: User[], currentUserId: string | null) => void
  login: (email: string) => string | null
  register: (input: RegisterInput) => User
  updateProfile: (
    userId: string,
    patch: Partial<Pick<User, 'name' | 'profession' | 'location' | 'rate' | 'bio' | 'skills'>>,
  ) => void
  switchTo: (userId: string) => void
  signOut: () => void
  role: Role | null
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  users: structuredClone(world.users),
  currentUserId: null,
  demoClientId: DEMO_CLIENT_ID,
  demoMemberId: DEMO_MEMBER_ID,
  role: null,
  seed: (users, currentUserId) => set({ users, currentUserId, role: users.find((u) => u.id === currentUserId)?.role ?? null }),
  login: (email) => {
    const user = get().users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (!user) return 'No account found with that email.'
    set({ currentUserId: user.id, role: user.role })
    return null
  },
  register: (input) => {
    const user: User = {
      id: uid('u'),
      role: input.role,
      name: input.name.trim(),
      email: input.email.trim(),
      location: input.location.trim() || 'Maplewood, NJ',
      bio:
        input.role === 'member'
          ? 'New professional on WorkLink building a reputation one job at a time.'
          : 'New to WorkLink, ready to find the right person for the job.',
      joinedAt: isoDaysFromNow(0, 8),
      avatarHue: Math.floor(Math.random() * 360),
      verification: 'email',
      profession: input.profession?.trim() || undefined,
      skills: input.role === 'member' ? [] : undefined,
      completedJobs: input.role === 'member' ? 0 : undefined,
      averageRating: input.role === 'member' ? undefined : undefined,
      experienceYears: input.role === 'member' ? 0 : undefined,
    }
    set((s) => ({
      users: [...s.users, user],
      currentUserId: user.id,
      role: user.role,
    }))
    return user
  },
  switchTo: (userId) => {
    const user = get().users.find((u) => u.id === userId)
    if (user) set({ currentUserId: user.id, role: user.role })
  },
  updateProfile: (userId, patch) => {
    set((s) => ({
      users: s.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
    }))
  },
  signOut: () => set({ currentUserId: null, role: null }),
}))

export function useCurrentUser(): User | null {
  const currentUserId = useAuthStore((s) => s.currentUserId)
  const users = useAuthStore((s) => s.users)
  return users.find((u) => u.id === currentUserId) ?? null
}

export function useUser(id: string | undefined): User | null {
  const users = useAuthStore((s) => s.users)
  return users.find((u) => u.id === id) ?? null
}

export const authSelectors = {
  getUser: (users: User[], id: string | null): User | null =>
    users.find((u) => u.id === id) ?? null,
}