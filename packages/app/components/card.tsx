import type { PropsWithChildren } from 'react'
import { View } from 'react-native'

import { useTheme } from '../provider/theme'

type CardProps = PropsWithChildren<{
  className?: string
}>

export function Card({ children, className = '' }: CardProps) {
  const { colors } = useTheme()

  return (
    <View className={`rounded-2xl border p-5 ${colors.surface} ${className}`}>
      {children}
    </View>
  )
}
