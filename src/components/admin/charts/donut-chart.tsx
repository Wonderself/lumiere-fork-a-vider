'use client'

type Segment = { label: string; value: number; color: string }

export function DonutChart({ data, size = 180, title }: {
  data: Segment[]
  size?: number
  title?: string
}) {
  if (!data.length) return <div className="text-white/30 text-sm text-center py-8">Pas de données</div>

  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = size / 2 - 10
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 28

  let cumulative = 0
  const segments = data.map(d => {
    const pct = d.value / total
    const start = cumulative
    cumulative += pct
    return { ...d, start, pct }
  })

  function arcPath(startPct: number, pct: number) {
    const startAngle = startPct * 2 * Math.PI - Math.PI / 2
    const endAngle = (startPct + pct) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const large = pct > 0.5 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <div>
      {title && <h3 className="text-sm font-medium text-white/60 mb-3">{title}</h3>}
      <div className="flex items-center gap-6">
        <svg width={size} height={size}>
          {segments.map((s, i) => (
            <path
              key={i}
              d={arcPath(s.start, Math.max(s.pct, 0.01))}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={22} fontWeight="bold">
            {total}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10}>
            total
          </text>
        </svg>
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-white/50">{d.label}</span>
              <span className="text-xs font-medium text-white/80 ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
