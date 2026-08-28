'use client'

import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react'
import { buildTheme, lightColors, darkColors, spacing, radius, typography, shadow, cssVars } from './tokens'
import type { Theme, ThemeMode } from './types'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  colors: typeof lightColors
  spacing: typeof spacing
  radius: typeof radius
  typography: typeof typography
  shadow: string
}

const ThemeCtx = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  initialMode = 'light',
  mode,
  onModeChange,
  children,
}: {
  initialMode?: ThemeMode
  mode?: ThemeMode
  onModeChange?: (mode: ThemeMode) => void
  children: ReactNode
}) {
  const [internalMode, setInternalMode] = useState<ThemeMode>(initialMode)
  const activeMode: ThemeMode = mode ?? internalMode

  useEffect(() => {
    if (mode && mode !== internalMode) setInternalMode(mode)
  }, [mode, internalMode])

  const setMode = useCallback(
    (m: ThemeMode) => {
      setInternalMode(m)
      onModeChange?.(m)
    },
    [onModeChange],
  )

  const toggle = useCallback(() => {
    setMode(activeMode === 'light' ? 'dark' : 'light')
  }, [activeMode, setMode])

  const theme = buildTheme(activeMode)
  const colors = activeMode === 'light' ? lightColors : darkColors

  return (
    <ThemeCtx.Provider value={{ theme, mode: activeMode, setMode, toggle, colors, spacing, radius, typography, shadow }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export { cssVars }