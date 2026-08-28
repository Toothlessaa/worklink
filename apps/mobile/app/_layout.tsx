import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { ThemeProvider } from '@worklink/theme'
import { useAuthStore, useSettingsStore } from '@worklink/state'
import { Toaster } from '../src/shared/ui'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })
  const currentUserId = useAuthStore((s) => s.currentUserId)
  const mode = useSettingsStore((s) => s.mode)
  const setMode = useSettingsStore((s) => s.setMode)

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {})
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <ThemeProvider mode={mode} onModeChange={setMode}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B1220' },
          headerStyle: { backgroundColor: '#0B1220' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontFamily: 'Inter_700Bold' },
        }}
      >
        {!currentUserId ? (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="create"
              options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: true, title: 'Post a Job' }}
            />
            <Stack.Screen
              name="request/[id]"
              options={{ headerShown: true, title: 'Request Details' }}
            />
            <Stack.Screen
              name="request/[id]/edit"
              options={{ presentation: 'modal', headerShown: true, title: 'Edit Request' }}
            />
            <Stack.Screen
              name="job/[id]"
              options={{ headerShown: true, title: 'Job Details' }}
            />
            <Stack.Screen
              name="jobs"
              options={{ headerShown: true, title: 'Find Jobs' }}
            />
            <Stack.Screen name="chat/[conversationId]" />
            <Stack.Screen
              name="member/[id]"
              options={{ headerShown: true, title: 'Profile' }}
            />
            <Stack.Screen
              name="credentials"
              options={{ headerShown: true, title: 'Credentials' }}
            />
            <Stack.Screen
              name="subscription"
              options={{ headerShown: true, title: 'Subscription' }}
            />
            <Stack.Screen
              name="settings"
              options={{ headerShown: true, title: 'Settings' }}
            />
            <Stack.Screen
              name="edit-profile"
              options={{ headerShown: true, title: 'Edit Profile' }}
            />
            <Stack.Screen
              name="review/[jobId]"
              options={{ presentation: 'modal', headerShown: true, title: 'Leave a Review' }}
            />
          </>
        )}
      </Stack>
      <Toaster />
    </ThemeProvider>
  )
}