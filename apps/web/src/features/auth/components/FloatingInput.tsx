import { useState, type ReactNode, type InputHTMLAttributes } from 'react'

export function FloatingInput({
  id,
  label,
  icon,
  type = 'text',
  autoComplete,
  value,
  onChange,
  error,
  rightIcon,
  onRightPress,
  rightLabel,
}: {
  id: string
  label: string
  icon: ReactNode
  type?: string
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete']
  value: string
  onChange: (v: string) => void
  error?: boolean
  rightIcon?: ReactNode
  onRightPress?: () => void
  rightLabel?: string
}) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0

  return (
    <div className={`transition-all duration-300 ${focused ? '-translate-y-0.5' : ''}`}>
      <div
        className={`group relative flex items-center rounded-xl border bg-white/[0.05] transition-all duration-300 ${
          error
            ? 'border-red-400/60'
            : focused
              ? 'border-primary/70 shadow-[0_0_22px_rgba(37,99,235,0.28)]'
              : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span
          className={`pointer-events-none absolute left-4 transition-colors duration-300 ${
            error ? 'text-red-400' : focused ? 'text-bright-blue' : 'text-white/40'
          }`}
        >
          {icon}
        </span>

        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={label}
          aria-invalid={error}
          className="peer w-full rounded-xl bg-transparent pb-2.5 pl-11 pr-11 pt-6 text-[15px] text-white outline-none placeholder:text-transparent"
          placeholder={label}
        />

        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-11 origin-left transition-all duration-200 ease-out ${
            floated
              ? 'top-2 text-[10px] font-medium tracking-wide text-bright-blue'
              : 'top-1/2 -translate-y-1/2 text-[15px] text-white/40'
          }`}
        >
          {label}
        </label>

        {rightIcon && (
          <button
            type="button"
            onClick={onRightPress}
            aria-label={rightLabel}
            className={`absolute right-3 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 hover:bg-white/10 ${
              focused ? 'text-bright-blue' : 'text-white/40'
            }`}
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  )
}
