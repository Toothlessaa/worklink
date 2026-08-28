import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { CATEGORIES, categoryLabel } from '@worklink/constants'
import type { Job, User, Review, Credential as CredentialType, Conversation, Message } from '@worklink/types'
import { Card, Badge, StatusChip, Avatar, StarRating, Button, Text } from './primitives'
import { formatMoney, timeAgo, formatDate, formatTime } from '../format'

const categoryIcons: Record<string, string> = {
  water: 'water-outline',
  flash: 'flash-outline',
  hammer: 'hammer-outline',
  wrench: 'wrench-outline',
  paint: 'color-palette-outline',
  grid: 'grid-outline',
  default: 'home-outline',
}

export function CategoryIcon({ icon, size = 20, color }: { icon: string; size?: number; color?: string }) {
  return <Ionicons name={(categoryIcons[icon] ?? categoryIcons.default) as any} size={size} color={color} />
}

export function CategoryCard({ meta, onPress }: { meta: { id: string; label: string; tagline: string; icon: string }; onPress?: () => void }) {
  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{ alignItems: 'center', gap: 6, borderRadius: 16, borderWidth: 1, borderColor: t.colors.border, backgroundColor: t.colors.surface, paddingVertical: 16, paddingHorizontal: 8, flex: 1 }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <CategoryIcon icon={meta.icon} color={t.colors.primary} />
      </View>
      <Text variant="label" style={{ fontSize: 13 }}>{meta.label}</Text>
    </Pressable>
  )
}

export function JobCard({ job, onPress }: { job: Job; onPress?: () => void }) {
  const t = useTheme()
  const meta = CATEGORIES.find((c) => c.id === job.category)
  return (
    <Card onPress={onPress}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <CategoryIcon icon={meta?.icon ?? 'default'} color={t.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <Text variant="h3" style={{ fontSize: 16 }}>{job.title}</Text>
            <StatusChip status={job.status} />
          </View>
          <Text variant="caption" style={{ marginTop: 2 }}>{meta?.label} · {job.location}</Text>
          <Text variant="caption" style={{ marginTop: 6 }} numberOfLines={2}>{job.description}</Text>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
            <Text variant="caption">{formatMoney(job.budget.amount, job.budget.type)}</Text>
            <Text variant="caption">{formatDate(job.preferredDate)}</Text>
            <Text variant="caption">{timeAgo(job.createdAt)}</Text>
            <Text variant="caption">{job.interestedMemberIds.length} interested</Text>
          </View>
        </View>
      </View>
    </Card>
  )
}

export function MemberCard({ member, onViewProfile, onSelect, isSelected }: { member: User; onViewProfile?: () => void; onSelect?: () => void; isSelected?: boolean }) {
  const t = useTheme()
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Avatar user={member} size="lg" showVerified={member.verification === 'fullyVerified'} />
        <View style={{ flex: 1 }}>
          <Text variant="h3" style={{ fontSize: 16 }}>{member.name}</Text>
          <Text variant="caption">{member.profession} · {member.location}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <StarRating value={member.averageRating ?? 0} />
            <Text variant="caption">{member.averageRating?.toFixed(1)} ({member.completedJobs} jobs)</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {member.skills?.slice(0, 3).map((s) => (
              <Badge key={s} tone="neutral">{s}</Badge>
            ))}
          </View>
          {(onViewProfile || onSelect) && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              {onViewProfile && <Button variant="secondary" size="sm" onPress={onViewProfile}>View Profile</Button>}
              {onSelect && !isSelected && <Button size="sm" onPress={onSelect}>Select</Button>}
              {isSelected && <Badge tone="success">Selected</Badge>}
            </View>
          )}
        </View>
      </View>
    </Card>
  )
}

export function ReviewCard({ review, reviewer }: { review: Review; reviewer?: Pick<User, 'name' | 'avatarHue' | 'verification'> }) {
  const t = useTheme()
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        {reviewer && <Avatar user={reviewer} size="sm" />}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="label" style={{ fontSize: 14 }}>{reviewer?.name ?? 'Reviewer'}</Text>
            <Text variant="caption">{formatDate(review.createdAt)}</Text>
          </View>
          <StarRating value={review.rating} size={13} />
          <Text variant="body" style={{ fontSize: 14, marginTop: 4 }}>{review.comment}</Text>
        </View>
      </View>
    </Card>
  )
}

