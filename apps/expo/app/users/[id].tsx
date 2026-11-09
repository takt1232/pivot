import { UserDetailScreen } from '@pivot/app'
import { useLocalSearchParams } from 'expo-router'

export default function UserDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <UserDetailScreen id={String(id ?? '')} />
}
