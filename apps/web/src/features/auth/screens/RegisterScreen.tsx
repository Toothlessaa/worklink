import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserRound, Wrench, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import type { Role } from '@worklink/types'
import { useAuthStore } from '@worklink/state'
import { Field, Input, ThemeToggle, GradientButton } from '../../../app/ui'
import { toast } from '../../../shared/toast'

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
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    location: 'Maplewood, NJ',
    profession: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Please fill in your name, a valid email, and a password of at least 6 characters.')
      return
    }
    setLoading(true)
    setError(null)
    setTimeout(() => {
      register({
        name: form.name,
        email: form.email,
        password: form.password,
        location: form.location,
        role,
        profession: role === 'member' ? form.profession : undefined,
      })
      navigate('/app')
    }, 600)
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-[url('/bg.png')] lg:bg-[url('/bgfordeskttop.png')]"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pt-4 pb-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="WorkLink" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold text-ink-strong">WorkLink</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-semibold text-primary transition-colors hover:underline">
              Log in
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/50 bg-[rgba(255,255,255,0.55)] p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(11,27,63,0.08)] dark:border-white/10 dark:bg-[rgba(18,26,43,0.55)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-ink-strong">Join WorkLink</h1>
              <p className="mt-1 text-sm text-ink-soft">What would you like to do?</p>
              <div className="mt-6 grid gap-4">
                {roleOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setRole(o.value)}
                    className={`rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.99] ${
                      role === o.value
                        ? 'border-primary bg-primary-soft'
                        : 'border-border bg-surface hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
                        <o.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-ink-strong">{o.title}</h3>
                          {role === o.value && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-ink-soft">{o.subtitle}</p>
                        <ul className="mt-3 space-y-1">
                          {o.points.map((p) => (
                            <li key={p} className="flex items-center gap-2 text-sm text-ink-soft">
                              <Check className="h-3.5 w-3.5 text-success" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <GradientButton
                fullWidth
                className="mt-6"
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="h-4.5 w-4.5" />
              </GradientButton>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="mb-4 flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink-strong"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-2xl font-bold text-ink-strong">
                {role === 'member' ? 'Create your professional account' : 'Create your account'}
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Tell us a little about yourself to get started.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Field label="Full name">
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                {role === 'member' && (
                  <Field label="Profession">
                    <Input
                      placeholder="e.g. Plumber, Electrician, Carpenter"
                      value={form.profession}
                      onChange={(e) => setForm({ ...form, profession: e.target.value })}
                    />
                  </Field>
                )}
                <Field label="Email">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </Field>
                <Field label="Password" hint="At least 6 characters">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </Field>
                <Field label="Location">
                  <Input
                    placeholder="e.g. Maplewood, NJ"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </Field>
                {error && <p className="text-sm text-error">{error}</p>}
                <GradientButton type="submit" fullWidth loading={loading}>
                  {!loading && (
                    <>
                      Create account <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </GradientButton>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary transition-colors hover:underline">
            Log in <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  )
}