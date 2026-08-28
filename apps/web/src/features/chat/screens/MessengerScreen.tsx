import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageCircle, Paperclip, Send, ArrowLeft, ChevronDown, User } from 'lucide-react'
import { useAuthStore, useCurrentUser, useChatStore, useConversationMessages, useJob, useUser } from '@worklink/state'
import { Button, Card, Avatar, StatusChip, Input, EmptyState, ConversationItem, MessageBubble, DemoPill } from '../../../app/ui'
import { formatDate, formatTime } from '../../../shared/format'

export function MessengerScreen() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const user = useCurrentUser()
  const conversations = useChatStore((s) => s.conversations)
  const allMessages = useChatStore((s) => s.messages)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const sendAttachment = useChatStore((s) => s.sendAttachment)
  const markRead = useChatStore((s) => s.markRead)
  const users = useAuthStore((s) => s.users)
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const activeConvo = conversations.find((c) => c.id === conversationId)
  const messages = useConversationMessages(conversationId)
  const otherUserId = activeConvo
    ? activeConvo.clientId === user?.id
      ? activeConvo.memberId
      : activeConvo.clientId
    : undefined
  const otherUser = users.find((u) => u.id === otherUserId)
  const job = useJob(activeConvo?.jobId)

  useEffect(() => {
    if (conversationId && user) markRead(conversationId, user.id)
  }, [conversationId, user, markRead])

  const handleSend = () => {
    if (!text.trim() || !user || !activeConvo) return
    sendMessage(activeConvo.id, user.id, text.trim())
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAttachment = () => {
    if (!user || !activeConvo) return
    sendAttachment(activeConvo.id, user.id, 'Attached a photo')
  }

  const sorted = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const conversationList = (
    <div className="flex h-full flex-col">
      <div className="border-b border-divider px-4 py-3">
        <h2 className="font-semibold text-ink-strong">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto" ref={listRef}>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="mb-2 h-8 w-8 text-ink-muted" />
            <p className="text-sm font-medium text-ink-strong">No conversations yet</p>
            <p className="mt-1 text-xs text-ink-muted">
              When you select a member for a job, a conversation starts automatically.
            </p>
          </div>
        ) : (
          sorted.map((c) => {
            const other = users.find(
              (u) => u.id === (c.clientId === user?.id ? c.memberId : c.clientId),
            )
            const convoMessages = allMessages.filter((m) => m.conversationId === c.id)
            const lastMsg = convoMessages[convoMessages.length - 1] ?? null
            const unread = user ? (c.unreadFor[user.id] ?? 0) : 0
            return (
              <ConversationItem
                key={c.id}
                conversation={c}
                otherUser={other ?? { name: 'Unknown', avatarHue: 0, verification: 'email', profession: '' }}
                lastMessage={lastMsg?.text}
                unread={unread}
                active={c.id === conversationId}
                onClick={() => navigate(`/app/messenger/${c.id}`)}
              />
            )
          })
        )}
      </div>
    </div>
  )

  const conversationPanel = activeConvo && otherUser ? (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-divider px-4 py-3">
        <button onClick={() => navigate('/app/messenger')} className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar user={otherUser} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink-strong">{otherUser.name}</p>
          <p className="truncate text-xs text-ink-soft">{otherUser.profession}</p>
        </div>
        <button
          onClick={() => navigate(`/app/profile/${otherUser.id}`)}
          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-muted"
        >
          <User className="h-5 w-5" />
        </button>
      </div>

      {job && (
        <div className="flex items-center gap-2 border-b border-divider bg-primary-soft px-4 py-2 text-xs font-medium text-primary">
          <MessageCircle className="h-3.5 w-3.5" />
          Connected via: {job.title}
          <StatusChip status={job.status} />
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="mb-2 h-8 w-8 text-ink-muted" />
            <p className="text-sm font-medium text-ink-strong">Start the conversation</p>
            <p className="mt-1 text-xs text-ink-muted">
              This is the beginning of your conversation.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} message={m} isOwn={m.senderId === user?.id} />
          ))
        )}
      </div>

      <div className="flex items-end gap-2 border-t border-divider px-4 py-3">
        <button
          onClick={handleAttachment}
          className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-surface-muted"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="max-w-none"
          />
        </div>
        <Button onClick={handleSend} disabled={!text.trim()} icon={<Send className="h-4 w-4" />} />
      </div>
    </div>
  ) : null

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="hidden w-80 shrink-0 border-r border-divider sm:block">
        {conversationList}
      </div>
      <div className="flex-1 sm:hidden">
        {conversationId ? conversationPanel : conversationList}
      </div>
      <div className="hidden flex-1 sm:block">
        {conversationPanel ?? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <MessageCircle className="h-12 w-12 text-ink-muted" />
            <p className="font-semibold text-ink-strong">Select a conversation</p>
            <p className="max-w-xs text-sm text-ink-muted">
              Choose a conversation from the list to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}