import { create } from 'zustand'
import type { Conversation, Message } from '@worklink/types'
import { buildMockWorld } from '@worklink/mock'
import { uid } from './auth'

const world = buildMockWorld()

export interface ChatState {
  conversations: Conversation[]
  messages: Message[]
  seed: (conversations: Conversation[], messages: Message[]) => void
  ensureConversation: (jobId: string, clientId: string, memberId: string) => Conversation
  sendMessage: (conversationId: string, senderId: string, text: string) => void
  sendAttachment: (conversationId: string, senderId: string, label: string) => void
  markRead: (conversationId: string, userId: string) => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: structuredClone(world.conversations),
  messages: structuredClone(world.messages),
  seed: (conversations, messages) => set({ conversations, messages }),
  ensureConversation: (jobId, clientId, memberId) => {
    const existing = get().conversations.find(
      (c) => c.jobId === jobId && c.clientId === clientId && c.memberId === memberId,
    )
    if (existing) return existing
    const now = new Date().toISOString()
    const conversation: Conversation = {
      id: uid('c'),
      jobId,
      clientId,
      memberId,
      createdAt: now,
      updatedAt: now,
      unreadFor: { [clientId]: 0, [memberId]: 0 },
    }
    set((s) => ({ conversations: [...s.conversations, conversation] }))
    return conversation
  },
  sendMessage: (conversationId, senderId, text) => {
    const message: Message = {
      id: uid('m'),
      conversationId,
      senderId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      kind: 'text',
    }
    set((s) => ({
      messages: [...s.messages, message],
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              updatedAt: new Date().toISOString(),
              unreadFor: {
                ...c.unreadFor,
                [c.clientId === senderId ? c.memberId : c.clientId]:
                  (c.unreadFor[c.clientId === senderId ? c.memberId : c.clientId] ?? 0) + 1,
              },
            }
          : c,
      ),
    }))
  },
  sendAttachment: (conversationId, senderId, label) => {
    const message: Message = {
      id: uid('m'),
      conversationId,
      senderId,
      text: label,
      createdAt: new Date().toISOString(),
      kind: 'attachment',
    }
    set((s) => ({
      messages: [...s.messages, message],
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              updatedAt: new Date().toISOString(),
              unreadFor: {
                ...c.unreadFor,
                [c.clientId === senderId ? c.memberId : c.clientId]:
                  (c.unreadFor[c.clientId === senderId ? c.memberId : c.clientId] ?? 0) + 1,
              },
            }
          : c,
      ),
    }))
  },
  markRead: (conversationId, userId) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadFor: { ...c.unreadFor, [userId]: 0 } } : c,
      ),
    }))
  },
}))

export function useConversationMessages(conversationId: string | undefined): Message[] {
  const messages = useChatStore((s) => s.messages)
  return messages.filter((m) => m.conversationId === conversationId)
}