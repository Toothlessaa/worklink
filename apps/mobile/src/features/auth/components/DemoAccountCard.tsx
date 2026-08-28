import { Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@worklink/theme'
import { Text, FONTS } from '../../../shared/ui'

export function DemoAccountCard({
  name,
  initialsText,
  avatarColor,
  subtitle,
  onPress,
}: {
  name: string
  initialsText: string
  avatarColor: string
  subtitle: string
  onPress: () => void
}) {
  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue as ${name}, ${subtitle}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 14,
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: avatarColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: '#FFFFFF' }}>{initialsText}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="label" style={{ fontSize: 15 }}>{name}</Text>
        <Text variant="caption" style={{ color: t.colors.textMuted }}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} />
    </Pressable>
  )
}
