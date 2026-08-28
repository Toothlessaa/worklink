import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, View, AccessibilityInfo } from 'react-native'
import { BlurView } from 'expo-blur'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTheme } from '@worklink/theme'
import { useAuthStore } from '@worklink/state'
import { Text, FONTS, Input, GradientButton, ThemeToggle, DemoPill } from '../../../shared/ui'
import { DemoAccountCard } from '../components'
import { toast } from '../../../shared/toast'

const EMAIL_RE = /^\S+@\S+\.\S+$/

const LOGO = require('../../../../assets/logo.png')
const BG = require('../../../../assets/bg.png')

export function LoginScreen() {
  const t = useTheme()
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const switchTo = useAuthStore((s) => s.switchTo)
  const demoClientId = useAuthStore((s) => s.demoClientId)
  const demoMemberId = useAuthStore((s) => s.demoMemberId)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const cardAnim = useRef(new Animated.Value(0)).current
  const brandAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let mounted = true
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!mounted) return
      if (reduce) {
        cardAnim.setValue(1)
        brandAnim.setValue(1)
        return
      }
      Animated.parallel([
        Animated.timing(brandAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 450,
          delay: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start()
    })
    return () => {
      mounted = false
    }
  }, [cardAnim, brandAnim])

  const handleEmailChange = (v: string) => {
    setEmail(v)
    if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: undefined }))
    if (generalError) setGeneralError(null)
  }

  const handlePasswordChange = (v: string) => {
    setPassword(v)
    if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: undefined }))
    if (generalError) setGeneralError(null)
  }

  const handleSubmit = () => {
    if (loading) return
    const errors: { email?: string; password?: string } = {}
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      errors.email = 'Enter a valid email address.'
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    Keyboard.dismiss()
    setLoading(true)
    setGeneralError(null)
    setTimeout(() => {
      const err = login(email)
      setLoading(false)
      if (err) {
        setGeneralError(err)
        return
      }
      router.replace('/')
    }, 600)
  }

  const quickLogin = (id: string) => {
    Keyboard.dismiss()
    switchTo(id)
    router.replace('/')
  }

  return (
    <ImageBackground source={BG} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 12, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 4 }}>
              <ThemeToggle />
            </View>

            <Animated.View
              style={{
                alignItems: 'center',
                marginTop: 4,
                opacity: brandAnim,
                transform: [
                  { scale: brandAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                ],
              }}
            >
              <Image source={LOGO} style={{ width: 56, height: 56, resizeMode: 'contain' }} />
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 24,
                  fontFamily: FONTS.bold,
                  letterSpacing: -0.5,
                  color: t.colors.textPrimary,
                }}
              >
                WorkLink
              </Text>
              <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>
                Connect. Collaborate. Get things done.
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                width: '100%',
                maxWidth: 460,
                alignSelf: 'center',
                marginTop: 10,
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
                  },
                ],
              }}
            >
              <View
                style={{
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: t.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
                  overflow: 'hidden',
                  shadowColor: '#0B1B3F',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: t.mode === 'dark' ? 0.35 : 0.08,
                  shadowRadius: 24,
                  elevation: 4,
                }}
              >
                <BlurView
                  intensity={60}
                  tint={t.mode === 'dark' ? 'dark' : 'light'}
                  style={{ padding: 18, borderRadius: 24 }}
                >
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 22, fontFamily: FONTS.bold, color: t.colors.textPrimary }}>
                    Welcome{' '}
                  </Text>
                  <Text style={{ fontSize: 22, fontFamily: FONTS.bold, color: t.colors.primary }}>
                    back!
                  </Text>
                </View>
                <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>
                  Log in to continue to WorkLink.
                </Text>

                <View style={{ gap: 5, marginTop: 12 }}>
                  <Text variant="label" style={{ fontSize: 14, color: t.colors.textPrimary }}>
                    Email address
                  </Text>
                  <Input
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="you@example.com"
                    placeholderTextColor={t.colors.textMuted}
                    value={email}
                    onChangeText={handleEmailChange}
                    error={!!fieldErrors.email}
                    accessibilityLabel="Email address"
                  />
                  {fieldErrors.email && (
                    <Text style={{ fontSize: 12, color: t.colors.error }}>{fieldErrors.email}</Text>
                  )}
                </View>

                <View style={{ gap: 5, marginTop: 10 }}>
                  <Text variant="label" style={{ fontSize: 14, color: t.colors.textPrimary }}>
                    Password
                  </Text>
                  <Input
                    leftIcon="lock-closed-outline"
                    rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onRightPress={() => setShowPassword((v) => !v)}
                    secureTextEntry={!showPassword}
                    placeholder="At least 6 characters"
                    placeholderTextColor={t.colors.textMuted}
                    value={password}
                    onChangeText={handlePasswordChange}
                    error={!!fieldErrors.password}
                    accessibilityLabel="Password"
                  />
                  {fieldErrors.password && (
                    <Text style={{ fontSize: 12, color: t.colors.error }}>{fieldErrors.password}</Text>
                  )}
                  <View style={{ alignItems: 'flex-end', marginTop: 2 }}>
                    <Pressable
                      onPress={() => toast("Password reset isn't available in this prototype.", 'info')}
                      hitSlop={8}
                      accessibilityRole="button"
                    >
                      <Text style={{ fontSize: 13, fontFamily: FONTS.semibold, color: t.colors.primary }}>
                        Forgot password?
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ marginTop: 14 }}>
                  <GradientButton onPress={handleSubmit} loading={loading} fullWidth>
                    {loading ? null : (
                      <>
                        Log in{' '}
                        <Ionicons name="arrow-forward" size={18} color={t.colors.onPrimary} />
                      </>
                    )}
                  </GradientButton>
                </View>

                {generalError && (
                  <View
                    style={{
                      marginTop: 12,
                      borderRadius: 12,
                      backgroundColor: t.colors.errorSoft,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: t.colors.error, fontFamily: FONTS.medium }}>
                      {generalError}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: t.colors.divider }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text variant="caption" style={{ color: t.colors.textMuted }}>
                      or continue with a demo account
                    </Text>
                    <DemoPill />
                  </View>
                  <View style={{ flex: 1, height: 1, backgroundColor: t.colors.divider }} />
                </View>

                <View style={{ gap: 8, marginTop: 12 }}>
                  <DemoAccountCard
                    name="Continue as Sarah"
                    initialsText="SC"
                    avatarColor="#7C5CE0"
                    subtitle="Client"
                    onPress={() => quickLogin(demoClientId)}
                  />
                  <DemoAccountCard
                    name="Continue as John"
                    initialsText="JM"
                    avatarColor="#2563EB"
                    subtitle="Member"
                    onPress={() => quickLogin(demoMemberId)}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                  <Ionicons name="shield-checkmark" size={14} color={t.colors.success} />
                  <Text style={{ fontSize: 12, color: t.colors.textMuted }}>Your data is safe with us</Text>
                </View>
              </BlurView>
              </View>
            </Animated.View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <Text variant="body" style={{ color: t.colors.textSecondary, fontSize: 14 }}>
                New to WorkLink?{' '}
              </Text>
              <Pressable onPress={() => router.push('/register')} hitSlop={8} accessibilityRole="button">
                <Text style={{ color: t.colors.primary, fontFamily: FONTS.bold, fontSize: 14 }}>
                  Create an account <Ionicons name="arrow-forward" size={13} color={t.colors.primary} />
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}