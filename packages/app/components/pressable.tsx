import type { ComponentProps } from 'react'
import { Platform, Pressable as NativePressable } from 'react-native'

export type PressableProps = ComponentProps<typeof NativePressable>

/**
 * Pressable that stays responsive on native.
 *
 * React Native 0.81 + the New Architecture + react-native-screens' native-stack
 * can drop `onPress` on Android physical devices (onPressIn/onPressOut still
 * fire). Until that is fixed upstream, native controls act on press-down.
 * Web keeps `onPress` so keyboard activation and normal click semantics work.
 */
export function Pressable({ onPress, onPressIn, ...props }: PressableProps) {
  if (Platform.OS === 'web') {
    return (
      <NativePressable {...props} onPress={onPress} onPressIn={onPressIn} />
    )
  }

  return (
    <NativePressable
      {...props}
      onPressIn={onPressIn ?? onPress}
      onPress={undefined}
    />
  )
}
