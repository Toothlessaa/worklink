import { useEffect, useRef, useState, type ReactNode } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    setDesktop(mq.matches)
    const fn = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return desktop
}

export function Reveal({ delay = 0, className = '', children }: { delay?: number; className?: string; children: ReactNode }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function SlideIn({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div
      className={`flex items-center gap-2.5 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        on ? 'translate-x-0 scale-100 opacity-100' : '-translate-x-3 scale-95 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function useMouseParallax() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const isDesktop = useIsDesktop()
  const reduced = usePrefersReducedMotion()
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!isDesktop || reduced) return
    const onMove = (e: MouseEvent) => {
      if (timer.current !== null) return
      timer.current = window.setTimeout(() => {
        timer.current = null
        setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
      }, 40)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [isDesktop, reduced])

  return mouse
}

export function useCardTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const isDesktop = useIsDesktop()
  const reduced = usePrefersReducedMotion()

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * 2, y: px * 2 })
  }

  const onMouseLeave = () => setTilt({ x: 0, y: 0 })

  const tiltStyle =
    isDesktop && !reduced
      ? {
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 200ms ease-out',
        }
      : undefined

  return { onMouseMove, onMouseLeave, tiltStyle }
}
