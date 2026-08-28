import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { SUBSCRIPTION_PLANS, planLabel } from '@worklink/constants'
import { useCurrentUser, useSubscriptionStore, useCurrentPlan } from '@worklink/state'
import { Card, Text, Badge, PlanCard } from '../../../shared/ui'
import { toast } from '../../../shared/toast'

export function SubscriptionScreen() {
  const t = useTheme()
  const user = useCurrentUser()
  const currentPlan = useCurrentPlan(user?.id ?? '')
  const setPlan = useSubscriptionStore((s) => s.setPlan)

  if (!user || user.role !== 'member') return null

  const handleChoose = (planId: string) => {
    setPlan(user.id, planId as any)
    toast(`You are now on the ${planLabel(planId as any)} plan.`)
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text variant="h1">Subscription</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 2 }}>
        Choose the plan that fits how you work.
      </Text>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: t.colors.primary + '40', marginTop: 16 }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="card" size={22} color={t.colors.onPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" style={{ color: t.colors.primary, fontFamily: 'Inter_700Bold' }}>Current plan</Text>
          <Text variant="h3" style={{ fontSize: 16 }}>{planLabel(currentPlan)}</Text>
        </View>
        <Badge tone="primary">Active</Badge>
      </Card>

      <View style={{ gap: 14, marginTop: 20 }}>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === currentPlan} onSelect={() => handleChoose(plan.id)} />
        ))}
      </View>

      <Text variant="caption" style={{ textAlign: 'center', marginTop: 20, color: t.colors.textMuted }}>
        Prototype only — no real payment processing.
      </Text>
    </ScrollView>
  )
}