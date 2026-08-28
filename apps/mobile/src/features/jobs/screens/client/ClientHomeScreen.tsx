import { ScrollView, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { CATEGORIES } from '@worklink/constants'
import { useAuthStore, useCurrentUser, useJobsStore } from '@worklink/state'
import { Card, SectionHeader, Avatar, StarRating, StatusChip, Button, Text, CategoryCard, ActivityItem, Skeleton } from '../../../../shared/ui'
import { timeAgo } from '../../../../shared/format'

export function ClientHomeScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const activity = useJobsStore((s) => s.activity)
  const users = useAuthStore((s) => s.users)

  const myJobs = jobs.filter((j) => j.clientId === user?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)
  const activeCount = jobs.filter((j) => j.clientId === user?.id && j.status !== 'completed').length
  const myActivity = activity
    .filter((a) => jobs.some((j) => j.id === a.jobId && j.clientId === user?.id))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 4)
  const recommended = users.filter((u) => u.role === 'member' && (u.averageRating ?? 0) >= 4.6).slice(0, 3)

  const jobForActivity = (jobId?: string) => jobs.find((j) => j.id === jobId)
  const userForId = (id?: string) => users.find((u) => u.id === id)

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text variant="h1" style={{ marginTop: 8 }}>Welcome back, {user?.name.split(' ')[0]}</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>
        {activeCount > 0 ? `You have ${activeCount} active job request${activeCount > 1 ? 's' : ''}.` : 'Ready to get something done?'}
      </Text>

      <View style={{ borderRadius: 24, backgroundColor: t.colors.primary, padding: 20, marginTop: 16 }}>
        <Text style={{ color: t.colors.onPrimary, fontSize: 18, fontFamily: 'Inter_700Bold' }}>Need a job done?</Text>
        <Text style={{ color: t.colors.onPrimary + 'CC', fontSize: 13, marginTop: 4 }}>
          Post a request in under a minute and get matched with verified professionals.
        </Text>
        <Button
          variant="secondary"
          style={{ marginTop: 14, backgroundColor: '#FFFFFF', borderWidth: 0 }}
          onPress={() => router.push('/create')}
        >
          <Ionicons name="add-circle" size={20} color={t.colors.primary} />
          <Text style={{ color: t.colors.primary, fontFamily: 'Inter_700Bold' }}>Post a Job Request</Text>
        </Button>
      </View>

      <SectionHeader title="What do you need done?" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {CATEGORIES.map((c) => (
          <View key={c.id} style={{ width: '31%' }}>
            <CategoryCard meta={c} onPress={() => router.push('/create')} />
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
        <Text variant="h3">Your requests</Text>
        <Pressable onPress={() => router.push('/requests')}>
          <Text style={{ color: t.colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>View all</Text>
        </Pressable>
      </View>
      {myJobs.length === 0 ? (
        <Card>
          <Text variant="body" style={{ textAlign: 'center', color: t.colors.textMuted }}>No job requests yet.</Text>
          <Button size="sm" style={{ marginTop: 12, alignSelf: 'center' }} onPress={() => router.push('/create')}>
            Post a job
          </Button>
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {myJobs.map((job) => (
            <Card key={job.id} onPress={() => router.push(`/request/${job.id}`)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text variant="h3" style={{ fontSize: 15 }} numberOfLines={1}>{job.title}</Text>
                  <Text variant="caption" style={{ marginTop: 2 }}>{job.location}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <StatusChip status={job.status} />
                  <Text variant="caption" style={{ marginTop: 4 }}>${job.budget.amount.toLocaleString()}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Recent activity" />
        <Card>
          {myActivity.length === 0 ? (
            <Text variant="body" style={{ color: t.colors.textMuted, textAlign: 'center' }}>No activity yet.</Text>
          ) : (
            myActivity.map((a) => (
              <ActivityItem key={a.id} type={a.type} jobTitle={jobForActivity(a.jobId)?.title} userName={userForId(a.userId)?.name} at={a.at} />
            ))
          )}
        </Card>
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Recommended professionals" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {recommended.map((m) => (
            <Card key={m.id} style={{ width: 180 }} onPress={() => router.push(`/member/${m.id}`)}>
              <View style={{ alignItems: 'center' }}>
                <Avatar user={m} size="xl" showVerified={m.verification === 'fullyVerified'} />
                <Text variant="h3" style={{ fontSize: 15, marginTop: 8 }}>{m.name}</Text>
                <Text variant="caption">{m.profession}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <StarRating value={m.averageRating ?? 0} size={12} />
                  <Text variant="caption">{m.averageRating?.toFixed(1)}</Text>
                </View>
                <Text variant="caption">{m.completedJobs} jobs</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}