import { ScrollView, View, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { categoryLabel, CATEGORIES } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJob, useUser, useConversationForJob, selectMemberForJob } from '@worklink/state'
import { Card, Button, StatusChip, Avatar, Badge, Text, EmptyState, MemberCard } from '../../../../shared/ui'
import { formatMoney, timeAgo, formatDateFull, monthName } from '../../../../shared/format'
import { toast } from '../../../../shared/toast'

export function RequestDetailsScreen() {
  const t = useTheme()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const job = useJob(id)
  const user = useCurrentUser()
  const users = useAuthStore((s) => s.users)
  const conversation = useConversationForJob(id ?? '')
  const client = useUser(job?.clientId)

  if (!job) {
    return <EmptyState icon="briefcase-outline" title="Request not found" message="This job may have been removed." action={<Button onPress={() => router.back()}>Back</Button>} />
  }

  const interested = users.filter((u) => job.interestedMemberIds.includes(u.id))
  const selectedMember = users.find((u) => u.id === job.selectedMemberId)
  const meta = CATEGORIES.find((c) => c.id === job.category)

  const handleSelect = (memberId: string) => {
    selectMemberForJob(job.id, memberId)
    toast(`You selected ${users.find((u) => u.id === memberId)?.name}.`)
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(CATEGORIES.find((c) => c.id === job.category)?.icon === 'water' ? 'water-outline' : 'wrench-outline') as any} size={24} color={t.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Text variant="h1" style={{ fontSize: 20, flex: 1 }}>{job.title}</Text>
            <StatusChip status={job.status} />
          </View>
          <Text variant="caption">{meta?.label} · {job.location}</Text>
        </View>
      </View>

      <Card style={{ marginTop: 16 }}>
        <Text variant="h3">Job details</Text>
        <Text variant="body" style={{ marginTop: 8, lineHeight: 20 }}>{job.description}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          <View style={{ flex: 1, minWidth: 100, backgroundColor: t.colors.surfaceMuted, borderRadius: 12, padding: 12 }}>
            <Text variant="caption">Location</Text>
            <Text variant="label" style={{ fontSize: 13 }}>{job.location}</Text>
          </View>
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

      {job.status === 'inProgress' && selectedMember && (
        <Card style={{ borderWidth: 1, borderColor: t.colors.success, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar user={selectedMember} size="md" />
            <View style={{ flex: 1 }}>
              <Text variant="caption" style={{ color: t.colors.success, fontFamily: 'Inter_700Bold' }}>Selected member</Text>
              <Text variant="h3" style={{ fontSize: 15 }}>{selectedMember.name}</Text>
            </View>
            <Button size="sm" variant="secondary" onPress={() => conversation ? router.push(`/chat/${conversation.id}`) : undefined}>
              <Ionicons name="chatbubble-ellipses" size={14} color={t.colors.textPrimary} /> Chat
            </Button>
          </View>
        </Card>
      )}

      {job.status === 'completed' && (
        <Card style={{ borderWidth: 1, borderColor: t.colors.success, marginTop: 12, alignItems: 'center' }}>
          <Ionicons name="checkmark-circle" size={40} color={t.colors.success} />
          <Text variant="h3" style={{ marginTop: 8 }}>Job Completed — Done Deal!</Text>
          <Button variant="secondary" style={{ marginTop: 12 }} onPress={() => selectedMember && router.push(`/member/${selectedMember.id}`)}>
            Leave a review
          </Button>
        </Card>
      )}

      {job.status !== 'completed' && (
        <View style={{ marginTop: 16 }}>
          <Text variant="h3" style={{ marginBottom: 10 }}>Interested Members</Text>
          {interested.length === 0 ? (
            <Text variant="body" style={{ color: t.colors.textMuted }}>No members have expressed interest yet.</Text>
          ) : job.status === 'inProgress' && job.selectedMemberId ? (
            <View style={{ gap: 10 }}>
              {interested.map((m) => (
                <MemberCard key={m.id} member={m} isSelected={m.id === job.selectedMemberId} onViewProfile={() => router.push(`/member/${m.id}`)} />
              ))}
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {interested.map((m) => (
                <MemberCard key={m.id} member={m} onViewProfile={() => router.push(`/member/${m.id}`)} onSelect={() => handleSelect(m.id)} />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}