import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Search,
  MessageCircle,
  CheckCircle2,
  Droplets,
  Zap,
  Hammer,
  Wrench,
  Paintbrush,
  LayoutGrid,
  Menu,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Users,
  BadgeCheck,
} from 'lucide-react'
import { CATEGORIES } from '@worklink/constants'
import { ThemeToggle } from '../../../app/ui'
import type { ReactNode } from 'react'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

const navLinks = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Services', id: 'services' },
  { label: 'For professionals', id: 'trust' },
  { label: 'For clients', id: 'cta' },
  { label: 'About us', id: 'footer' },
]

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function WMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      W
    </div>
  )
}

function Navbar() {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-white/10 bg-navy-900/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
          <WMark />
          <span className="text-lg font-bold tracking-tight text-white">WorkLink</span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-semibold text-white/80 transition-colors hover:text-white">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-primary to-purple-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_4px_24px_rgba(37,99,235,0.6)]"
          >
            Get started
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-xl border border-white/15 bg-white/5 p-2 text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-900/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setOpen(false)
                  scrollToId(l.id)
                }}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </button>
            ))}
            <div className="mt-3 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-primary to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

const stepIcons = [Search, MessageCircle, CheckCircle2]
const steps = [
  {
    title: 'Post or find a job',
    text: 'Clients post real jobs with a clear budget and schedule. Members browse opportunities that match their skills.',
  },
  {
    title: 'Connect with the right person',
    text: 'Clients review profiles, credentials, and ratings, then select a member. Both sides connect through chat.',
  },
  {
    title: 'Real work, done well',
    text: 'The job gets done, moves to Done Deal, and both sides leave a rating and review that build trust.',
  },
]

const serviceIcons: Record<string, typeof Droplets> = {
  water: Droplets,
  flash: Zap,
  hammer: Hammer,
  wrench: Wrench,
  paint: Paintbrush,
  grid: LayoutGrid,
}

const avatars = [
  { initials: 'SC', hue: 262 },
  { initials: 'JM', hue: 205 },
  { initials: 'MT', hue: 152 },
  { initials: 'CB', hue: 28 },
]

