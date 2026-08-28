import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@worklink/state'
import { Input, GradientButton, ThemeToggle, DemoPill } from '../../../app/ui'
import { DemoAccountCard } from '../components'
import { toast } from '../../../shared/toast'

const EMAIL_RE = /^\S+@\S+\.\S+$/

export function LoginScreen() {
  const navigate = useNavigate()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

    setLoading(true)
    setGeneralError(null)
    setTimeout(() => {
      const err = login(email)
      setLoading(false)
      if (err) {
        setGeneralError(err)
        return
      }
      navigate('/app')
    }, 600)
  }

  const quickLogin = (id: string) => {
    switchTo(id)
    navigate('/app')
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-[url('/bg.png')] lg:bg-[url('/bgfordeskttop.png')]"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-4 pb-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mt-5 flex flex-col items-center">
          <img src="/logo.png" alt="WorkLink" className="h-24 w-24 object-contain" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-strong">WorkLink</h1>
          <p className="mt-1 text-ink-soft">Connect. Collaborate. Get things done.</p>
        </div>

        <div className="mt-7 rounded-3xl border border-white/50 bg-[rgba(255,255,255,0.55)] p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(11,27,63,0.08)] dark:border-white/10 dark:bg-[rgba(18,26,43,0.55)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <h2 className="text-2xl font-bold text-ink-strong">
            Welcome <span className="text-primary">back!</span>
          </h2>
          <p className="mt-1 text-ink-soft">Log in to continue to WorkLink.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-ink-strong">
                Email address
              </label>
              <Input
                id="login-email"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                error={!!fieldErrors.email}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-error">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-ink-strong">
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  icon={<Lock className="h-4 w-4" />}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  error={!!fieldErrors.password}
                  className="!pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink-strong"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-error">{fieldErrors.password}</p>
              )}
              <div className="mt-1.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => toast("Password reset isn't available in this prototype.", 'info')}
                  className="text-[13px] font-semibold text-primary transition-colors hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {generalError && (
              <div className="rounded-xl bg-error-soft px-3 py-2.5 text-sm font-medium text-error">
                {generalError}
              </div>
            )}

            <GradientButton type="submit" fullWidth loading={loading}>
              {!loading && (
                <>
                  Log in <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </GradientButton>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-muted">
            <div className="h-px flex-1 bg-divider" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              or continue with a demo account <DemoPill />
            </span>
            <div className="h-px flex-1 bg-divider" />
          </div>

          <div className="space-y-2.5">
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
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            <span className="text-xs text-ink-muted">Your data is safe with us</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New to WorkLink?{' '}
          <Link to="/register" className="font-bold text-primary transition-colors hover:underline">
            Create an account <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  )
}