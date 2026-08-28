export type ThemeMode = 'light' | 'dark'

export type Tone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

export interface ColorTokens {
  background: string
  surface: string
  surfaceElevated: string
  surfaceMuted: string
  primary: string
  primaryStrong: string
  primarySoft: string
  onPrimary: string
  secondary: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  border: string
  divider: string
  success: string
  successSoft: string
  warning: string
  warningSoft: string
  error: string
  errorSoft: string
  info: string
  infoSoft: string
  rating: string
  ratingSoft: string
  overlay: string
  shadow: string
}

export interface SpacingScale {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

export interface RadiusScale {
  sm: number
  md: number
  lg: number
  xl: number
}

export interface TypographyScale {
  fontFamily: string
  sizes: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }
  weights: {
    regular: '400'
    medium: '500'
    semibold: '600'
    bold: '700'
  }
}

export interface Theme {
  mode: ThemeMode
  colors: ColorTokens
  spacing: SpacingScale
  radius: RadiusScale
  typography: TypographyScale
  shadow: string
}