export function CredentialCard({ credential }: { credential: CredentialType }) {
  const t = useTheme()
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={credential.status === 'verified' ? 'ribbon-outline' : 'document-text-outline'} size={20} color={t.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Text variant="label" style={{ fontSize: 14, flex: 1 }}>{credential.title}</Text>
            <Badge tone={credential.status === 'verified' ? 'success' : 'warning'}>{credential.status === 'verified' ? 'Verified' : 'Pending'}</Badge>
          </View>
          <Text variant="caption">{credential.issuer}</Text>
          {credential.number && <Text variant="caption"># {credential.number}</Text>}
        </View>
      </View>
    </Card>
  )
}

export function PlanCard({ plan, isCurrent, onSelect }: { plan: { id: string; name: string; price: number; period: string; tagline: string; features: string[]; highlighted?: boolean }; isCurrent?: boolean; onSelect?: () => void }) {
  const t = useTheme()
  return (
    <Card style={plan.highlighted ? { borderWidth: 2, borderColor: t.colors.primary } : undefined}>
      {plan.highlighted && (
        <View style={{ position: 'absolute', top: -10, left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ backgroundColor: t.colors.primary, paddingHorizontal: 12, paddingVertical: 3, borderRadius: 999 }}>
            <Text style={{ color: t.colors.onPrimary, fontSize: 11, fontFamily: 'Inter_700Bold' }}>Recommended</Text>
          </View>
        </View>
      )}
      <Text variant="h3" style={{ textAlign: 'center' }}>{plan.name}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <Text style={{ fontSize: 28, fontFamily: 'Inter_700Bold' }}>${plan.price}</Text>
        <Text variant="caption">{plan.period}</Text>
      </View>
      <Text variant="caption" style={{ textAlign: 'center', marginTop: 4 }}>{plan.tagline}</Text>
      <View style={{ gap: 6, marginTop: 12 }}>
        {plan.features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <Ionicons name="checkmark-circle" size={16} color={t.colors.success} style={{ marginTop: 2 }} />
            <Text variant="body" style={{ fontSize: 13, flex: 1 }}>{f}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 14 }}>
        {isCurrent ? (
          <Button variant="secondary" fullWidth disabled>Current Plan</Button>
        ) : (
          <Button variant={plan.highlighted ? 'primary' : 'secondary'} fullWidth onPress={onSelect}>Choose {plan.name}</Button>
        )}
      </View>
    </Card>
  )
}

export function ConversationItem({ otherUser, lastMessage, unread, active, onPress }: { otherUser?: Pick<User, 'name' | 'avatarHue' | 'verification' | 'profession'>; lastMessage?: string; unread?: number; active?: boolean; onPress?: () => void }) {
  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4, backgroundColor: active ? t.colors.primarySoft : 'transparent', borderRadius: 12 }}
    >
      {otherUser && <Avatar user={otherUser} size="md" />}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="label" style={{ fontSize: 14 }}>{otherUser?.name ?? 'Unknown'}</Text>
          {unread && unread > 0 ? (
            <View style={{ backgroundColor: t.colors.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
              <Text style={{ color: t.colors.onPrimary, fontSize: 11, fontFamily: 'Inter_700Bold' }}>{unread}</Text>
            </View>
          ) : null}
        </View>
        {lastMessage && (
          <Text variant="caption" numberOfLines={1}>{lastMessage}</Text>
        )}
      </View>
    </Pressable>
  )
}

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const t = useTheme()
  return (
    <View style={{ alignItems: isOwn ? 'flex-end' : 'flex-start', marginVertical: 3 }}>
      <View
        style={{
          maxWidth: '78%',
          borderRadius: 16,
          borderBottomRightRadius: isOwn ? 4 : 16,
          borderBottomLeftRadius: isOwn ? 16 : 4,
          paddingHorizontal: 14,
          paddingVertical: 9,
          backgroundColor: isOwn ? t.colors.primary : t.colors.surfaceMuted,
        }}
      >
        {message.kind === 'attachment' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="attach" size={14} color={isOwn ? t.colors.onPrimary : t.colors.textSecondary} />
            <Text style={{ color: isOwn ? t.colors.onPrimary : t.colors.textSecondary, fontSize: 14, fontFamily: 'Inter_500Medium' }}>{message.text}</Text>
          </View>
        ) : (
          <Text style={{ color: isOwn ? t.colors.onPrimary : t.colors.textPrimary, fontSize: 14, lineHeight: 20 }}>{message.text}</Text>
        )}
        <Text style={{ color: isOwn ? t.colors.onPrimary + 'CC' : t.colors.textMuted, fontSize: 10, textAlign: 'right', marginTop: 3 }}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  )
}

export function ActivityItem({ type, jobTitle, userName, at }: { type: string; jobTitle?: string; userName?: string; at: string }) {
  const t = useTheme()
  const icons: Record<string, string> = {
    jobCreated: 'add-circle-outline',
    interest: 'person-add-outline',
    selected: 'checkmark-circle-outline',
    completed: 'checkmark-done-outline',
    review: 'star-outline',
  }
  const labels: Record<string, string> = {
    jobCreated: 'Posted a new job',
    interest: 'expressed interest',
    selected: 'was selected for',
    completed: 'completed',
    review: 'left a review on',
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={(icons[type] ?? icons.jobCreated) as any} size={15} color={t.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontSize: 13 }}>
          {userName && <RNTextBold>{userName} </RNTextBold>}
          <RNTextSoft>{labels[type]}</RNTextSoft>
          {jobTitle && <RNTextBold> {jobTitle}</RNTextBold>}
        </Text>
        <Text variant="caption">{timeAgo(at)}</Text>
      </View>
    </View>
  )
}

function RNTextBold({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontFamily: 'Inter_600SemiBold' }}>{children}</Text>
}
function RNTextSoft({ children }: { children: React.ReactNode }) {
  const t = useTheme()
  return <Text style={{ color: t.colors.textSecondary }}>{children}</Text>
}