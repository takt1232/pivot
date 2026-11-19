import { forwardRef } from 'react'
import { TextInput as NativeTextInput, type TextInputProps } from 'react-native'

import { useTheme } from '../provider/theme'

/**
 * The sheet's single input: square, ruled, set in Courier Prime.
 */
export const TextInput = forwardRef<NativeTextInput, TextInputProps>(
  function TextInput({ className = '', ...props }, ref) {
    const { colors, theme } = useTheme()

    return (
      <NativeTextInput
        ref={ref}
        placeholderTextColor={theme === 'light' ? '#6F6A60' : '#8C8679'}
        selectionColor={theme === 'light' ? '#9E2B25' : '#E0685C'}
        className={`min-h-[44px] border px-3 py-2 font-mono text-[13px] outline-none lg:min-h-[38px] ${colors.sheet} ${colors.border} ${colors.text} ${className}`}
        {...props}
      />
    )
  },
)
