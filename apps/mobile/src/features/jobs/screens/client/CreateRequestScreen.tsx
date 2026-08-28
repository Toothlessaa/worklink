import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { CATEGORIES } from '@worklink/constants'
import type { CreateJobInput, Job } from '@worklink/types'
import { useCurrentUser, useJobsStore } from '@worklink/state'
import { Screen, Button, Field, Input, Chips, Tabs, Text } from '../../../../shared/ui'
import { toast } from '../../../../shared/toast'

export function CreateRequestScreen({ jobId: propJobId }: { jobId?: string }) {
  const t = useTheme()
  const router = useRouter()
  const { jobId: routeJobId } = useLocalSearchParams<{ jobId?: string }>()
  const jobId = propJobId ?? routeJobId
  const user = useCurrentUser()
  const createJob = useJobsStore((s) => s.createJob)
  const jobs = useJobsStore((s) => s.jobs)
  const updateJob = useJobsStore((s) => s.updateJob)
  const editing = jobId ? jobs.find((j) => j.id === jobId) : undefined

  const [title, setTitle] = useState(editing?.title ?? '')
  const [category, setCategory] = useState<CreateJobInput['category']>(editing?.category ?? 'plumbing')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [location, setLocation] = useState(editing?.location ?? 'Maplewood, NJ')
  const [preferredDate, setPreferredDate] = useState(editing?.preferredDate ? editing.preferredDate.slice(0, 10) : '')
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>(editing?.budget.type ?? 'fixed')
  const [budgetAmount, setBudgetAmount] = useState(editing?.budget.amount ? String(editing.budget.amount) : '')
  const [photoCount, setPhotoCount] = useState(editing?.photoCount ?? 0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Give your job a title.'
    if (!description.trim()) errs.description = 'Describe the work.'
    if (!location.trim()) errs.location = 'Add a location.'
    if (!preferredDate) errs.preferredDate = 'Pick a date.'
    const amount = Number(budgetAmount)
    if (!amount || amount <= 0) errs.budget = 'Enter a budget amount.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const input: CreateJobInput = {
      title,
      category,
      description,
      location,
      preferredDate: new Date(preferredDate).toISOString(),
      budget: { type: budgetType, amount },
      photoCount,
    }
    if (editing) {
      updateJob(editing.id, input)
      toast('Request updated.')
      router.back()
    } else if (user) {
      const job = createJob(input, user.id)
      toast('Job request posted! Members can now find it.')
      router.replace(`/request/${job.id}`)
    }
  }

  return (
    <Screen scroll>
      <Text variant="h1" style={{ marginTop: 8 }}>
        {editing ? 'Edit Request' : 'Post a Job Request'}
      </Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>
        {editing ? 'Update the details below.' : 'Tell us what you need done.'}
      </Text>

      <View style={{ gap: 18, marginTop: 20 }}>
        <Field label="Job title">
          <Input placeholder="e.g. Fix Kitchen Sink Leak" value={title} onChangeText={setTitle} />
          {errors.title && <Text style={{ color: t.colors.error, fontSize: 12 }}>{errors.title}</Text>}
        </Field>

        <Field label="Service category">
          <Chips options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))} value={category} onChange={setCategory} />
        </Field>

        <Field label="Job description">
          <Input multiline placeholder="Describe the job and any important details." value={description} onChangeText={setDescription} />
          {errors.description && <Text style={{ color: t.colors.error, fontSize: 12 }}>{errors.description}</Text>}
        </Field>

        <Field label="Location">
          <Input placeholder="e.g. Maplewood, NJ" value={location} onChangeText={setLocation} />
          {errors.location && <Text style={{ color: t.colors.error, fontSize: 12 }}>{errors.location}</Text>}
        </Field>

        <Field label="Preferred date">
          <Input placeholder="YYYY-MM-DD" value={preferredDate} onChangeText={setPreferredDate} />
          {errors.preferredDate && <Text style={{ color: t.colors.error, fontSize: 12 }}>{errors.preferredDate}</Text>}
        </Field>

        <Field label="Budget">
          <View style={{ gap: 10 }}>
            <Tabs
              options={[
                { value: 'fixed', label: 'Fixed price' },
                { value: 'hourly', label: 'Hourly' },
              ]}
              value={budgetType}
              onChange={setBudgetType}
            />
            <Input keyboardType="numeric" placeholder={budgetType === 'fixed' ? '150' : '65'} value={budgetAmount} onChangeText={setBudgetAmount} />
            {errors.budget && <Text style={{ color: t.colors.error, fontSize: 12 }}>{errors.budget}</Text>}
          </View>
        </Field>

        <Field label="Photos">
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {Array.from({ length: photoCount }).map((_, i) => (
              <View key={i} style={{ width: 72, height: 72, borderRadius: 12, borderWidth: 1, borderColor: t.colors.border, backgroundColor: t.colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="image-outline" size={22} color={t.colors.textMuted} />
              </View>
            ))}
            {photoCount < 3 && (
              <Pressable onPress={() => setPhotoCount((c) => c + 1)} style={{ width: 72, height: 72, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: t.colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="camera-outline" size={22} color={t.colors.textMuted} />
              </Pressable>
            )}
          </View>
        </Field>

        <Button size="lg" fullWidth onPress={handleSubmit}>
          {editing ? 'Save Changes' : 'Post Job Request'}
        </Button>
      </View>
    </Screen>
  )
}