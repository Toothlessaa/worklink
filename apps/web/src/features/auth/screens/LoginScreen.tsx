import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Check, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@worklink/state'
import { ThemeToggle } from '../../../app/ui'
import { LoginBackground, FloatingInput, RoleSelector, LoginButton, type LoginRole, type ButtonStatus } from '../components'
import { Reveal, SlideIn, usePrefersReducedMotion, useMouseParallax, useCardTilt } from '../../../shared/motion'
import { toast } from '../../../shared/toast'

const EMAIL_RE = /^\S+@\S+\.\S+$/

const trustBadges = [
  { icon: ShieldCheck, text: 'Verified professionals' },
  { icon: ShieldCheck, text: 'Secure connections' },
  { icon: ShieldCheck, text: 'Trusted by 10K+ clients' },
]

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function SocialButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:scale-[0.98]"
    >
      {icon}
      {label}
    </button>
  )
}

function DemoQuick({ onClient, onMember }: { onClient: () => void; onMember: () => void }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={onClient}
        className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-xs font-medium text-white/60 transition-all hover:border-white/25 hover:text-white"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[9px] font-bold text-white">SC</span>
        Sarah · Client
      </button>
      <button
        type="button"
        onClick={onMember}
        className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-xs font-medium text-white/60 transition-all hover:border-white/25 hover:text-white"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">JM</span>
        John · Member
      </button>
    </div>
  )
}

