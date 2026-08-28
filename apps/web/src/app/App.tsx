import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@worklink/theme'
import { useSettingsStore, useAuthStore } from '@worklink/state'
import type { ReactNode } from 'react'
import { AppShell } from './layouts/AppShell'
import { Toaster } from './ui'
import { LandingScreen } from '../features/auth/screens/LandingScreen'
import { LoginScreen } from '../features/auth/screens/LoginScreen'
import { RegisterScreen } from '../features/auth/screens/RegisterScreen'
import { ClientHomeScreen } from '../features/jobs/screens/client/ClientHomeScreen'
import { CreateRequestScreen } from '../features/jobs/screens/client/CreateRequestScreen'
import { MyRequestsScreen } from '../features/jobs/screens/client/MyRequestsScreen'
import { RequestDetailsScreen } from '../features/jobs/screens/client/RequestDetailsScreen'
import { EditRequestScreen } from '../features/jobs/screens/client/EditRequestScreen'
import { JobDiscoveryScreen } from '../features/jobs/screens/member/JobDiscoveryScreen'
import { JobListScreen } from '../features/jobs/screens/member/JobListScreen'
import { JobDetailsScreen } from '../features/jobs/screens/member/JobDetailsScreen'
import { AcceptedJobsScreen } from '../features/jobs/screens/member/AcceptedJobsScreen'
import { DoneDealScreen } from '../features/jobs/screens/member/DoneDealScreen'
import { MessengerScreen } from '../features/chat/screens/MessengerScreen'
import { PublicProfileScreen } from '../features/profile/screens/PublicProfileScreen'
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen'
import { CredentialsScreen } from '../features/credentials/screens/CredentialsScreen'
import { SubscriptionScreen } from '../features/subscription/screens/SubscriptionScreen'
import { SettingsScreen } from '../features/settings/screens/SettingsScreen'

function AuthGuard({ children }: { children: ReactNode }) {
  const currentUserId = useAuthStore((s) => s.currentUserId)
  if (!currentUserId) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RoleGuard({ role, children }: { role: 'client' | 'member'; children: ReactNode }) {
  const currentRole = useAuthStore((s) => s.role)
  if (!currentRole) return <Navigate to="/login" replace />
  if (currentRole !== role) {
    return <Navigate to={currentRole === 'client' ? '/app/home' : '/app/discover'} replace />
  }
  return <>{children}</>
}

function RoleHome() {
  const role = useAuthStore((s) => s.role)
  return <Navigate to={role === 'member' ? '/app/discover' : '/app/home'} replace />
}

function MyProfileRedirect() {
  const currentUserId = useAuthStore((s) => s.currentUserId)
  return <Navigate to={`/app/profile/${currentUserId}`} replace />
}

export function App() {
  const mode = useSettingsStore((s) => s.mode)
  const setMode = useSettingsStore((s) => s.setMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  return (
    <ThemeProvider mode={mode} onModeChange={setMode}>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/app"
          element={
            <AuthGuard>
              <AppShell />
            </AuthGuard>
          }
        >
          <Route index element={<RoleHome />} />
          <Route path="home" element={<RoleGuard role="client"><ClientHomeScreen /></RoleGuard>} />
          <Route path="discover" element={<RoleGuard role="member"><JobDiscoveryScreen /></RoleGuard>} />
          <Route path="post" element={<RoleGuard role="client"><CreateRequestScreen /></RoleGuard>} />
          <Route path="requests" element={<RoleGuard role="client"><MyRequestsScreen /></RoleGuard>} />
          <Route path="requests/:id" element={<RoleGuard role="client"><RequestDetailsScreen /></RoleGuard>} />
          <Route path="requests/:id/edit" element={<RoleGuard role="client"><EditRequestScreen /></RoleGuard>} />
          <Route path="jobs" element={<RoleGuard role="member"><JobListScreen /></RoleGuard>} />
          <Route path="jobs/:id" element={<RoleGuard role="member"><JobDetailsScreen /></RoleGuard>} />
          <Route path="accepted" element={<RoleGuard role="member"><AcceptedJobsScreen /></RoleGuard>} />
          <Route path="done" element={<RoleGuard role="member"><DoneDealScreen /></RoleGuard>} />
          <Route path="messenger" element={<MessengerScreen />} />
          <Route path="messenger/:conversationId" element={<MessengerScreen />} />
          <Route path="profile" element={<MyProfileRedirect />} />
          <Route path="profile/:userId" element={<PublicProfileScreen />} />
          <Route path="profile/edit" element={<EditProfileScreen />} />
          <Route path="credentials" element={<RoleGuard role="member"><CredentialsScreen /></RoleGuard>} />
          <Route path="subscription" element={<RoleGuard role="member"><SubscriptionScreen /></RoleGuard>} />
          <Route path="settings" element={<SettingsScreen />} />
          <Route path="*" element={<RoleHome />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}