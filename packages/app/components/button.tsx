import { Text } from 'react-native'

import { useTheme } from '../provider/theme'
import { Pressable } from './pressable'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
  className?: string
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const { colors } = useTheme()
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      className={`min-h-[44px] justify-center border px-4 py-3 active:opacity-70 ${
        isPrimary ? `${colors.ink} ${colors.strong}` : `border ${colors.strong}`
      } ${className}`}
    >
      <Text
        className={`text-center font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${
          isPrimary ? colors.onInk : colors.text
        }`}
      >
        {label}
      </Text>
    </Pressable>
  )
}
