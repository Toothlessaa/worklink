import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useAuthStore, useCurrentUser, useChatStore } from '@worklink/state'
import { Screen, Card, Text, ConversationItem, EmptyState } from '../../../shared/ui'

export function ConversationListScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const conversations = useChatStore((s) => s.conversations)
  const messages = useChatStore((s) => s.messages)
  const users = useAuthStore((s) => s.users)

  const sorted = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <Screen>
      <Text variant="h1">Messenger</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>Conversations from your jobs.</Text>
      <ScrollView style={{ marginTop: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {sorted.length === 0 ? (
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No conversations yet"
            message="When you select a member for a job, a conversation starts automatically."
          />
        ) : (
          <Card style={{ padding: 8 }}>
            {sorted.map((c) => {
              const other = users.find((u) => u.id === (c.clientId === user?.id ? c.memberId : c.clientId))
              const convoMessages = messages.filter((m) => m.conversationId === c.id)
              const lastMsg = convoMessages[convoMessages.length - 1]
              const unread = user ? c.unreadFor[user.id] ?? 0 : 0
              return (
                <ConversationItem
                  key={c.id}
                  otherUser={other}
                  lastMessage={lastMsg?.text}
                  unread={unread}
                  onPress={() => router.push(`/chat/${c.id}`)}
                />
              )
            })}
          </Card>
        )}
      </ScrollView>
    </Screen>
  )
}