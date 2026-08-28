import { ScrollView, View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { CATEGORIES } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJob, useJobsStore, useUser, useConversationForJob } from '@worklink/state'
import { Card, Button, StatusChip, Avatar, Badge, Text, EmptyState } from '../../../../shared/ui'
import { formatMoney, timeAgo, formatDateFull, monthName } from '../../../../shared/format'
import { toast } from '../../../../shared/toast'

export function JobDetailsScreen() {
  const t = useTheme()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const job = useJob(id)
  const user = useCurrentUser()
  const expressInterest = useJobsStore((s) => s.expressInterest)
  const users = useAuthStore((s) => s.users)
  const client = useUser(job?.clientId)
  const conversation = useConversationForJob(id ?? '')

  if (!job) {
    return <EmptyState icon="briefcase-outline" title="Job not found" message="This job may have been removed." action={<Button onPress={() => router.back()}>Back</Button>} />
  }

  const isInterested = job.interestedMemberIds.includes(user?.id ?? '')
  const isSelected = job.selectedMemberId === user?.id
  const isCompleted = job.status === 'completed'
  const meta = CATEGORIES.find((c) => c.id === job.category)

  const handleInterest = () => {
    if (!user) return
    expressInterest(job.id, user.id)
    toast('Interest sent! The client will be notified.')
  }

  const handleComplete = () => {
    useJobsStore.getState().markComplete(job.id)
    toast('Job marked as complete!')
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(meta?.icon === 'water' ? 'water-outline' : 'wrench-outline') as any} size={24} color={t.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Text variant="h1" style={{ fontSize: 20, flex: 1 }}>{job.title}</Text>
            <StatusChip status={job.status} />
          </View>
          <Text variant="caption">{meta?.label} · {job.location} · {timeAgo(job.createdAt)}</Text>
        </View>
      </View>

      <Card style={{ marginTop: 16 }}>
        <Text variant="h3">Job details</Text>
        <Text variant="body" style={{ marginTop: 8, lineHeight: 20 }}>{job.description}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          <View style={{ flex: 1, minWidth: 100, backgroundColor: t.colors.surfaceMuted, borderRadius: 12, padding: 12 }}>
            <Text variant="caption">Budget</Text>
            <Text variant="label" style={{ fontSize: 13 }}>{formatMoney(job.budget.amount, job.budget.type)}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 100, backgroundColor: t.colors.surfaceMuted, borderRadius: 12, padding: 12 }}>
            <Text variant="caption">Date</Text>
            <Text variant="label" style={{ fontSize: 13 }}>{formatDateFull(job.preferredDate)}</Text>
          </View>
        </View>
      </Card>

      {client && (
        <Card style={{ marginTop: 12 }}>
          <Text variant="caption" style={{ fontFamily: 'Inter_700Bold', letterSpacing: 0.5 }}>CLIENT</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <Avatar user={client} size="md" />
            <View style={{ flex: 1 }}>
              <Text variant="h3" style={{ fontSize: 15 }}>{client.name}</Text>
              <Text variant="caption">{client.location} · Member since {monthName(client.joinedAt)}</Text>
            </View>
            {client.verification !== 'email' && (
              <Badge tone="success">Verified</Badge>
            )}
          </View>
        </Card>
      )}

      {isSelected && !isCompleted && (
        <Card style={{ borderWidth: 1, borderColor: t.colors.success, marginTop: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={36} color={t.colors.success} />
            <Text variant="h3" style={{ marginTop: 6 }}>You have been selected!</Text>
            <Text variant="caption">{client?.name} chose you for this job.</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              {conversation && (
                <Button variant="secondary" onPress={() => router.push(`/chat/${conversation.id}`)}>
                  <Ionicons name="chatbubble-ellipses" size={14} color={t.colors.textPrimary} /> Message
                </Button>
              )}
              <Button onPress={handleComplete}>Mark as Complete</Button>
            </View>
          </View>
        </Card>
      )}

      {isCompleted && (
        <Card style={{ borderWidth: 1, borderColor: t.colors.success, marginTop: 12, alignItems: 'center' }}>
          <Ionicons name="checkmark-circle" size={40} color={t.colors.success} />
          <Text variant="h3" style={{ marginTop: 8 }}>Job Completed — Done Deal!</Text>
        </Card>
      )}

      <Card style={{ marginTop: 12, alignItems: 'center' }}>
        {isInterested ? (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={28} color={t.colors.success} />
            <Text variant="h3" style={{ color: t.colors.success, marginTop: 6 }}>Interest sent!</Text>
            <Text variant="caption">Waiting for the client's decision.</Text>
          </View>
        ) : job.status === 'open' || job.status === 'reviewing' ? (
          <Button size="lg" fullWidth onPress={handleInterest}>
            <Ionicons name="sparkles" size={18} color="#FFFFFF" /> I'm Interested
          </Button>
        ) : (
          <Text variant="body" style={{ color: t.colors.textMuted }}>This job is no longer accepting interest.</Text>
        )}
        {job.interestedMemberIds.length > 0 && (
          <Text variant="caption" style={{ marginTop: 8 }}>
            {job.interestedMemberIds.length} member{job.interestedMemberIds.length > 1 ? 's' : ''} interested
          </Text>
        )}
      </Card>
    </ScrollView>
  )
}