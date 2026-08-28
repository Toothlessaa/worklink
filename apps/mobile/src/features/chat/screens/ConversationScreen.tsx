import { useEffect, useRef, useState } from 'react'
import { View, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useAuthStore, useCurrentUser, useChatStore, useConversationMessages, useJob, useUser } from '@worklink/state'
import { Avatar, Text, StatusChip, MessageBubble, Button } from '../../../shared/ui'

export function ConversationScreen() {
  const t = useTheme()
  const router = useRouter()
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>()
  const user = useCurrentUser()
  const conversations = useChatStore((s) => s.conversations)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const sendAttachment = useChatStore((s) => s.sendAttachment)
  const markRead = useChatStore((s) => s.markRead)
  const users = useAuthStore((s) => s.users)
  const messages = useConversationMessages(conversationId)
  const [text, setText] = useState('')
  const scrollRef = useRef<any>(null)

  const convo = conversations.find((c) => c.id === conversationId)
  const otherUserId = convo
    ? convo.clientId === user?.id
      ? convo.memberId
      : convo.clientId
    : undefined
  const otherUser = users.find((u) => u.id === otherUserId)
  const job = useJob(convo?.jobId)

  useEffect(() => {
    if (conversationId && user) markRead(conversationId, user.id)
  }, [conversationId, user, markRead])

  const handleSend = () => {
    if (!text.trim() || !user || !convo) return
    sendMessage(convo.id, user.id, text.trim())
    setText('')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: t.colors.divider }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={22} color={t.colors.textPrimary} />
        </Pressable>
        {otherUser && <Avatar user={otherUser} size="sm" />}
        <View style={{ flex: 1 }}>
          <Text variant="label" style={{ fontSize: 15 }}>{otherUser?.name}</Text>
          <Text variant="caption">{otherUser?.profession}</Text>
        </View>
        {otherUser && (
          <Pressable onPress={() => router.push(`/member/${otherUser.id}`)} style={{ padding: 4 }}>
            <Ionicons name="person-circle-outline" size={24} color={t.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {job && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.colors.primarySoft, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Ionicons name="briefcase" size={14} color={t.colors.primary} />
          <Text variant="caption" style={{ color: t.colors.primary, flex: 1 }} numberOfLines={1}>
            Connected via: {job.title}
          </Text>
          <StatusChip status={job.status} />
        </View>
      )}

      <View style={{ flex: 1, padding: 16 }}>
        {messages.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="chatbubble-ellipses-outline" size={36} color={t.colors.textMuted} />
            <Text variant="body" style={{ color: t.colors.textMuted, marginTop: 8, textAlign: 'center' }}>
              This is the beginning of your conversation.
            </Text>
          </View>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} isOwn={m.senderId === user?.id} />)
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.colors.divider }}>
        <Pressable
          onPress={() => {
            if (user && convo) sendAttachment(convo.id, user.id, 'Attached a photo')
          }}
          style={{ padding: 8 }}
        >
          <Ionicons name="attach" size={22} color={t.colors.textMuted} />
        </Pressable>
        <TextInput
          style={{
            flex: 1,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: t.colors.border,
            backgroundColor: t.colors.surface,
            paddingHorizontal: 14,
            paddingVertical: 8,
            fontSize: 15,
            fontFamily: 'Inter_400Regular',
            color: t.colors.textPrimary,
          }}
          placeholder="Type a message..."
          placeholderTextColor={t.colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: text.trim() ? t.colors.primary : t.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}