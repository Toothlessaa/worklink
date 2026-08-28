import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useCurrentUser, useJobsStore, useAuthStore, useReviewsStore } from '@worklink/state'
import { Card, StatusChip, Avatar, Text, Badge, Button, EmptyState } from '../../../../shared/ui'
import { formatDateShort } from '../../../../shared/format'

export function DoneDealScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const users = useAuthStore((s) => s.users)
  const reviews = useReviewsStore((s) => s.reviews)

  const done = jobs
    .filter((j) => j.selectedMemberId === user?.id && j.status === 'completed')
    .sort((a, b) => (b.completedAt ?? b.createdAt).localeCompare(a.completedAt ?? a.createdAt))

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text variant="h1">Done Deal</Text>
          <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>Your completed jobs.</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: t.colors.successSoft, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Ionicons name="trophy" size={18} color={t.colors.success} />
          <Text style={{ color: t.colors.success, fontFamily: 'Inter_700Bold', fontSize: 14 }}>{done.length}</Text>
        </View>
      </View>

      <View style={{ gap: 10, marginTop: 16 }}>
        {done.length === 0 ? (
          <EmptyState icon="trophy-outline" title="No completed jobs yet" message="Completed jobs appear here with ratings." />
        ) : (
          done.map((job) => {
            const client = users.find((u) => u.id === job.clientId)
            const review = reviews.find((r) => r.jobId === job.id && r.reviewerId === user?.id)
            const rating = reviews.find((r) => r.jobId === job.id && r.revieweeId === user?.id)
            return (
              <Card key={job.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Text variant="h3" style={{ fontSize: 15 }} numberOfLines={1}>{job.title}</Text>
                      <StatusChip status={job.status} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      {client && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Avatar user={client} size="sm" />
                          <Text variant="caption">{client.name}</Text>
                        </View>
                      )}
                      <Text variant="caption">{job.completedAt ? formatDateShort(job.completedAt) : 'Recently'}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  {rating ? (
                    <Badge tone="success">★ {rating.rating}.0 received</Badge>
                  ) : (
                    <Badge tone="neutral">No rating yet</Badge>
                  )}
                  {review ? (
                    <Badge tone="success">Review submitted</Badge>
                  ) : (
                    <Button size="sm" variant="secondary" onPress={() => router.push(`/review/${job.id}`)}>
                      <Ionicons name="star" size={14} color={t.colors.rating} /> Leave a review
                    </Button>
                  )}
                </View>
              </Card>
            )
          })
        )}
      </View>
    </ScrollView>
  )
}