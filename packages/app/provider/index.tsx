'use client'

import type { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context'

import { ThemeProvider } from './theme'

// SafeAreaProvider renders no children during SSR unless it has metrics.
// Give the web a zeroed frame so the first paint is still server-rendered.
const webMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider
      initialMetrics={
        Platform.OS === 'web' ? webMetrics : (initialWindowMetrics ?? undefined)
      }
    >
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  )
}
