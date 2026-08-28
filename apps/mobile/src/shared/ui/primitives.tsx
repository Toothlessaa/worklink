import { ActivityIndicator, Modal as RNModal, Pressable, Switch as RNSwitch, Text as RNText, TextInput, View, StyleSheet, Platform, ScrollView, type TextInputProps } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Circle } from 'react-native-svg'
import { useTheme, type Tone } from '@worklink/theme'
import { JOB_STATUS_META } from '@worklink/constants'
import type { JobStatus, User } from '@worklink/types'
import { useAuthStore, useSettingsStore } from '@worklink/state'
import { useToastStore } from '../toast'
import { initials } from '../format'
import { useState, type ReactNode } from 'react'

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
}

export function Text({ variant = 'body', style, ...rest }: { variant?: 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption' | 'small'; style?: any; children?: ReactNode } & any) {
  const t = useTheme()
  const sizes: Record<string, { size: number; weight: any }> = {
    h1: { size: 28, weight: FONTS.bold },
    h2: { size: 24, weight: FONTS.semibold },
    h3: { size: 18, weight: FONTS.semibold },
    body: { size: 15, weight: FONTS.regular },
    label: { size: 13, weight: FONTS.medium },
    caption: { size: 12, weight: FONTS.regular },
    small: { size: 11, weight: FONTS.regular },
  }
  const s = sizes[variant] ?? sizes.body
  return (
    <RNText
      style={[{ fontSize: s.size, fontFamily: s.weight, color: t.colors.textPrimary, lineHeight: s.size * 1.45 }, style]}
      {...rest}
    />
  )
}

export function Caption({ style, ...rest }: any) {
  return <Text variant="caption" style={[{ color: useTheme().colors.textMuted }, style]} {...rest} />
}

export function Screen({ children, style, scroll }: { children: ReactNode; style?: any; scroll?: boolean }) {
  const t = useTheme()
  const content = <View style={{ flex: 1, backgroundColor: t.colors.background, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>{children}</View>
  if (scroll) return <ScrollView style={{ flex: 1, backgroundColor: t.colors.background }}>{content}</ScrollView>
  return content
}

const toneBg: Record<Tone, string> = {
  primary: '#EFF6FF',
  success: '#F0FDF4',
  warning: '#FFFBEB',
  error: '#FEF2F2',
  info: '#EFF6FF',
  neutral: '#F1F5F9',
}
const toneFg: Record<Tone, string> = {
  primary: '#2563EB',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
  neutral: '#475569',
}

export function Badge({ tone = 'neutral' as Tone, children }: { tone?: Tone; children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: toneBg[tone], borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ fontSize: 12, fontFamily: FONTS.medium, color: toneFg[tone] }}>{children}</Text>
    </View>
  )
}

export function StatusChip({ status }: { status: JobStatus }) {
  const meta = JOB_STATUS_META[status]
  return <Badge tone={meta.tone as Tone}>{meta.label}</Badge>
}

export function Button({ variant = 'primary', size = 'md', icon, loading, disabled, onPress, children, fullWidth, style }: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  children?: ReactNode
  fullWidth?: boolean
  style?: any
}) {
  const t = useTheme()
  const bgColors: Record<string, string> = {
    primary: t.colors.primary,
    secondary: t.colors.surface,
    ghost: 'transparent',
    danger: t.colors.error,
    success: t.colors.success,
  }
  const textColors: Record<string, string> = {
    primary: t.colors.onPrimary,
    secondary: t.colors.textPrimary,
    ghost: t.colors.textPrimary,
    danger: '#FFFFFF',
    success: '#FFFFFF',
  }
  const sizePadding: Record<string, { v: number; h: number; fs: number }> = {
    sm: { v: 6, h: 14, fs: 13 },
    md: { v: 10, h: 18, fs: 14 },
    lg: { v: 14, h: 24, fs: 16 },
  }
  const sp = sizePadding[size]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: fullWidth ? 'center' : undefined,
        gap: 8,
        paddingVertical: sp.v,
        paddingHorizontal: sp.h,
        borderRadius: 12,
        backgroundColor: disabled ? t.colors.border : bgColors[variant],
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: t.colors.border,
        opacity: pressed ? 0.85 : 1,
        ...(fullWidth ? { width: '100%' } : {}),
        ...style,
      })}
    >
      {loading ? <ActivityIndicator size="small" color={textColors[variant]} /> : icon ? <Ionicons name={icon as any} size={sp.fs + 2} color={textColors[variant]} /> : null}
      <RNText style={{ fontFamily: FONTS.semibold, fontSize: sp.fs, color: textColors[variant] }}>{children}</RNText>
    </Pressable>
  )
}

