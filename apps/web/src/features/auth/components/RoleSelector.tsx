export type LoginRole = 'client' | 'professional'

export function RoleSelector({ value, onChange }: { value: LoginRole; onChange: (v: LoginRole) => void }) {
  const options: { value: LoginRole; label: string }[] = [
    { value: 'client', label: 'Client' },
    { value: 'professional', label: 'Professional' },
  ]

  return (
    <div className="relative grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.04] p-1">
      <div
        className="absolute inset-y-1 left-1 w-[calc(50%-8px)] rounded-lg bg-gradient-to-r from-primary to-purple-600 shadow-[0_0_16px_rgba(37,99,235,0.35)] transition-transform duration-300 ease-out"
        style={{
          transform: value === 'client' ? 'translateX(0)' : 'translateX(calc(100% + 8px))',
        }}
      />
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`relative z-10 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active ? 'text-white' : 'text-white/45 hover:text-white/70'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