export function LoginScreen() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const switchTo = useAuthStore((s) => s.switchTo)
  const demoClientId = useAuthStore((s) => s.demoClientId)
  const demoMemberId = useAuthStore((s) => s.demoMemberId)

  const reduced = usePrefersReducedMotion()
  const mouse = useMouseParallax()
  const { onMouseMove: handleCardMouse, onMouseLeave: handleCardLeave, tiltStyle } = useCardTilt()

  const [role, setRole] = useState<LoginRole>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [status, setStatus] = useState<ButtonStatus>('idle')
  const [shake, setShake] = useState(false)

  const clearFieldError = (key: 'email' | 'password') => {
    setFieldErrors((f) => (f[key] ? { ...f, [key]: undefined } : f))
    if (generalError) setGeneralError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'idle') return
    const errors: { email?: string; password?: string } = {}
    if (!email.trim() || !EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.'
    if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus('loading')
    setGeneralError(null)
    setTimeout(() => {
      const err = login(email)
      if (err) {
        setStatus('idle')
        setGeneralError(err)
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return
      }
      setStatus('success')
      setTimeout(() => navigate('/app'), 1000)
    }, 1200)
  }

  const quickLogin = (id: string) => {
    switchTo(id)
    navigate('/app')
  }

  const demoDelay = reduced ? 0 : undefined
  const revealProps = (d: number) => (reduced ? { delay: demoDelay } : { delay: d })

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-900 font-sans text-white">
      <LoginBackground reduced={reduced} mouseX={mouse.x} mouseY={mouse.y} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 lg:px-8">
        <Reveal {...revealProps(100)} className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-purple-600 animate-[pulse-glow_4s_ease-in-out_infinite] transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="WorkLink" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">WorkLink</span>
          </Link>
          <ThemeToggle />
        </Reveal>

        <div className="grid flex-1 items-center gap-14 pb-12 pt-4 lg:grid-cols-2 lg:gap-16">
          <div className="hidden lg:block">
            <Reveal {...revealProps(200)}>
              <h1 className="text-5xl leading-[1.1] font-bold tracking-tight">
                Welcome
                <br />
                back.
              </h1>
            </Reveal>
            <Reveal {...revealProps(300)}>
              <p className="mt-4 max-w-md text-lg text-soft-gray">Log in to continue to WorkLink.</p>
            </Reveal>

            <div className="mt-9 space-y-3.5">
              {trustBadges.map((b, i) => (
                <SlideIn key={b.text} delay={350 + i * 100}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <b.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-white/70">{b.text}</span>
                </SlideIn>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <Reveal {...revealProps(250)} className={reduced ? '' : 'animate-[float-slow_7s_ease-in-out_infinite]'}>
              <div
                onMouseMove={handleCardMouse}
                onMouseLeave={handleCardLeave}
                className="rounded-3xl"
                style={{
                  perspective: '1200px',
                }}
              >
                <div
                  className={`rounded-3xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-xl lg:p-8 ${
                    shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
                  }`}
                  style={{
                    ...tiltStyle,
                    boxShadow: '0 0 50px rgba(37,99,235,0.12), 0 20px 60px rgba(0,0,0,0.45)',
                  }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <Reveal {...revealProps(400)}>
                      <RoleSelector value={role} onChange={setRole} />
                    </Reveal>

                    <Reveal {...revealProps(500)}>
                      <FloatingInput
                        id="login-email"
                        label="Email address"
                        icon={<Mail className="h-[18px] w-[18px]" />}
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(v) => {
                          setEmail(v)
                          clearFieldError('email')
                        }}
                        error={!!fieldErrors.email}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 animate-[fade-slide_0.3s_ease-out] text-xs text-red-400">{fieldErrors.email}</p>
                      )}
                    </Reveal>

                    <Reveal {...revealProps(600)}>
                      <FloatingInput
                        id="login-password"
                        label="Password"
                        icon={<Lock className="h-[18px] w-[18px]" />}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(v) => {
                          setPassword(v)
                          clearFieldError('password')
                        }}
                        error={!!fieldErrors.password}
                        rightIcon={
                          <span
                            className={`flex transition-all duration-300 ${showPassword ? 'rotate-[10deg]' : 'rotate-0'}`}
                          >
                            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                          </span>
                        }
                        onRightPress={() => setShowPassword((v) => !v)}
                        rightLabel={showPassword ? 'Hide password' : 'Show password'}
                      />
                      {fieldErrors.password && (
                        <p className="mt-1.5 animate-[fade-slide_0.3s_ease-out] text-xs text-red-400">{fieldErrors.password}</p>
                      )}
                    </Reveal>

                    <Reveal {...revealProps(680)}>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setRemember((v) => !v)}
                          className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
                        >
                          <span
                            className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border transition-all duration-200 ${
                              remember ? 'border-primary bg-primary text-white' : 'border-white/25'
                            }`}
                          >
                            {remember && <Check className="h-3 w-3" />}
                          </span>
                          Remember me
                        </button>
                        <button
                          type="button"
                          onClick={() => toast("Password reset isn't available in this prototype.", 'info')}
                          className="text-sm font-medium text-bright-blue transition-colors hover:text-white"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </Reveal>

                    <Reveal {...revealProps(760)}>
                      <LoginButton status={status} onClick={() => {}} />
                    </Reveal>

                    {generalError && (
                      <Reveal {...revealProps(0)}>
                        <p className="animate-[fade-slide_0.35s_ease-out] rounded-lg border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-center text-sm text-red-300">
                          {generalError}
                        </p>
                      </Reveal>
                    )}
                  </form>

                  <Reveal {...revealProps(820)}>
                    <div className="my-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-xs text-white/35">or continue with</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                  </Reveal>

                  <Reveal {...revealProps(880)}>
                    <div className="flex gap-3">
                      <SocialButton
                        icon={<GoogleIcon />}
                        label="Google"
                        onClick={() => toast('Google sign-in is not available in this prototype.', 'info')}
                      />
                      <SocialButton
                        icon={<AppleIcon />}
                        label="Apple"
                        onClick={() => toast('Apple sign-in is not available in this prototype.', 'info')}
                      />
                    </div>
                  </Reveal>

                  <DemoQuick onClient={() => quickLogin(demoClientId)} onMember={() => quickLogin(demoMemberId)} />

                  <Reveal {...revealProps(940)}>
                    <p className="mt-6 text-center text-sm text-white/50">
                      New to WorkLink?{' '}
                      <Link to="/register" className="font-semibold text-bright-blue transition-colors hover:text-white">
                        Create an account <ArrowRight className="inline h-3.5 w-3.5" />
                      </Link>
                    </p>
                  </Reveal>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
