import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Star, Search, MessageCircle, CheckCircle2 } from 'lucide-react'
import { CATEGORIES } from '@worklink/constants'
import { Button, Logo, ThemeToggle, CategoryIcon } from '../../../app/ui'

const steps = [
  {
    icon: Search,
    title: 'Post or find a job',
    text: 'Clients post real jobs with a clear budget and schedule. Members browse opportunities that match their skills.',
  },
  {
    icon: MessageCircle,
    title: 'Connect with the right person',
    text: 'Clients review profiles, credentials, and ratings, then select a member. Both sides connect through chat.',
  },
  {
    icon: CheckCircle2,
    title: 'Real work, done well',
    text: 'The job gets done, moves to Done Deal, and both sides leave a rating and review that build trust.',
  },
]

export function LandingScreen() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-divider bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
            <div>
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified skilled professionals
              </div>
              <h1 className="text-4xl leading-tight font-bold tracking-tight text-ink-strong lg:text-5xl">
                Real work. Real people.
                <span className="text-primary"> Real skills.</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-ink-soft">
                WorkLink connects people who need physical work done with trusted, verified
                professionals — plumbers, electricians, carpenters, and repair technicians.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button size="lg">
                    Find a professional <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Find jobs with my skills
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-ink-soft">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  <Star className="h-4 w-4 fill-rating text-rating" />
                </div>
                <span>Rated by real clients after every completed job</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl border border-border bg-surface p-8 shadow-card">
                <div className="rounded-2xl bg-primary-soft p-5">
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">Active job</p>
                  <h3 className="mt-1 text-xl font-bold text-ink-strong">Fix Kitchen Sink Leak</h3>
                  <p className="mt-1 text-sm text-ink-soft">There is a leak underneath my kitchen sink…</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ink-muted">Budget</p>
                      <p className="font-semibold text-ink-strong">$150 · fixed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-muted">Preferred date</p>
                      <p className="font-semibold text-ink-strong">Aug 30</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
                    JM
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-strong">John Mitchell</p>
                    <p className="text-xs text-ink-muted">Plumber · 4.9 rating · 128 jobs</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-divider bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-ink-strong lg:text-3xl">How WorkLink works</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-ink-muted">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-semibold text-ink-strong">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-ink-strong">Services for every job</h2>
          <p className="mt-2 text-center text-ink-soft">
            From quick repairs to full builds — find the right skill for the job.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/register"
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <CategoryIcon icon={c.icon} />
                </div>
                <span className="text-sm font-semibold text-ink-strong">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-divider bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink-muted lg:flex-row lg:px-8">
          <Logo />
          <p>© 2026 WorkLink. Connecting clients with skilled professionals.</p>
        </div>
      </footer>
    </div>
  )
}