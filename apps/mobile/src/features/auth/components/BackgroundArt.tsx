import { View } from 'react-native'
import Svg, { Rect, Path, Circle } from 'react-native-svg'
import { useTheme } from '@worklink/theme'

export function BackgroundArt({ height = 340 }: { height?: number }) {
  const t = useTheme()
  const isDark = t.mode === 'dark'
  const primary = t.colors.primary

  const skylineOpacity = isDark ? 0.16 : 0.08
  const lineOpacity = isDark ? 0.28 : 0.16
  const dotOpacity = isDark ? 0.4 : 0.22
  const cloudOpacity = isDark ? 0.14 : 0.08

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 340" preserveAspectRatio="xMidYMax slice">
        <Path
          d="M60 140 C100 110 140 118 170 138"
          stroke={primary}
          strokeWidth={1.5}
          strokeOpacity={lineOpacity}
          fill="none"
        />
        <Path
          d="M170 138 C210 150 250 128 300 142"
          stroke={primary}
          strokeWidth={1.5}
          strokeOpacity={lineOpacity}
          fill="none"
        />
        <Path
          d="M300 142 C335 150 360 136 384 148"
          stroke={primary}
          strokeWidth={1.5}
          strokeOpacity={lineOpacity}
          fill="none"
        />
        <Circle cx={60} cy={140} r={4} fill={primary} fillOpacity={dotOpacity} />
        <Circle cx={170} cy={138} r={4} fill={primary} fillOpacity={dotOpacity} />
        <Circle cx={300} cy={142} r={4} fill={primary} fillOpacity={dotOpacity} />
        <Circle cx={384} cy={148} r={4} fill={primary} fillOpacity={dotOpacity} />

        <Circle cx={96} cy={72} r={26} fill={primary} fillOpacity={cloudOpacity} />
        <Circle cx={128} cy={62} r={34} fill={primary} fillOpacity={cloudOpacity} />
        <Circle cx={160} cy={74} r={24} fill={primary} fillOpacity={cloudOpacity} />
        <Circle cx={320} cy={44} r={20} fill={primary} fillOpacity={cloudOpacity} />
        <Circle cx={348} cy={36} r={28} fill={primary} fillOpacity={cloudOpacity} />
        <Circle cx={376} cy={46} r={18} fill={primary} fillOpacity={cloudOpacity} />

        <Circle cx={228} cy={90} r={9} fill={primary} fillOpacity={dotOpacity} />
        <Circle cx={228} cy={118} r={13} fill={primary} fillOpacity={dotOpacity * 0.8} />

        <Rect x={0} y={214} width={34} height={126} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={44} y={188} width={48} height={152} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={102} y={228} width={30} height={112} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={142} y={198} width={56} height={142} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={208} y={238} width={28} height={102} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={246} y={204} width={46} height={136} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={302} y={230} width={32} height={110} rx={4} fill={primary} fillOpacity={skylineOpacity} />
        <Rect x={344} y={192} width={56} height={148} rx={4} fill={primary} fillOpacity={skylineOpacity} />
      </Svg>
    </View>
  )
}
