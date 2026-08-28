import { create } from 'zustand'
import type { ThemeMode } from '@worklink/theme'
import { buildMockWorld } from '@worklink/mock'
import {
  useAuthStore,
  useJobsStore,
  useChatStore,
  useReviewsStore,
  useCredentialsStore,
  useSubscriptionStore,
} from './index'

export type NotificationKey = 'jobAlerts' | 'messages' | 'marketing'

export interface SettingsState {
  mode: ThemeMode
  notifications: Record<NotificationKey, boolean>
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  toggleNotification: (key: NotificationKey) => void
  resetDemo: () => void
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  mode: 'light',
  notifications: { jobAlerts: true, messages: true, marketing: false },
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
  toggleNotification: (key) =>
    set((s) => ({ notifications: { ...s.notifications, [key]: !s.notifications[key] } })),
  resetDemo: () => {
    const world = buildMockWorld()
    useAuthStore.getState().seed(structuredClone(world.users), null)
    useJobsStore.getState().seed(structuredClone(world.jobs), structuredClone(world.activity))
    useChatStore.getState().seed(structuredClone(world.conversations), structuredClone(world.messages))
    useReviewsStore.getState().seed(structuredClone(world.reviews))
    useCredentialsStore.getState().seed(structuredClone(world.credentials))
    useSubscriptionStore.getState().seed(structuredClone(world.subscriptions))
    set({ notifications: { jobAlerts: true, messages: true, marketing: false } })
  },
}))

export function useNotifications(): Record<NotificationKey, boolean> {
  return useSettingsStore((s) => s.notifications)
}