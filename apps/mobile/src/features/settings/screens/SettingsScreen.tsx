import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useAuthStore, useCurrentUser, useSettingsStore } from '@worklink/state'
import { Card, SectionHeader, Avatar, Switch, RoleSwitcher, DemoPill, Button, Text, ListItem } from '../../../shared/ui'
import { toast } from '../../../shared/toast'

export function SettingsScreen() {
  const t = useTheme()
  const router = useRouter()
  const user = useCurrentUser()
  const signOut = useAuthStore((s) => s.signOut)
  const mode = useSettingsStore((s) => s.mode)
  const setMode = useSettingsStore((s) => s.setMode)
  const notifications = useSettingsStore((s) => s.notifications)
  const toggleNotification = useSettingsStore((s) => s.toggleNotification)
  const resetDemo = useSettingsStore((s) => s.resetDemo)

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text variant="h1">Settings</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>Manage your account and preferences.</Text>

      <Card style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {user && <Avatar user={user} size="md" />}
          <View style={{ flex: 1 }}>
            <Text variant="h3" style={{ fontSize: 15 }}>{user?.name}</Text>
            <Text variant="caption">{user?.email}</Text>
          </View>
          <Button variant="secondary" size="sm" onPress={() => user && router.push(`/member/${user.id}`)}>
            View
          </Button>
        </View>
        <ListItem icon="log-out-outline" label="Sign out" onPress={() => { signOut(); router.replace('/login') }} />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Text variant="h3" style={{ marginBottom: 12 }}>Appearance</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="color-palette-outline" size={20} color={t.colors.primary} />
            <Text variant="body">Theme</Text>
          </View>
          <View style={{ flexDirection: 'row', borderRadius: 10, borderWidth: 1, borderColor: t.colors.border, overflow: 'hidden' }}>
            {(['light', 'dark'] as const).map((m) => (
              <Button
                key={m}
                variant={mode === m ? 'primary' : 'ghost'}
                size="sm"
                style={{ borderRadius: 0, borderWidth: 0 }}
                onPress={() => setMode(m)}
              >
                {m === 'light' ? 'Light' : 'Dark'}
              </Button>
            ))}
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Text variant="h3" style={{ marginBottom: 12 }}>Notifications</Text>
        {[
          { key: 'jobAlerts' as const, label: 'Job alerts', text: 'New jobs matching my skills' },
          { key: 'messages' as const, label: 'Messages', text: 'New messages' },
          { key: 'marketing' as const, label: 'Updates & tips', text: 'Product updates and tips' },
        ].map((row) => (
          <View key={row.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: t.colors.divider }}>
            <Ionicons name="notifications-outline" size={20} color={t.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text variant="body" style={{ fontSize: 14 }}>{row.label}</Text>
              <Text variant="caption">{row.text}</Text>
            </View>
            <Switch checked={notifications[row.key]} onChange={() => toggleNotification(row.key)} />
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Text variant="h3" style={{ marginBottom: 12 }}>Demo Controls</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <DemoPill />
            <Text variant="body" style={{ fontSize: 13, flex: 1 }}>Switch between Client (Sarah) and Member (John)</Text>
          </View>
          <RoleSwitcher />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, borderTopWidth: 1, borderTopColor: t.colors.divider, paddingTop: 14 }}>
          <Text variant="body" style={{ fontSize: 13 }}>Reset demo data</Text>
          <Button variant="secondary" size="sm" onPress={() => { resetDemo(); toast('Demo data reset.') }}>
            <Ionicons name="refresh" size={14} color={t.colors.textPrimary} /> Reset
          </Button>
        </View>
      </Card>
    </ScrollView>
  )
}