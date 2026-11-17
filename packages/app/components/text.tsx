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
      className={`font-sans text-3xl font-semibold tracking-[-0.02em] ${colors.text} ${className}`}
    >
      {children}
    </Text>
  )
}

export function Body({ children, className = '' }: TextProps) {
  const { colors } = useTheme()

  return (
    <Text
      className={`font-mono text-[13.5px] leading-6 ${colors.muted} ${className}`}
    >
      {children}
    </Text>
  )
}

export function Caption({ children, className = '' }: TextProps) {
  const { colors } = useTheme()

  return (
    <Text
      className={`font-sans text-[9.5px] font-semibold uppercase tracking-[0.14em] ${colors.faint} ${className}`}
    >
      {children}
    </Text>
  )
}
