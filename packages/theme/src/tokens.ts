import type { ColorTokens, SpacingScale, RadiusScale, TypographyScale, Theme } from './types'

export const lightColors: ColorTokens = {
  background: '#F6F8FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  primary: '#2563EB',
  primaryStrong: '#1D4ED8',
  primarySoft: '#EFF6FF',
  onPrimary: '#FFFFFF',
  secondary: '#334155',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  divider: '#E9EEF5',
  success: '#16A34A',
  successSoft: '#F0FDF4',
  warning: '#D97706',
  warningSoft: '#FFFBEB',
  error: '#DC2626',
  errorSoft: '#FEF2F2',
  info: '#2563EB',
  infoSoft: '#EFF6FF',
  rating: '#F59E0B',
  ratingSoft: '#FFFBEB',
  overlay: 'rgba(15,23,42,0.4)',
  shadow: 'rgba(15,23,42,0.08)',
}

export const darkColors: ColorTokens = {
  background: '#0B1220',
  surface: '#121A2B',
  surfaceElevated: '#182238',
  surfaceMuted: '#1C2740',
  primary: '#3B82F6',
  primaryStrong: '#60A5FA',
  primarySoft: 'rgba(59,130,246,0.15)',
  onPrimary: '#FFFFFF',
  secondary: '#94A3B8',
  textPrimary: '#E7ECF5',
  textSecondary: '#A8B3C7',
  textMuted: '#64748B',
  border: '#26324A',
  divider: '#1E2940',
  success: '#4ADE80',
  successSoft: 'rgba(74,222,128,0.12)',
  warning: '#FBBF24',
  warningSoft: 'rgba(251,191,36,0.12)',
  error: '#F87171',
  errorSoft: 'rgba(248,113,113,0.12)',
  info: '#60A5FA',
  infoSoft: 'rgba(96,165,250,0.12)',
  rating: '#FBBF24',
  ratingSoft: 'rgba(251,191,36,0.12)',
  overlay: 'rgba(2,6,17,0.6)',
  shadow: 'rgba(0,0,0,0.3)',
}

export const spacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const radius: RadiusScale = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
}

export const typography: TypographyScale = {
  fontFamily: 'Inter',
  sizes: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32 },
  weights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
}

export const shadow = '0 1px 2px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.05)'

export function buildTheme(mode: 'light' | 'dark'): Theme {
  return {
    mode,
    colors: mode === 'light' ? lightColors : darkColors,
    spacing,
    radius,
    typography,
    shadow: mode === 'light'
      ? '0 1px 2px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.05)'
      : '0 1px 2px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.3)',
  }
}

export function cssVars(mode: 'light' | 'dark'): Record<string, string> {
  const colors = mode === 'light' ? lightColors : darkColors
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(colors)) {
    const k = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    vars[`--wl-${k}`] = value
  }
  return vars
}