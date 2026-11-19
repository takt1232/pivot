'use client'

import { ProjectScreen } from '@pivot/app'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams<{ id: string }>()

  return <ProjectScreen projectId={String(params.id)} />
}
