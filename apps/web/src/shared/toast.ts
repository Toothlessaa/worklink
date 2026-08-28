import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  tone: 'success' | 'error' | 'info'
}

let toastSeq = 0

interface ToastState {
  toasts: Toast[]
  show: (message: string, tone?: Toast['tone']) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show: (message, tone = 'success') => {
    toastSeq += 1
    const id = `t-${toastSeq}`
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3200)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function toast(message: string, tone: Toast['tone'] = 'success') {
  useToastStore.getState().show(message, tone)
}