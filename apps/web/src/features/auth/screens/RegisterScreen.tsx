import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserRound, Wrench, ArrowRight, ArrowLeft, Check, Mail, Lock, Eye, EyeOff, Briefcase, MapPin } from 'lucide-react'
import type { Role } from '@worklink/types'
import { useAuthStore } from '@worklink/state'
import { ThemeToggle } from '../../../app/ui'
import { LoginBackground, FloatingInput, LoginButton, type ButtonStatus } from '../components'
import { Reveal, usePrefersReducedMotion, useMouseParallax, useCardTilt } from '../../../shared/motion'

interface RoleOption {
  value: Role
  title: string
  subtitle: string
  icon: typeof UserRound
  points: string[]
}

const roleOptions: RoleOption[] = [
  {
    value: 'client',
    title: 'I need someone for a job',
    subtitle: 'Post a job request and find a verified professional',
    icon: UserRound,
    points: ['Post a job in under a minute', 'Compare profiles and ratings', 'Chat and track progress'],
  },
  {
    value: 'member',
    title: 'I want to find jobs using my skills',
    subtitle: 'Discover job opportunities and get hired',
    icon: Wrench,
    points: ['Browse available jobs', 'Showcase your credentials', 'Build your reputation'],
  },
]

export function RegisterScreen() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const reduced = usePrefersReducedMotion()
  const mouse = useMouseParallax()
  const { onMouseMove, onMouseLeave, tiltStyle } = useCardTilt()

  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    location: 'Maplewood, NJ',
    profession: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<ButtonStatus>('idle')

  const revealProps = (d: number) => (reduced ? { delay: 0 } : { delay: d })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || status !== 'idle') return
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Please fill in your name, a valid email, and a password of at least 6 characters.')
      return
    }
    setError(null)
    setStatus('loading')
    setTimeout(() => {
      register({
        name: form.name,
        email: form.email,
        password: form.password,
        location: form.location,
        role,
        profession: role === 'member' ? form.profession : undefined,
      })
      setStatus('success')
      setTimeout(() => navigate('/app'), 1000)
    }, 1200)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-900 font-sans text-white">
      <LoginBackground reduced={reduced} mouseX={mouse.x} mouseY={mouse.y} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 lg:px-8">
        <Reveal {...revealProps(100)} className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-purple-600 animate-[pulse-glow_4s_ease-in-out_infinite] transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="WorkLink" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">WorkLink</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">
              Log in
            </Link>
          </div>
        </Reveal>

        <div className="flex flex-1 items-center pb-14 pt-4">
          <div className="mx-auto w-full max-w-md">
            <Reveal {...revealProps(200)} className={reduced ? '' : 'animate-[float-slow_7s_ease-in-out_infinite]'}>
              <div
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                className="rounded-3xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-xl lg:p-8"
                style={{
                  ...tiltStyle,
                  boxShadow: '0 0 50px rgba(37,99,235,0.12), 0 20px 60px rgba(0,0,0,0.45)',
                }}
              >
                {step === 1 ? (
                  <div className="space-y-5">
                    <Reveal {...revealProps(300)}>
                      <h1 className="text-2xl font-bold tracking-tight">Join WorkLink</h1>
                      <p className="mt-1 text-white/50">What would you like to do?</p>
                    </Reveal>

                    <div className="space-y-3.5">
                      {roleOptions.map((o, i) => {
                        const active = role === o.value
                        return (
                          <Reveal key={o.value} {...revealProps(380 + i * 100)}>
                            <button
                              type="button"
                              onClick={() => setRole(o.value)}
                              aria-pressed={active}
                              className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 ${
                                active
                                  ? 'border-primary/60 bg-primary/10 shadow-[0_0_30px_rgba(37,99,235,0.25)]'
                                  : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                    active
                                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                                      : 'bg-white/10 text-white/70'
                                  }`}
                                >
                                  <o.icon className="h-5.5 w-5.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-white">{o.title}</h3>
                                    {active && (
                                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/30 animate-[check-pop_0.3s_ease-out]">
                                        <Check className="h-3 w-3 text-emerald-400" />
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-sm text-white/50">{o.subtitle}</p>
                                  <ul className="mt-2.5 space-y-1">
                                    {o.points.map((p) => (
                                      <li key={p} className="flex items-center gap-2 text-[13px] text-white/45">
                                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
                                        {p}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </button>
                          </Reveal>
                        )
                      })}
                    </div>

                    <Reveal {...revealProps(600)}>
                      <LoginButton
                        status="idle"
                        label="Continue"
                        disabled={!role}
                        onClick={() => setStep(2)}
                      />
                    </Reveal>
                  </div>
                ) : (
                  <div>
                    <Reveal {...revealProps(200)}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    </Reveal>

                    <Reveal {...revealProps(260)}>
                      <h1 className="text-2xl font-bold tracking-tight">
                        {role === 'member' ? 'Create your professional account' : 'Create your account'}
                      </h1>
                      <p className="mt-1 text-white/50">Tell us a little about yourself to get started.</p>
                    </Reveal>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                      <Reveal {...revealProps(340)}>
                        <FloatingInput
                          id="reg-name"
                          label="Full name"
                          icon={<UserRound className="h-[18px] w-[18px]" />}
                          value={form.name}
                          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                        />
                      </Reveal>

                      {role === 'member' && (
                        <Reveal {...revealProps(400)}>
                          <FloatingInput
                            id="reg-profession"
                            label="Profession"
                            icon={<Briefcase className="h-[18px] w-[18px]" />}
                            value={form.profession}
                            onChange={(v) => setForm((f) => ({ ...f, profession: v }))}
                          />
                        </Reveal>
                      )}

                      <Reveal {...revealProps(440)}>
                        <FloatingInput
                          id="reg-email"
                          label="Email address"
                          icon={<Mail className="h-[18px] w-[18px]" />}
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                        />
                      </Reveal>

                      <Reveal {...revealProps(500)}>
                        <FloatingInput
                          id="reg-password"
                          label="Password"
                          icon={<Lock className="h-[18px] w-[18px]" />}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={form.password}
                          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                          rightIcon={
                            <span className={`flex transition-all duration-300 ${showPassword ? 'rotate-[10deg]' : 'rotate-0'}`}>
                              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                            </span>
                          }
                          onRightPress={() => setShowPassword((v) => !v)}
                          rightLabel={showPassword ? 'Hide password' : 'Show password'}
                        />
                      </Reveal>

                      <Reveal {...revealProps(560)}>
                        <FloatingInput
                          id="reg-location"
                          label="Location"
                          icon={<MapPin className="h-[18px] w-[18px]" />}
                          value={form.location}
                          onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                        />
                      </Reveal>

                      {error && (
                        <Reveal {...revealProps(0)}>
                          <p className="animate-[fade-slide_0.35s_ease-out] rounded-lg border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-center text-sm text-red-300">
                            {error}
                          </p>
                        </Reveal>
                      )}

                      <Reveal {...revealProps(620)}>
                        <LoginButton
                          status={status}
                          onClick={() => {}}
                          label="Create account"
                          loadingLabel="Creating account..."
                          successLabel="Account created"
                        />
                      </Reveal>
                    </form>

                    <Reveal {...revealProps(680)}>
                      <p className="mt-6 text-center text-sm text-white/50">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-bright-blue transition-colors hover:text-white">
                          Log in <ArrowRight className="inline h-3.5 w-3.5" />
                        </Link>
                      </p>
                    </Reveal>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
