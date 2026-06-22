'use client'

type DataPoint = { label: string; value: number }

export function LineChart({ data, color = '#E50914', height = 200, title }: {
  data: DataPoint[]
  color?: string
  height?: number
  title?: string
}) {
  if (!data.length) return <div className="text-white/30 text-sm text-center py-8">Pas de données</div>

  const w = 600
  const h = height
  const pad = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom

  const max = Math.max(...data.map(d => d.value), 1)
  const min = 0

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((d.value - min) / (max - min || 1)) * chartH,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    value: Math.round(min + t * (max - min)),
    y: pad.top + chartH - t * chartH,
  }))

  return (
    <div>
      {title && <h3 className="text-sm font-medium text-white/60 mb-3">{title}</h3>}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map(t => (
          <g key={t.value}>
            <line x1={pad.left} y1={t.y} x2={w - pad.right} y2={t.y} stroke="rgba(255,255,255,0.05)" />
            <text x={pad.left - 8} y={t.y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={10}>
              {t.value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaD} fill={`${color}15`} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}

        {/* X labels */}
        {data.map((d, i) => {
          if (data.length > 12 && i % Math.ceil(data.length / 6) !== 0) return null
          return (
            <text key={i} x={points[i].x} y={h - 8} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10}>
              {d.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
