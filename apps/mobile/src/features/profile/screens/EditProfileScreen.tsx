import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@worklink/theme'
import { useAuthStore, useCurrentUser } from '@worklink/state'
import { Card, Button, Field, Input, Text, Avatar } from '../../../shared/ui'
import { toast } from '../../../shared/toast'

export function EditProfileScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    profession: user?.profession ?? '',
    location: user?.location ?? '',
    rate: user?.rate ?? '',
    bio: user?.bio ?? '',
    skills: (user?.skills ?? []).join(', '),
  })

  if (!user) return null

  const handleSubmit = () => {
    updateProfile(user.id, {
      name: form.name,
      profession: form.profession,
      location: form.location,
      rate: form.rate,
      bio: form.bio,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    })
    toast('Profile updated.')
    router.back()
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.background }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text variant="h1">Edit Profile</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <Avatar user={user} size="lg" />
        <Button variant="secondary" size="sm">Change photo</Button>
      </View>
      <View style={{ gap: 16, marginTop: 20 }}>
        <Field label="Full name">
          <Input value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
        </Field>
        {user.role === 'member' && (
          <>
            <Field label="Profession">
              <Input value={form.profession} onChangeText={(v) => setForm({ ...form, profession: v })} />
            </Field>
            <Field label="Rate">
              <Input placeholder="e.g. $65-85 / hr" value={form.rate} onChangeText={(v) => setForm({ ...form, rate: v })} />
            </Field>
            <Field label="Skills">
              <Input value={form.skills} onChangeText={(v: string) => setForm({ ...form, skills: v })} />
            </Field>
          </>
        )}
        <Field label="Location">
          <Input value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} />
        </Field>
        <Field label="About">
          <Input multiline value={form.bio} onChangeText={(v) => setForm({ ...form, bio: v })} />
        </Field>
        <Button size="lg" fullWidth onPress={handleSubmit}>Save changes</Button>
      </View>
    </ScrollView>
  )
}