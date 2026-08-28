export function BackgroundArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{ height: '38vh', minHeight: 240 }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 400 340"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <path
          d="M60 140 C100 110 140 118 170 138"
          stroke="var(--wl-primary)"
          strokeWidth={1.5}
          strokeOpacity={0.16}
        />
        <path
          d="M170 138 C210 150 250 128 300 142"
          stroke="var(--wl-primary)"
          strokeWidth={1.5}
          strokeOpacity={0.16}
        />
        <path
          d="M300 142 C335 150 360 136 384 148"
          stroke="var(--wl-primary)"
          strokeWidth={1.5}
          strokeOpacity={0.16}
        />
        <circle cx={60} cy={140} r={4} fill="var(--wl-primary)" fillOpacity={0.22} />
        <circle cx={170} cy={138} r={4} fill="var(--wl-primary)" fillOpacity={0.22} />
        <circle cx={300} cy={142} r={4} fill="var(--wl-primary)" fillOpacity={0.22} />
        <circle cx={384} cy={148} r={4} fill="var(--wl-primary)" fillOpacity={0.22} />

        <circle cx={96} cy={72} r={26} fill="var(--wl-primary)" fillOpacity={0.08} />
        <circle cx={128} cy={62} r={34} fill="var(--wl-primary)" fillOpacity={0.08} />
        <circle cx={160} cy={74} r={24} fill="var(--wl-primary)" fillOpacity={0.08} />
        <circle cx={320} cy={44} r={20} fill="var(--wl-primary)" fillOpacity={0.08} />
        <circle cx={348} cy={36} r={28} fill="var(--wl-primary)" fillOpacity={0.08} />
        <circle cx={376} cy={46} r={18} fill="var(--wl-primary)" fillOpacity={0.08} />

        <circle cx={228} cy={90} r={9} fill="var(--wl-primary)" fillOpacity={0.22} />
        <circle cx={228} cy={118} r={13} fill="var(--wl-primary)" fillOpacity={0.18} />

        <rect x={0} y={214} width={34} height={126} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={44} y={188} width={48} height={152} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={102} y={228} width={30} height={112} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={142} y={198} width={56} height={142} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={208} y={238} width={28} height={102} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={246} y={204} width={46} height={136} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={302} y={230} width={32} height={110} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
        <rect x={344} y={192} width={56} height={148} rx={4} fill="var(--wl-primary)" fillOpacity={0.08} />
      </svg>
    </div>
  )
}
