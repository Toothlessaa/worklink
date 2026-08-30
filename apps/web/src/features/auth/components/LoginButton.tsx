import { Loader2, ArrowRight, Check } from 'lucide-react'

export type ButtonStatus = 'idle' | 'loading' | 'success'

export function LoginButton({
  status,
  onClick,
  disabled,
  label = 'Log in',
  loadingLabel = 'Logging in...',
  successLabel = 'Login successful',
}: {
  status: ButtonStatus
  onClick: () => void
  disabled?: boolean
  label?: string
  loadingLabel?: string
  successLabel?: string
}) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || status === 'loading' || status === 'success'}
      className="group relative flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-primary via-blue-500 to-purple-600 font-semibold text-white shadow-[0_6px_24px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(37,99,235,0.6)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-80"
    >
      {status === 'loading' && (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="animate-[fade-slide_0.2s_ease-out]">{loadingLabel}</span>
        </>
      )}
      {status === 'success' && (
        <span className="flex items-center gap-2 text-emerald-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/30 animate-[check-pop_0.4s_ease-out]">
            <Check className="h-3.5 w-3.5 text-emerald-300" />
          </span>
          <span className="animate-[fade-slide_0.2s_ease-out]">{successLabel}</span>
        </span>
      )}
      {status === 'idle' && (
        <>
          <span>{label}</span>
          <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  )
}