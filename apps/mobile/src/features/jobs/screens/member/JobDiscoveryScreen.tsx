import { ScrollView, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { CATEGORIES } from '@worklink/constants'
import { useCurrentUser, useJobsStore } from '@worklink/state'
import { Card, Button, Text, JobCard, CategoryCard, SectionHeader } from '../../../../shared/ui'

export function JobDiscoveryScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)

  const openJobs = jobs.filter((j) => j.status === 'open' || j.status === 'reviewing')
  const recommended = openJobs
    .filter((j) => user?.skills?.some((s) => j.description.toLowerCase().includes(s.slice(0, 6).toLowerCase())))
    .slice(0, 3)
  const recent = [...openJobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text variant="h1" style={{ marginTop: 8 }}>Find Jobs</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>
        {openJobs.length > 0 ? `${openJobs.length} jobs available` : 'No open jobs at the moment.'}
      </Text>

      <View style={{ borderRadius: 24, backgroundColor: t.colors.primary, padding: 20, marginTop: 16 }}>
        <Text style={{ color: t.colors.onPrimary, fontSize: 18, fontFamily: 'Inter_700Bold' }}>Looking for work?</Text>
        <Text style={{ color: t.colors.onPrimary + 'CC', fontSize: 13, marginTop: 4 }}>
          Browse available jobs, express interest, and get hired.
        </Text>
        <Button
          variant="secondary"
          style={{ marginTop: 14, backgroundColor: '#FFFFFF', borderWidth: 0 }}
          onPress={() => router.push('/jobs')}
        >
          <Ionicons name="search" size={20} color={t.colors.primary} />
          <Text style={{ color: t.colors.primary, fontFamily: 'Inter_700Bold' }}>Browse all jobs</Text>
        </Button>
      </View>

      <SectionHeader title="Recommended for you" />
      {recommended.length === 0 ? (
        <Card>
          <Text variant="body" style={{ color: t.colors.textMuted, textAlign: 'center' }}>
            Update your profile with skills to get recommendations.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {recommended.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => router.push(`/job/${job.id}`)} />
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
        <Text variant="h3">Recently posted</Text>
        <Pressable onPress={() => router.push('/jobs')}>
          <Text style={{ color: t.colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>View all</Text>
        </Pressable>
      </View>
      <View style={{ gap: 10 }}>
        {recent.map((job) => (
          <JobCard key={job.id} job={job} onPress={() => router.push(`/job/${job.id}`)} />
        ))}
      </View>

      <SectionHeader title="Browse by category" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {CATEGORIES.map((c) => (
          <View key={c.id} style={{ width: '31%' }}>
            <CategoryCard meta={c} onPress={() => router.push('/jobs')} />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}