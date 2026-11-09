import type { PropsWithChildren } from 'react'
import { Text } from 'react-native'

import { useTheme } from '../provider/theme'

type TextProps = PropsWithChildren<{
  className?: string
}>

export function Heading({ children, className = '' }: TextProps) {
  const { colors } = useTheme()

  return (
    <Text
      className={`text-3xl font-bold tracking-tight ${colors.text} ${className}`}
    >
      {children}
    </Text>
  )
}

export function Body({ children, className = '' }: TextProps) {
  const { colors } = useTheme()

  return (
    <Text className={`text-base leading-6 ${colors.muted} ${className}`}>
      {children}
    </Text>
  )
}

export function Caption({ children, className = '' }: TextProps) {
  const { colors } = useTheme()

  return (
    <Text
      className={`text-xs font-semibold uppercase tracking-widest ${colors.faint} ${className}`}
    >
      {children}
    </Text>
  )
}
