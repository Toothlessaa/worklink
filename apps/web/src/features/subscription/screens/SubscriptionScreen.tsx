import { CreditCard, CheckCircle2 } from 'lucide-react'
import { SUBSCRIPTION_PLANS, planLabel } from '@worklink/constants'
import { useCurrentUser, useSubscriptionStore, useCurrentPlan } from '@worklink/state'
import { Card, PlanCard, Badge } from '../../../app/ui'
import { toast } from '../../../shared/toast'

export function SubscriptionScreen() {
  const user = useCurrentUser()
  const currentPlan = useCurrentPlan(user?.id ?? '')
  const setPlan = useSubscriptionStore((s) => s.setPlan)

  if (!user || user.role !== 'member') return null

  const handleChoose = (planId: string) => {
    setPlan(user.id, planId as typeof currentPlan)
    toast(`You are now on the ${planLabel(planId as typeof currentPlan)} plan.`)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-ink-strong lg:text-3xl">Subscription</h1>
      <p className="mt-1 text-ink-soft">
        Choose the plan that fits how you work. More opportunities, more visibility.
      </p>

      <Card className="mt-6 flex items-center gap-4 border-primary/30 bg-primary-soft p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Current plan</p>
          <p className="font-semibold text-ink-strong">{planLabel(currentPlan)}</p>
        </div>
        <Badge tone="primary">
          <CheckCircle2 className="h-3.5 w-3.5" /> Active
        </Badge>
      </Card>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.id === currentPlan}
            onSelect={() => handleChoose(plan.id)}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Prototype only — no real payment processing. Plan changes are simulated locally.
      </p>
    </div>
  )
}