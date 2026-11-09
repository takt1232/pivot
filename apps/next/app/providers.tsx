'use client'

import { Providers as SharedProviders } from '@pivot/app'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <SharedProviders>{children}</SharedProviders>
}
