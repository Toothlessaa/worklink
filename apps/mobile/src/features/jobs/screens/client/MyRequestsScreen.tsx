import { useState, useMemo } from 'react'
import { View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { JOB_STATUS_ORDER } from '@worklink/constants'
import type { JobStatus } from '@worklink/types'
import { useCurrentUser, useJobsStore } from '@worklink/state'
import { Screen, Button, Card, Tabs, StatusChip, Text, EmptyState, Skeleton } from '../../../../shared/ui'
import { formatMoney, timeAgo } from '../../../../shared/format'

const statusTabs: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export function MyRequestsScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const jobs = useJobsStore((s) => s.jobs)
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')

  const myJobs = useMemo(() => {
    const list = jobs.filter((j) => j.clientId === user?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return filter === 'all' ? list : list.filter((j) => j.status === filter)
  }, [jobs, user, filter])

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <Text variant="h1">My Requests</Text>
        <Button size="sm" onPress={() => router.push('/create')}>
          <Ionicons name="add-circle" size={16} color="#FFFFFF" /> Post
        </Button>
      </View>

      <View style={{ marginTop: 16 }}>
        <Tabs options={statusTabs} value={filter} onChange={setFilter} />
      </View>

      <View style={{ gap: 10, marginTop: 16 }}>
        {myJobs.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title={filter === 'all' ? 'No job requests yet' : `No ${filter} requests`}
            message={filter === 'all' ? 'Post your first job request.' : 'Try another filter.'}
            action={
              filter === 'all' ? (
                <Button size="sm" onPress={() => router.push('/create')}>Post a job</Button>
              ) : undefined
            }
          />
        ) : (
          myJobs.map((job) => (
            <Card key={job.id} onPress={() => router.push(`/request/${job.id}`)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text variant="h3" style={{ fontSize: 15 }} numberOfLines={1}>{job.title}</Text>
                    <StatusChip status={job.status} />
                  </View>
                  <Text variant="caption" style={{ marginTop: 4 }}>{job.location} · ${job.budget.amount.toLocaleString()} · {timeAgo(job.createdAt)}</Text>
                  {job.interestedMemberIds.length > 0 && job.status !== 'completed' && (
                    <Text variant="caption" style={{ color: t.colors.warning, fontFamily: 'Inter_600SemiBold', marginTop: 4 }}>
                      {job.interestedMemberIds.length} interested
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} style={{ marginTop: 4 }} />
              </View>
            </Card>
          ))
        )}
      </View>
    </Screen>
  )
}