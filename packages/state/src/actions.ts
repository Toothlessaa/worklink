import { create } from 'zustand'
import type { Job } from '@worklink/types'
import { useJobsStore, useChatStore } from './index'

export function selectMemberForJob(jobId: string, memberId: string): void {
  useJobsStore.getState().selectMember(jobId, memberId)
  const job: Job | undefined = useJobsStore.getState().jobs.find((j) => j.id === jobId)
  if (job) {
    useChatStore.getState().ensureConversation(jobId, job.clientId, memberId)
  }
}

export function useConversationForJob(jobId: string) {
  const conversations = useChatStore((s) => s.conversations)
  return conversations.find((c) => c.jobId === jobId) ?? null
}

export { useJobsStore, useChatStore }