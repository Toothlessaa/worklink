import { useState, useMemo } from 'react'
import { ScrollView, View, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { CATEGORIES } from '@worklink/constants'
import type { CategoryId } from '@worklink/types'
import { useJobsStore } from '@worklink/state'
import { Screen, Button, Card, Text, Tabs, EmptyState, JobCard, Chips } from '../../../../shared/ui'

export function JobListScreen() {
  const t = useTheme()
  const router = useRouter()
  const jobs = useJobsStore((s) => s.jobs)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')

  const openJobs = useMemo(() => {
    let list = jobs.filter((j) => j.status === 'open' || j.status === 'reviewing')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((j) => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter((j) => j.category === category)
    return list
  }, [jobs, search, category])

  return (
    <Screen scroll>
      <Text variant="h1">Find Jobs</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>{openJobs.length} job{openJobs.length !== 1 ? 's' : ''} available</Text>

      <TextInput
        style={{
          marginTop: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: t.colors.surface,
          paddingHorizontal: 14,
          paddingVertical: 10,
          fontSize: 15,
          fontFamily: 'Inter_400Regular',
          color: t.colors.textPrimary,
        }}
        placeholder="Search by title or description..."
        placeholderTextColor={t.colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ marginTop: 14 }}>
        <Tabs
          options={[{ value: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.label }))]}
          value={category}
          onChange={(v) => setCategory(v as CategoryId | 'all')}
        />
      </View>

      <View style={{ gap: 10, marginTop: 16 }}>
        {openJobs.length === 0 ? (
          <EmptyState icon="search-outline" title="No jobs match" message="Try adjusting the search or filter." />
        ) : (
          openJobs.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => router.push(`/job/${job.id}`)} />
          ))
        )}
      </View>
    </Screen>
  )
}