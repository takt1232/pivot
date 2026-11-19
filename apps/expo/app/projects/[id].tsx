import { ProjectScreen } from '@pivot/app'
import { useLocalSearchParams } from 'expo-router'

export default function ProjectRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <ProjectScreen projectId={String(id ?? '')} />
}
