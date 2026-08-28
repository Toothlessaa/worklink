import { useLocalSearchParams } from 'expo-router'
import { CreateRequestScreen } from '../../../src/features/jobs/screens/client/CreateRequestScreen'

export default function EditRequestRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <CreateRequestScreen jobId={id} />
}