export function GradientButton({
  onPress,
  loading,
  disabled,
  children,
  fullWidth,
  style,
  size = 'lg',
}: {
  onPress?: () => void
  loading?: boolean
  disabled?: boolean
  children?: ReactNode
  fullWidth?: boolean
  style?: any
  size?: 'md' | 'lg'
}) {
  const t = useTheme()
  const pad = size === 'lg' ? { v: 16, h: 24, fs: 16 } : { v: 12, h: 20, fs: 15 }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => ({
        opacity: disabled ? 0.6 : pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        shadowColor: t.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
        borderRadius: 16,
        overflow: 'hidden',
        ...(fullWidth ? { width: '100%' } : {}),
        ...style,
      })}
    >
      <LinearGradient
        colors={[t.colors.primary, t.colors.primaryStrong]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: pad.v,
          paddingHorizontal: pad.h,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <RNText style={{ fontFamily: FONTS.bold, fontSize: pad.fs, color: t.colors.onPrimary }}>{children}</RNText>
        )}
      </LinearGradient>
    </Pressable>
  )
}

export function WorkLinkLogo({ size = 72, style }: { size?: number; style?: any }) {
  const t = useTheme()
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 3.2,
          backgroundColor: t.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: t.colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        },
        style,
      ]}
    >
      <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 48 48">
        <Path
          d="M9 35 L16 13 L24 29 L32 13 L39 35"
          stroke="#FFFFFF"
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Circle cx={16} cy={13} r={3.6} fill="#FFFFFF" />
        <Circle cx={32} cy={13} r={3.6} fill="#FFFFFF" />
      </Svg>
    </View>
  )
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: any; onPress?: () => void }) {  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: t.colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: t.colors.border,
        padding: 16,
        opacity: pressed && onPress ? 0.92 : 1,
        ...style,
      })}
    >
      {children}
    </Pressable>
  )
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  const t = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
      <RNText style={{ fontSize: 17, fontFamily: FONTS.bold, color: t.colors.textPrimary }}>{title}</RNText>
      {action}
    </View>
  )
}

export function Avatar({ user, size = 'md', showVerified }: { user: Pick<User, 'name' | 'avatarHue' | 'verification'>; size?: 'sm' | 'md' | 'lg' | 'xl'; showVerified?: boolean }) {
  const dims = { sm: 32, md: 40, lg: 56, xl: 80 }
  const d = dims[size]
  const fs = d * 0.4
  return (
    <View style={{ position: 'relative', width: d, height: d }}>
      <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: `hsl(${user.avatarHue} 52% 45%)`, alignItems: 'center', justifyContent: 'center' }}>
        <RNText style={{ fontFamily: FONTS.bold, fontSize: fs, color: '#FFFFFF' }}>{initials(user.name)}</RNText>
      </View>
      {showVerified && (
        <View style={{ position: 'absolute', right: -2, bottom: -2, backgroundColor: 'white', borderRadius: 10, padding: 2 }}>
          <Ionicons name="shield-checkmark" size={14} color={useTheme().colors.primary} />
        </View>
      )}
    </View>
  )
}

export function StarRating({ value, size = 14, interactive, onChange }: { value: number; size?: number; interactive?: boolean; onChange?: (v: number) => void }) {
  const t = useTheme()
  const rounded = Math.round(value)
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => onChange?.(i)} disabled={!interactive}>
          <Ionicons name={i <= rounded ? 'star' : 'star-outline'} size={size} color={i <= rounded ? t.colors.rating : t.colors.border} />
        </Pressable>
      ))}
    </View>
  )
}

export function RatingBar({ label, value, max }: { label: string; value: number; max: number }) {
  const t = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <RNText style={{ width: 16, fontSize: 12, fontFamily: FONTS.medium, color: t.colors.textSecondary }}>{label}</RNText>
      <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: t.colors.surfaceMuted }}>
        <View style={{ width: max === 0 ? 0 : `${(value / max) * 100}%`, height: 8, borderRadius: 4, backgroundColor: t.colors.rating }} />
      </View>
      <RNText style={{ width: 24, textAlign: 'right', fontSize: 12, fontFamily: FONTS.regular, color: t.colors.textMuted }}>{value}</RNText>
    </View>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  const t = useTheme()
  return (
    <View style={{ gap: 6 }}>
      <RNText style={{ fontSize: 14, fontFamily: FONTS.medium, color: t.colors.textPrimary }}>{label}</RNText>
      {children}
    </View>
  )
}