function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-full bg-cover bg-center opacity-75 lg:w-[62%]"
        style={{ backgroundImage: 'url(/hero.png)' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/40 lg:to-navy-900/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-navy-900/40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:26px_26px]"
      />
      <div aria-hidden className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-bright-blue/25 blur-[130px]" />
      <div aria-hidden className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-purple-600/25 blur-[140px]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 py-28 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="max-w-xl">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Verified skilled professionals
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="mt-6 text-5xl leading-[1.08] font-bold tracking-tight text-white lg:text-6xl">
              Real work.
              <br />
              Real people.
              <br />
              <span className="bg-gradient-to-r from-bright-blue via-primary to-purple-500 bg-clip-text text-transparent">
                Real skills.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft-gray">
              WorkLink connects people who need physical work done with trusted, verified professionals —
              plumbers, electricians, carpenters, and repair technicians.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_24px_rgba(37,99,235,0.45)] transition-all hover:shadow-[0_6px_32px_rgba(37,99,235,0.65)]"
              >
                Find a professional
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Find jobs with my skills
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {avatars.map((a) => (
                  <div
                    key={a.initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy-900 text-xs font-bold text-white"
                    style={{ backgroundColor: `hsl(${a.hue} 52% 45%)` }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-rating text-rating" />
                  ))}
                </div>
                <p className="mt-1 text-sm text-white/70">Rated by real clients after every completed job</p>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="relative hidden md:block">
          <FadeIn delay={200}>
            <div className="relative ml-auto w-full max-w-md rounded-[22px] border border-white/15 bg-white/[0.06] p-6 shadow-[0_0_50px_rgba(59,130,246,0.25)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-bright-blue uppercase">Active job</p>
              <h3 className="mt-2 text-xl font-bold text-white">Fix Kitchen Sink Leak</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                There is a leak underneath my kitchen sink...
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/40">Budget</p>
                  <p className="mt-0.5 font-semibold text-white">$150 · fixed</p>
                </div>
                <div>
                  <p className="text-xs text-white/40">Preferred date</p>
                  <p className="mt-0.5 font-semibold text-white">Aug 30, 2026</p>
                </div>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-sm font-bold text-white">
                  JM
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">John Mitchell</p>
                  <p className="text-xs text-white/50">Plumber · 4.9 rating · 128 jobs</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
            </div>

            <div className="absolute -left-8 top-12 animate-[float_5s_ease-in-out_infinite]">
              <div className="rounded-2xl border border-white/15 bg-navy-800/80 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <p className="text-[10px] tracking-wide text-white/50 uppercase">Trusted by</p>
                <p className="text-lg font-bold text-white">
                  10K+ <span className="text-sm font-medium text-white/70">clients</span>
                </p>
              </div>
            </div>

            <div className="absolute -right-4 bottom-6 animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-navy-800/80 px-3.5 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-white">Verified pros only</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900 lg:text-4xl">How WorkLink works</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-purple-600" />
        </FadeIn>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-primary/25 md:block"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = stepIcons[i]
              return (
                <FadeIn key={s.title} delay={i * 120}>
                  <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft to-purple-600/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-primary">
                        STEP 0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-navy-900">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.text}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-section py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn className="text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Our services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 lg:text-4xl">
            Services for every job
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-soft-gray">
            From quick repairs to full builds — find the right skill for the job.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => {
            const Icon = serviceIcons[c.icon] ?? LayoutGrid
            return (
              <FadeIn key={c.id} delay={i * 60}>
                <Link
                  to="/register"
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-purple-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.35)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-navy-900">{c.label}</span>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      </div>

      <svg
        aria-hidden
        className="absolute -bottom-1 left-0 w-full text-primary/10"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,48 C240,90 480,90 720,60 C960,30 1200,20 1440,55 L1440,90 L0,90 Z"
        />
      </svg>
    </section>
  )
}

const metrics = [
  { value: '10K+', label: 'Verified professionals' },
  { value: '50K+', label: 'Jobs completed' },
  { value: '4.9/5', label: 'Average client rating' },
]

function Trust() {
  return (
    <section id="trust" className="relative overflow-hidden bg-white py-24">
      <div aria-hidden className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
      <div aria-hidden className="absolute right-1/4 -bottom-20 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900 lg:text-4xl">Built around trust.</h2>
        </FadeIn>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {metrics.map((m, i) => (
            <FadeIn key={m.label} delay={i * 120} className="text-center">
              <p className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                {m.value}
              </p>
              <p className="mt-2 text-soft-gray">{m.label}</p>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200} className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
            Every completed job helps build a stronger reputation for both clients and professionals.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section id="cta" className="relative overflow-hidden bg-navy-900 py-24 text-center">
      <div aria-hidden className="absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-bright-blue/20 blur-[140px]" />
      <div aria-hidden className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-purple-600/20 blur-[130px]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]"
      />

      <div className="relative mx-auto max-w-3xl px-4 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-5xl">
            Ready to get the job done?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-soft-gray">
            Find trusted professionals or turn your skills into your next opportunity.
          </p>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_6px_24px_rgba(37,99,235,0.45)] transition-all hover:shadow-[0_6px_32px_rgba(37,99,235,0.7)]"
            >
              Find a professional
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Join as a professional
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

const socials = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Twitter, label: 'Twitter' },
]

function Footer() {
  return (
    <footer id="footer" className="bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <WMark />
              <span className="text-lg font-bold tracking-tight text-white">WorkLink</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Connecting clients with skilled professionals.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-2.5">
              {['About us', 'How it works', 'Careers', 'Blog'].map((l) => (
                <li key={l}>
                  <a href="#how-it-works" className="text-sm text-white/55 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Support</p>
            <ul className="mt-4 space-y-2.5">
              {['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'].map((l) => (
                <li key={l}>
                  <a href="#footer" className="text-sm text-white/55 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Stay updated</p>
            <p className="mt-3 text-sm text-white/50">Get tips, updates, and exclusive offers.</p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary/60 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-[0_4px_20px_rgba(37,99,235,0.5)]"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-5 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#footer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-all hover:border-primary/50 hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">© 2026 WorkLink. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-sm text-white/50">
            <Users className="h-4 w-4" /> Built with trust. Powered by people.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function LandingScreen() {
  return (
    <div className="min-h-full bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <Trust />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
