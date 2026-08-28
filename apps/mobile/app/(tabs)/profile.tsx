import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useCurrentUser, useAuthStore } from '@worklink/state'
import { Card, Avatar, Text, StarRating, ListItem, Button } from '../../src/shared/ui'
import { monthName } from '../../src/shared/format'

export default function ProfileTab() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const role = useAuthStore((s) => s.role)

  if (!user) return null

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Card>
        <View style={{ alignItems: 'center' }}>
          <Avatar user={user} size="xl" showVerified={user.verification === 'fullyVerified'} />
          <Text variant="h1" style={{ fontSize: 22, marginTop: 10 }}>{user.name}</Text>
          {user.profession ? (
            <Text variant="body" style={{ color: t.colors.textSecondary }}>{user.profession}</Text>
          ) : (
            <Text variant="body" style={{ color: t.colors.textSecondary }}>Client</Text>
          )}
          <Text variant="caption">{user.location} · {monthName(user.joinedAt)}</Text>
          {user.averageRating !== undefined && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <StarRating value={user.averageRating} />
              <Text variant="caption">{user.averageRating.toFixed(1)} · {user.completedJobs} jobs</Text>
            </View>
          )}
          <Button variant="secondary" size="sm" style={{ marginTop: 12 }} onPress={() => router.push(`/member/${user.id}`)}>
            View public profile
          </Button>
        </View>
      </Card>

      <Card style={{ marginTop: 16, paddingHorizontal: 16 }}>
        <ListItem icon="create-outline" label="Edit profile" onPress={() => router.push('/edit-profile')} />
        {role === 'member' && (
          <>
            <ListItem icon="ribbon-outline" label="Credentials" subtitle="Licenses, certifications, training" onPress={() => router.push('/credentials')} />
            <ListItem icon="card-outline" label="Subscription" subtitle="Manage your plan" onPress={() => router.push('/subscription')} />
          </>
        )}
        <ListItem icon="settings-outline" label="Settings" subtitle="Theme, notifications, demo" onPress={() => router.push('/settings')} />
      </Card>
    </ScrollView>
  )
}