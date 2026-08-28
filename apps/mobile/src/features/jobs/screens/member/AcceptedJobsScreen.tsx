import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useCurrentUser, useJobsStore, useChatStore } from '@worklink/state'
import { Card, Button, StatusChip, Text, EmptyState } from '../../../../shared/ui'

export function AcceptedJobsScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const conversations = useChatStore((s) => s.conversations)

  const accepted = jobs
    .filter((j) => j.selectedMemberId === user?.id && j.status !== 'completed')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const active = accepted.find((j) => j.status === 'inProgress')

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text variant="h1">Accepted Jobs</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>Jobs where a client chose you.</Text>

      {active && (
        <View style={{ borderRadius: 24, backgroundColor: t.colors.success, padding: 20, marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFFCC', fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>You have been selected!</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter_700Bold' }}>{active.title}</Text>
            </View>
          </View>
          <Button
            style={{ marginTop: 14, backgroundColor: '#FFFFFF', borderWidth: 0 }}
            onPress={() => router.push(`/job/${active.id}`)}
          >
            <Text style={{ color: t.colors.success, fontFamily: 'Inter_700Bold' }}>View job details</Text>
          </Button>
        </View>
      )}

      <View style={{ gap: 10, marginTop: 16 }}>
        {accepted.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title="No accepted jobs yet"
            message="When a client selects you, it shows up here."
            action={<Button size="sm" onPress={() => router.push('/jobs')}>Browse jobs</Button>}
          />
        ) : (
          accepted.map((job) => {
            const conversation = conversations.find((c) => c.jobId === job.id)
            return (
              <Card key={job.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Text variant="h3" style={{ fontSize: 15 }} numberOfLines={1}>{job.title}</Text>
                      <StatusChip status={job.status} />
                    </View>
                    <Text variant="caption" style={{ marginTop: 4 }}>{job.location}</Text>
                  </View>
                  <Button size="sm" onPress={() => router.push(`/job/${job.id}`)}>View</Button>
                </View>
                {conversation && (
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ marginTop: 10 }}
                    onPress={() => router.push(`/chat/${conversation.id}`)}
                  >
                    <Ionicons name="chatbubble-ellipses" size={14} color={t.colors.textPrimary} /> Message
                  </Button>
                )}
              </Card>
            )
          })
        )}
      </View>
    </ScrollView>
  )
}