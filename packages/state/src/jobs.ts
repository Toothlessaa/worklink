import { create } from 'zustand'
import type { Job, CreateJobInput, ActivityEvent, JobStatus } from '@worklink/types'
import { buildMockWorld, isoDaysFromNow } from '@worklink/mock'
import { uid } from './auth'

const world = buildMockWorld()

export interface JobsState {
  jobs: Job[]
  activity: ActivityEvent[]
  createJob: (input: CreateJobInput, clientId: string) => Job
  updateJob: (id: string, patch: Partial<CreateJobInput>) => void
  expressInterest: (jobId: string, memberId: string) => void
  selectMember: (jobId: string, memberId: string) => void
  markComplete: (jobId: string) => void
  seed: (jobs: Job[], activity: ActivityEvent[]) => void
}

export const useJobsStore = create<JobsState>()((set, get) => ({
  jobs: structuredClone(world.jobs),
  activity: structuredClone(world.activity),
  createJob: (input, clientId) => {
    const job: Job = {
      id: uid('j'),
      clientId,
      title: input.title.trim(),
      category: input.category,
      description: input.description.trim(),
      location: input.location.trim(),
      preferredDate: input.preferredDate,
      budget: { ...input.budget },
      createdAt: new Date().toISOString(),
      status: 'open',
      interestedMemberIds: [],
      photoCount: input.photoCount,
    }
    const event: ActivityEvent = {
      id: uid('a'),
      type: 'jobCreated',
      jobId: job.id,
      userId: clientId,
      at: new Date().toISOString(),
    }
    set((s) => ({ jobs: [...s.jobs, job], activity: [...s.activity, event] }))
    return job
  },
  updateJob: (id, patch) => {
    set((s) => ({
      jobs: s.jobs.map((j) => {
        if (j.id !== id || j.status !== 'open') return j
        return {
          ...j,
          ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
          ...(patch.category !== undefined ? { category: patch.category } : {}),
          ...(patch.description !== undefined ? { description: patch.description.trim() } : {}),
          ...(patch.location !== undefined ? { location: patch.location.trim() } : {}),
          ...(patch.preferredDate !== undefined ? { preferredDate: patch.preferredDate } : {}),
          ...(patch.budget !== undefined ? { budget: { ...patch.budget } } : {}),
          ...(patch.photoCount !== undefined ? { photoCount: patch.photoCount } : {}),
        }
      }),
    }))
  },
  expressInterest: (jobId, memberId) => {
    set((s) => {
      const job = s.jobs.find((j) => j.id === jobId)
      if (!job || job.interestedMemberIds.includes(memberId)) return s
      const newStatus: JobStatus = job.status === 'open' ? 'reviewing' : job.status
      const event: ActivityEvent = {
        id: uid('a'),
        type: 'interest',
        jobId,
        userId: memberId,
        at: new Date().toISOString(),
      }
      return {
        jobs: s.jobs.map((j) =>
          j.id === jobId
            ? { ...j, interestedMemberIds: [...j.interestedMemberIds, memberId], status: newStatus }
            : j,
        ),
        activity: [...s.activity, event],
      }
    })
  },
  selectMember: (jobId, memberId) => {
    set((s) => {
      const job = s.jobs.find((j) => j.id === jobId)
      if (!job) return s
      const event: ActivityEvent = {
        id: uid('a'),
        type: 'selected',
        jobId,
        userId: memberId,
        at: new Date().toISOString(),
      }
      return {
        jobs: s.jobs.map((j) =>
          j.id === jobId ? { ...j, selectedMemberId: memberId, status: 'inProgress' as JobStatus } : j,
        ),
        activity: [...s.activity, event],
      }
    })
  },
  markComplete: (jobId) => {
    const event: ActivityEvent = {
      id: uid('a'),
      type: 'completed',
      jobId,
      at: new Date().toISOString(),
    }
    set((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === jobId ? { ...j, status: 'completed' as JobStatus, completedAt: new Date().toISOString() } : j,
      ),
      activity: [...s.activity, event],
    }))
  },
  seed: (jobs, activity) => set({ jobs, activity }),
}))

export function useJob(id: string | undefined): Job | null {
  const jobs = useJobsStore((s) => s.jobs)
  return jobs.find((j) => j.id === id) ?? null
}