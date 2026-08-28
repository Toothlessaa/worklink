import { ScrollView, View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { VERIFICATION_LABELS } from '@worklink/constants'
import { useCurrentUser, useUser, useCredentialsForMember, useReviewsStore, useAuthStore, useJobsStore } from '@worklink/state'
import { Card, Avatar, StarRating, Badge, Stat, SectionHeader, Text, CredentialCard, EmptyState, Button } from '../../../shared/ui'
import { monthName } from '../../../shared/format'

export function PublicProfileScreen() {
  const t = useTheme()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const user = useUser(id)
  const me = useCurrentUser()
  const credentials = useCredentialsForMember(id ?? '')
  const reviews = useReviewsStore((s) => s.reviews).filter((r) => r.revieweeId === id)
  const jobs = useJobsStore((s) => s.jobs)

  if (!user) {
    return <EmptyState icon="person-outline" title="Profile not found" message="This user may have been removed." action={<Button onPress={() => router.back()}>Back</Button>} />
  }

  const isOwn = me?.id === user.id
  const completedWithUser = jobs.filter(
    (j) => j.status === 'completed' && (j.clientId === user.id || j.selectedMemberId === user.id),
  )

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Card>
        <View style={{ alignItems: 'center' }}>
          <Avatar user={user} size="xl" showVerified={user.verification === 'fullyVerified'} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <Text variant="h1" style={{ fontSize: 22 }}>{user.name}</Text>
            {user.verification !== 'email' && (
              <Ionicons name="shield-checkmark" size={18} color={t.colors.success} />
            )}
          </View>
          {user.profession && <Text variant="body" style={{ color: t.colors.textSecondary }}>{user.profession}</Text>}
          <Text variant="caption">{user.location}</Text>

          <View style={{ flexDirection: 'row', gap: 28, marginTop: 14 }}>
            {user.averageRating !== undefined && (
              <View style={{ alignItems: 'center' }}>
                <StarRating value={user.averageRating} />
                <Text variant="label" style={{ marginTop: 4 }}>{user.averageRating.toFixed(1)}</Text>
              </View>
            )}
            {user.completedJobs !== undefined && (
              <Stat value={user.completedJobs} label="Jobs completed" />
            )}
            {user.experienceYears !== undefined && (
              <Stat value={`${user.experienceYears}y`} label="Experience" />
            )}
            <Stat value={monthName(user.joinedAt).split(' ')[0]} label="Since" />
          </View>

          {isOwn && (
            <Button variant="secondary" style={{ marginTop: 14 }} onPress={() => router.push('/edit-profile')}>
              <Ionicons name="create-outline" size={16} color={t.colors.textPrimary} /> Edit profile
            </Button>
          )}
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: t.colors.divider, marginTop: 16, paddingTop: 14 }}>
          <Text variant="h3">About</Text>
          <Text variant="body" style={{ marginTop: 6, lineHeight: 20 }}>{user.bio}</Text>
        </View>

        {user.skills && user.skills.length > 0 && (
          <View style={{ marginTop: 14 }}>
            <Text variant="h3">Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {user.skills.map((s) => (
                <Badge key={s} tone="neutral">{s}</Badge>
              ))}
            </View>
          </View>
        )}
      </Card>

      {user.role === 'member' && (
        <View style={{ marginTop: 20 }}>
          <SectionHeader
            title="Credentials"
            action={
              isOwn ? (
                <Button size="sm" variant="secondary" onPress={() => router.push('/credentials')}>Manage</Button>
              ) : undefined
            }
          />
          <View style={{ gap: 10 }}>
            {credentials.length === 0 ? (
              <Card>
                <Text variant="body" style={{ color: t.colors.textMuted, textAlign: 'center' }}>No credentials yet.</Text>
              </Card>
            ) : (
              credentials.map((c) => <CredentialCard key={c.id} credential={c} />)
            )}
          </View>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <SectionHeader title="Ratings & Reviews" />
        {reviews.length === 0 ? (
          <Card>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="star-outline" size={28} color={t.colors.textMuted} />
              <Text variant="body" style={{ color: t.colors.textMuted, marginTop: 6 }}>No reviews yet.</Text>
            </View>
          </Card>
        ) : (
          <>
            <Card>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 32, fontFamily: 'Inter_700Bold' }}>
                  {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}
                </Text>
                <StarRating value={reviews.reduce((a, r) => a + r.rating, 0) / reviews.length} />
                <Text variant="caption" style={{ marginTop: 4 }}>{reviews.length} reviews</Text>
              </View>
            </Card>
            <View style={{ gap: 10, marginTop: 12 }}>
              {reviews.map((r) => {
                const reviewer = useAuthStore.getState().users.find((u) => u.id === r.reviewerId)
                return (
                  <Card key={r.id}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                      {reviewer && <Avatar user={reviewer} size="sm" />}
                      <View style={{ flex: 1 }}>
                        <Text variant="label" style={{ fontSize: 14 }}>{reviewer?.name ?? 'Reviewer'}</Text>
                        <StarRating value={r.rating} size={12} />
                        <Text variant="body" style={{ fontSize: 13, marginTop: 4 }}>{r.comment}</Text>
                      </View>
                    </View>
                  </Card>
                )
              })}
            </View>
          </>
        )}
      </View>

      {!isOwn && completedWithUser.length > 0 && (
        <Button style={{ marginTop: 16 }} onPress={() => router.push(`/review/${completedWithUser[0].id}`)}>
          <Ionicons name="star" size={16} color="#FFFFFF" /> Leave a review
        </Button>
      )}
    </ScrollView>
  )
}