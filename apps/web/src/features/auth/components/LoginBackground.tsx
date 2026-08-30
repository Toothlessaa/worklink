import type { CSSProperties } from 'react'

const particles = [
  { top: '18%', left: '12%', size: 3, delay: 0, dur: 7 },
  { top: '26%', left: '68%', size: 2, delay: 1.2, dur: 8 },
  { top: '40%', left: '30%', size: 3, delay: 0.6, dur: 6 },
  { top: '55%', left: '82%', size: 2, delay: 2, dur: 9 },
  { top: '64%', left: '18%', size: 2, delay: 1.6, dur: 7.5 },
  { top: '74%', left: '48%', size: 3, delay: 0.9, dur: 8 },
  { top: '32%', left: '88%', size: 2, delay: 2.4, dur: 6.5 },
  { top: '80%', left: '72%', size: 2, delay: 0.3, dur: 7 },
  { top: '12%', left: '44%', size: 2, delay: 1.8, dur: 8.5 },
  { top: '50%', left: '6%', size: 3, delay: 2.8, dur: 9 },
]

export function LoginBackground({
  reduced,
  mouseX = 0.5,
  mouseY = 0.5,
}: {
  reduced: boolean
  mouseX?: number
  mouseY?: number
}) {
  const glowOffsetX = (mouseX - 0.5) * 24
  const glowOffsetY = (mouseY - 0.5) * 18

  const glowStyle = (base: CSSProperties): CSSProperties => ({
    ...base,
    transform: `translate(${glowOffsetX}px, ${glowOffsetY}px)`,
  })

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-navy-900">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />

      <div
        className="absolute inset-y-0 right-0 w-full bg-cover bg-center opacity-25 lg:w-[55%]"
        style={{ backgroundImage: 'url(/bgfordeskttop.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/35" />

      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:26px_26px]" />

      {!reduced && (
        <>
          <div style={glowStyle({ top: '8%', left: '6%' })} className="absolute">
            <div className="h-[28rem] w-[28rem] rounded-full bg-bright-blue/20 blur-[130px] animate-[drift-x_18s_ease-in-out_infinite]" />
          </div>
          <div style={glowStyle({ bottom: '-4%', right: '4%' })} className="absolute">
            <div className="h-[26rem] w-[26rem] rounded-full bg-purple-600/20 blur-[140px] animate-[drift-y_22s_ease-in-out_infinite]" />
          </div>
          <div style={glowStyle({ top: '55%', left: '55%' })} className="absolute">
            <div className="h-64 w-64 rounded-full bg-bright-blue/10 blur-[100px] animate-[drift-x_26s_ease-in-out_infinite]" />
          </div>

          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-[particle_8s_ease-in-out_infinite]"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </>
      )}

      <svg
        className="absolute bottom-0 left-0 w-full text-white/[0.04]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,120 C240,60 480,160 720,110 C960,60 1200,150 1440,90 L1440,200 L0,200 Z"
        />
      </svg>
    </div>
  )
}