export function Input({
  style,
  error,
  multiline,
  leftIcon,
  rightIcon,
  onRightPress,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps & {
  error?: boolean
  leftIcon?: string
  rightIcon?: string
  onRightPress?: () => void
}) {
  const t = useTheme()
  const [focused, setFocused] = useState(false)
  const iconColor = error ? t.colors.error : focused ? t.colors.primary : t.colors.textMuted
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: error ? t.colors.error : focused ? t.colors.primary : t.colors.border,
        backgroundColor: t.colors.surface,
      }}
    >
      {leftIcon && <Ionicons name={leftIcon as any} size={18} color={iconColor} style={{ marginLeft: 14 }} />}
      <TextInput
        style={{
          flex: 1,
          paddingHorizontal: leftIcon ? 10 : 14,
          paddingVertical: multiline ? 12 : 12,
          fontSize: 15,
          fontFamily: FONTS.regular,
          color: t.colors.textPrimary,
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? 'top' : undefined,
          ...style,
        }}
        placeholderTextColor={t.colors.textMuted}
        multiline={multiline}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        {...rest}
      />
      {rightIcon && (
        <Pressable
          onPress={onRightPress}
          hitSlop={10}
          accessibilityRole="button"
          style={{ paddingHorizontal: 14, paddingVertical: 10 }}
        >
          <Ionicons name={rightIcon as any} size={18} color={t.colors.textMuted} />
        </Pressable>
      )}
    </View>
  )
}

export function Chips<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void }) {
  const t = useTheme()
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const active = value === o.value
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? t.colors.primary : t.colors.border,
              backgroundColor: active ? t.colors.primarySoft : t.colors.surface,
            }}
          >
            <RNText style={{ fontSize: 14, fontFamily: FONTS.medium, color: active ? t.colors.primary : t.colors.textSecondary }}>{o.label}</RNText>
          </Pressable>
        )
      })}
    </View>
  )
}

export function Tabs<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const t = useTheme()
  return (
    <View style={{ flexDirection: 'row', borderRadius: 12, borderWidth: 1, borderColor: t.colors.border, backgroundColor: t.colors.surfaceMuted, padding: 2 }}>
      {options.map((o) => {
        const active = value === o.value
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 10,
              backgroundColor: active ? t.colors.surface : 'transparent',
              shadowColor: active ? '#000' : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: active ? 0.08 : 0,
              shadowRadius: 2,
              elevation: active ? 2 : 0,
            }}
          >
            <RNText style={{ fontSize: 13, fontFamily: FONTS.semibold, color: active ? t.colors.textPrimary : t.colors.textMuted, textAlign: 'center' }}>{o.label}</RNText>
          </Pressable>
        )
      })}
    </View>
  )
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const t = useTheme()
  return <RNSwitch value={checked} onValueChange={onChange} trackColor={{ false: t.colors.border, true: t.colors.primary }} thumbColor="#FFFFFF" />
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean }) {
  const t = useTheme()
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: t.colors.overlay, justifyContent: 'center', padding: 24 }} onPress={onClose}>
        <Pressable onPress={() => {}} style={{ backgroundColor: t.colors.surface, borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            {title ? <RNText style={{ fontSize: 18, fontFamily: FONTS.bold, color: t.colors.textPrimary }}>{title}</RNText> : <View />}
            <Pressable onPress={onClose}><Ionicons name="close" size={22} color={t.colors.textMuted} /></Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

export function EmptyState({ icon, title, message, action }: { icon: string; title: string; message: string; action?: ReactNode }) {
  const t = useTheme()
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 24, borderRadius: 16, borderWidth: 1, borderColor: t.colors.border, borderStyle: 'dashed', backgroundColor: t.colors.surface }}>
      <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Ionicons name={icon as any} size={24} color={t.colors.primary} />
      </View>
      <RNText style={{ fontSize: 16, fontFamily: FONTS.semibold, color: t.colors.textPrimary, marginBottom: 4 }}>{title}</RNText>
      <RNText style={{ fontSize: 13, fontFamily: FONTS.regular, color: t.colors.textMuted, textAlign: 'center', marginBottom: 12 }}>{message}</RNText>
      {action}
    </View>
  )
}

export function Skeleton({ height = 80, style }: { height?: number; style?: any }) {
  const t = useTheme()
  return <View style={[{ height, borderRadius: 12, backgroundColor: t.colors.surfaceMuted }, style]} />
}

