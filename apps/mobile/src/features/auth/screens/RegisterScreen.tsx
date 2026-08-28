import { useState } from 'react'
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform, Image, ImageBackground } from 'react-native'
import { BlurView } from 'expo-blur'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import type { Role } from '@worklink/types'
import { useAuthStore } from '@worklink/state'
import { Text, FONTS, Input, Field, ThemeToggle, GradientButton } from '../../../shared/ui'

const LOGO = require('../../../../assets/logo.png')
const BG = require('../../../../assets/bg.png')

const roleOptions = [
  {
    value: 'client' as Role,
    title: 'I need someone for a job',
    subtitle: 'Post a request and find a verified professional',
    icon: 'person-outline',
    points: ['Post a job in under a minute', 'Compare profiles and ratings', 'Chat and track progress'],
  },
  {
    value: 'member' as Role,
    title: 'I want to find jobs using my skills',
    subtitle: 'Discover opportunities and get hired',
    icon: 'construct-outline',
    points: ['Browse available jobs', 'Showcase your credentials', 'Build your reputation'],
  },
]

export function RegisterScreen() {
  const t = useTheme()
  const router = useRouter()
  const register = useAuthStore((s) => s.register)
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', location: 'Maplewood, NJ', profession: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!role) return
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Fill in your name, a valid email, and a password of at least 6 characters.')
      return
    }
    setError(null)
    setLoading(true)
    setTimeout(() => {
      register({ name: form.name, email: form.email, password: form.password, location: form.location, role, profession: role === 'member' ? form.profession : undefined })
      router.replace('/')
    }, 600)
  }

  const cardContent = (
    <>
      {step === 1 ? (
        <>
          <Text variant="h1" style={{ fontSize: 22 }}>Join WorkLink</Text>
          <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 4 }}>What would you like to do?</Text>
          <View style={{ gap: 12, marginTop: 20 }}>
            {roleOptions.map((o) => {
              const active = role === o.value
              return (
                <Pressable
                  key={o.value}
                  onPress={() => setRole(o.value)}
                  style={({ pressed }) => ({
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: active ? t.colors.primary : t.colors.border,
                    backgroundColor: active ? t.colors.primarySoft : t.colors.surface,
                    padding: 16,
                    opacity: pressed ? 0.93 : 1,
                    transform: [{ scale: pressed ? 0.99 : 1 }],
                  })}
                >
                  <View style={{ flexDirection: 'row', gap: 14 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={o.icon as any} size={24} color={t.colors.onPrimary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant="h3" style={{ fontSize: 16 }}>{o.title}</Text>
                        {active && <Ionicons name="checkmark-circle" size={22} color={t.colors.primary} />}
                      </View>
                      <Text variant="caption" style={{ marginTop: 2 }}>{o.subtitle}</Text>
                      <View style={{ gap: 4, marginTop: 8 }}>
                        {o.points.map((p) => (
                          <View key={p} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <Ionicons name="checkmark" size={14} color={t.colors.success} />
                            <Text variant="caption">{p}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </Pressable>
              )
            })}
          </View>
          <GradientButton size="lg" fullWidth style={{ marginTop: 20 }} disabled={!role} onPress={() => setStep(2)}>
            Continue <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </GradientButton>
        </>
      ) : (
        <>
          <Pressable onPress={() => setStep(1)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <Ionicons name="arrow-back" size={20} color={t.colors.textMuted} />
            <Text variant="body" style={{ color: t.colors.textMuted, fontSize: 14 }}>Back</Text>
          </Pressable>
          <Text variant="h1" style={{ fontSize: 22 }}>
            {role === 'member' ? 'Your professional account' : 'Create your account'}
          </Text>
          <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 4 }}>Tell us a little about yourself.</Text>

          <View style={{ gap: 16, marginTop: 20 }}>
            <Field label="Full name">
              <Input placeholder="Your name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
            </Field>
            {role === 'member' && (
              <Field label="Profession">
                <Input placeholder="e.g. Plumber, Electrician, Carpenter" value={form.profession} onChangeText={(v) => setForm({ ...form, profession: v })} />
              </Field>
            )}
            <Field label="Email">
              <Input keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} />
            </Field>
            <Field label="Password">
              <Input secureTextEntry placeholder="At least 6 characters" value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} />
            </Field>
            <Field label="Location">
              <Input placeholder="e.g. Maplewood, NJ" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} />
            </Field>
            {error && <Text style={{ color: t.colors.error, fontSize: 13 }}>{error}</Text>}
            <GradientButton size="lg" fullWidth loading={loading} onPress={handleSubmit}>
              {!loading && (
                <>
                  Create account <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </GradientButton>
          </View>
        </>
      )}
    </>
  )

  return (
    <ImageBackground source={BG} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 28 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={LOGO} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
                <Text style={{ fontSize: 18, fontFamily: FONTS.bold }}>WorkLink</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ThemeToggle />
                <Pressable onPress={() => router.push('/login')} hitSlop={8}>
                  <Text style={{ color: t.colors.primary, fontFamily: FONTS.bold, fontSize: 14 }}>Log in</Text>
                </Pressable>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                maxWidth: 460,
                alignSelf: 'center',
                marginTop: 20,
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
                style={{ padding: 24, borderRadius: 24 }}
              >
                {cardContent}
              </BlurView>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text variant="body" style={{ color: t.colors.textSecondary, fontSize: 14 }}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/login')} hitSlop={8}>
                <Text style={{ color: t.colors.primary, fontFamily: FONTS.bold, fontSize: 14 }}>
                  Log in <Ionicons name="arrow-forward" size={13} color={t.colors.primary} />
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}