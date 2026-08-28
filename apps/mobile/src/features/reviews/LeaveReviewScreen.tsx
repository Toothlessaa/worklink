import { useState } from 'react'
import { View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useTheme } from '@worklink/theme'
import { useCurrentUser, useReviewsStore, useUser } from '@worklink/state'
import { Screen, Button, Field, Input, Text, StarRating } from '../../shared/ui'
import { toast } from '../../shared/toast'

export function LeaveReviewScreen() {
  const t = useTheme()
  const router = useRouter()
  const { jobId } = useLocalSearchParams<{ jobId: string }>()
  const user = useCurrentUser()
  const addReview = useReviewsStore((s) => s.addReview)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (rating === 0 || !user || !jobId) return
    addReview({ jobId, reviewerId: user.id, revieweeId: 'u-sarah', rating, comment })
    toast('Review submitted!')
    router.back()
  }

  return (
    <Screen>
      <Text variant="h1">Leave a Review</Text>
      <Text variant="body" style={{ color: t.colors.textSecondary, marginTop: 4 }}>How was the experience?</Text>
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <StarRating value={rating} size={40} interactive onChange={setRating} />
        <Text variant="body" style={{ marginTop: 8, color: t.colors.textMuted }}>
          {rating === 0 ? 'Tap a star to rate' : `You rated ${rating} out of 5`}
        </Text>
      </View>
      <Field label="Your review">
        <Input
          multiline
          placeholder="How was the work? How was the experience?"
          value={comment}
          onChangeText={setComment}
        />
      </Field>
      <Button size="lg" fullWidth style={{ marginTop: 16 }} disabled={rating === 0} onPress={handleSubmit}>
        Submit review
      </Button>
    </Screen>
  )
}