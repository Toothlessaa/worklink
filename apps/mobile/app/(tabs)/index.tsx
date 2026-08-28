import { useAuthStore } from '@worklink/state'
import { ClientHomeScreen } from '../../src/features/jobs/screens/client/ClientHomeScreen'
import { JobDiscoveryScreen } from '../../src/features/jobs/screens/member/JobDiscoveryScreen'

export default function HomeTab() {
  const role = useAuthStore((s) => s.role)
  return role === 'member' ? <JobDiscoveryScreen /> : <ClientHomeScreen />
}