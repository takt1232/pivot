'use client'

import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type ThemeName = 'light' | 'dark'

export const themes = {
  light: {
    background: 'bg-slate-50',
    surface: 'bg-white border-slate-200',
    text: 'text-slate-900',
    muted: 'text-slate-500',
    faint: 'text-slate-400',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    onAccent: 'text-white',
    chip: 'bg-slate-100',
    border: 'border-slate-200',
    divider: 'bg-slate-200',
  },
  dark: {
    background: 'bg-slate-950',
    surface: 'bg-slate-900 border-slate-800',
    text: 'text-slate-50',
    muted: 'text-slate-400',
    faint: 'text-slate-500',
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500',
    onAccent: 'text-white',
    chip: 'bg-slate-800',
    border: 'border-slate-800',
    divider: 'bg-slate-800',
  },
} as const

export type ThemeColors = Record<keyof (typeof themes)['light'], string>

type ThemeContextValue = {
  theme: ThemeName
  colors: ThemeColors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeName>('light')

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(
    () => ({ theme, colors: themes[theme], toggleTheme }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }

  return value
}