export function Stat({ value, label }: { value: string | number; label: string }) {
  const t = useTheme()
  return (
    <View style={{ alignItems: 'center' }}>
      <RNText style={{ fontSize: 20, fontFamily: FONTS.bold, color: t.colors.textPrimary }}>{value}</RNText>
      <RNText style={{ fontSize: 11, fontFamily: FONTS.regular, color: t.colors.textMuted, marginTop: 2 }}>{label}</RNText>
    </View>
  )
}

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const t = useTheme()
  const d = size === 'lg' ? 40 : 32
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: d, height: d, borderRadius: d / 3, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <RNText style={{ fontFamily: FONTS.bold, fontSize: d * 0.5, color: t.colors.onPrimary }}>W</RNText>
      </View>
      <RNText style={{ fontFamily: FONTS.bold, fontSize: size === 'lg' ? 24 : 18, color: t.colors.textPrimary }}>WorkLink</RNText>
    </View>
  )
}

export function ThemeToggle({ style }: { style?: any }) {
  const mode = useSettingsStore((s) => s.mode)
  const toggleMode = useSettingsStore((s) => s.toggleMode)
  const t = useTheme()
  return (
    <Pressable
      onPress={toggleMode}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      style={({ pressed }) => [
        {
          width: 40,
          height: 40,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: t.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        },
        style,
      ]}
    >
      <Ionicons name={mode === 'light' ? 'moon-outline' : 'sunny-outline'} size={19} color={t.colors.textSecondary} />
    </Pressable>
  )
}

export function RoleSwitcher({ style }: { style?: any }) {
  const currentUserId = useAuthStore((s) => s.currentUserId)
  const switchTo = useAuthStore((s) => s.switchTo)
  const demoClientId = useAuthStore((s) => s.demoClientId)
  const demoMemberId = useAuthStore((s) => s.demoMemberId)
  const t = useTheme()
  return (
    <View style={[{ flexDirection: 'row', borderRadius: 12, borderWidth: 1, borderColor: t.colors.border, backgroundColor: t.colors.surface, padding: 2 }, style]}>
      <Pressable
        onPress={() => switchTo(demoClientId)}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 10,
          backgroundColor: currentUserId === demoClientId ? t.colors.primary : 'transparent',
        }}
      >
        <RNText style={{ fontSize: 12, fontFamily: FONTS.semibold, color: currentUserId === demoClientId ? t.colors.onPrimary : t.colors.textMuted }}>
          Sarah · Client
        </RNText>
      </Pressable>
      <Pressable
        onPress={() => switchTo(demoMemberId)}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 10,
          backgroundColor: currentUserId === demoMemberId ? t.colors.primary : 'transparent',
        }}
      >
        <RNText style={{ fontSize: 12, fontFamily: FONTS.semibold, color: currentUserId === demoMemberId ? t.colors.onPrimary : t.colors.textMuted }}>
          John · Member
        </RNText>
      </Pressable>
    </View>
  )
}

export function DemoPill() {
  const t = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: t.colors.warningSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
      <RNText style={{ fontSize: 10, fontFamily: FONTS.bold, color: t.colors.warning, letterSpacing: 1 }}>Demo</RNText>
    </View>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  const t = useTheme()
  const toneStyles: Record<string, any> = {
    success: { bg: t.colors.successSoft, text: t.colors.success, border: t.colors.success },
    error: { bg: t.colors.errorSoft, text: t.colors.error, border: t.colors.error },
    info: { bg: t.colors.infoSoft, text: t.colors.info, border: t.colors.info },
  }
  return (
    <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, gap: 8, zIndex: 999 }}>
      {toasts.map((t) => {
        const ts = toneStyles[t.tone]
        return (
          <Pressable
            key={t.id}
            onPress={() => dismiss(t.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: ts.bg,
              borderWidth: 1,
              borderColor: ts.border,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Ionicons name="checkmark-circle" size={18} color={ts.text} />
            <RNText style={{ flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: ts.text }}>{t.message}</RNText>
          </Pressable>
        )
      })}
    </View>
  )
}

export function ListItem({ icon, label, subtitle, onPress, chevron }: { icon: string; label: string; subtitle?: string; onPress: () => void; chevron?: boolean }) {
  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: t.colors.divider }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon as any} size={18} color={t.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <RNText style={{ fontSize: 15, fontFamily: FONTS.medium, color: t.colors.textPrimary }}>{label}</RNText>
        {subtitle && <RNText style={{ fontSize: 12, fontFamily: FONTS.regular, color: t.colors.textMuted }}>{subtitle}</RNText>}
      </View>
      {chevron !== false && <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} />}
    </Pressable>
  )
}