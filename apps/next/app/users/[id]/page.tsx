'use client'

import { UserDetailScreen } from '@pivot/app'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams<{ id: string }>()

  return <UserDetailScreen id={String(params.id)} />
}
