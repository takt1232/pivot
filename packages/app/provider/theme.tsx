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

/**
 * The scoresheet world, as class tokens.
 *
 * Light is the committed world: a paper score pad. Dark is the same pad at
 * night, not an inversion — the rules soften and the annotation keeps its
 * ink. Feature code never names a raw colour; it asks for a role.
 */
export const themes = {
  light: {
    background: 'bg-paper',
    surface: 'bg-sheet border-rule',
    text: 'text-ink',
    muted: 'text-pencil',
    faint: 'text-pencil-soft',
    accent: 'text-annotation',
    accentBg: 'bg-annotation',
    annotationBg: 'bg-annotation',
    onAccent: 'text-sheet',
    chip: 'bg-sel',
    border: 'border-rule',
    divider: 'bg-rule',
    strong: 'border-rule-strong',
    ink: 'bg-ink',
    onInk: 'text-sheet',
    sel: 'bg-sel',
    annotation: 'border-annotation',
    resolved: 'text-resolved',
    sheet: 'bg-sheet',
  },
  dark: {
    background: 'bg-night',
    surface: 'bg-night-sheet border-night-rule',
    text: 'text-night-ink',
    muted: 'text-night-pencil',
    faint: 'text-night-soft',
    accent: 'text-night-annotation',
    accentBg: 'bg-night-annotation',
    annotationBg: 'bg-night-annotation',
    onAccent: 'text-night',
    chip: 'bg-night-sel',
    border: 'border-night-rule',
    divider: 'bg-night-rule',
    strong: 'border-night-strong',
    ink: 'bg-night-ink',
    onInk: 'text-night',
    sel: 'bg-night-sel',
    annotation: 'border-night-annotation',
    resolved: 'text-night-resolved',
    sheet: 'bg-night-sheet',
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
