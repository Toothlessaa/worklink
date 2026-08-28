import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { useAuthStore } from '@worklink/state'
import { DemoPill, RoleSwitcher } from '../../src/shared/ui'
import { View } from 'react-native'

export default function TabsLayout() {
  const t = useTheme()
  const role = useAuthStore((s) => s.role)

  const tabColor = { active: t.colors.primary, inactive: t.colors.textMuted }

  const common = {
    headerShown: true,
    tabBarActiveTintColor: tabColor.active,
    tabBarInactiveTintColor: tabColor.inactive,
    tabBarStyle: { backgroundColor: t.colors.surface, borderTopColor: t.colors.divider },
    headerStyle: { backgroundColor: t.colors.surface },
    headerTitleStyle: { fontFamily: 'Inter_700Bold', color: t.colors.textPrimary },
    headerTitle: '',
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 12 }}>
        <RoleSwitcher />
        <DemoPill />
      </View>
    ),
  } as any

  if (role === 'member') {
    return (
      <Tabs screenOptions={common}>
        <Tabs.Screen
          name="index"
          options={{ title: 'Discover', tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="accepted"
          options={{ title: 'Accepted', tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="done"
          options={{ title: 'Done Deal', tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="messenger"
          options={{ title: 'Messages', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
        />
      </Tabs>
    )
  }

  return (
    <Tabs screenOptions={common}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="requests"
        options={{ title: 'Requests', tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="messenger"
        options={{ title: 'Messages', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tabs>
  )
}