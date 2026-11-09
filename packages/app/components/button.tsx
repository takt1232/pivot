import { Pressable, Text } from 'react-native'

import { useTheme } from '../provider/theme'

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
      className={`rounded-xl px-4 py-3 active:opacity-70 ${
        isPrimary ? colors.accentBg : colors.chip
      } ${className}`}
    >
      <Text
        className={`text-center text-base font-semibold ${
          isPrimary ? colors.onAccent : colors.text
        }`}
      >
        {label}
      </Text>
    </Pressable>
  )
}
