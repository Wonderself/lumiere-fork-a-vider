'use client'

type DataPoint = { label: string; value: number }

export function AreaChart({ data, color = '#22c55e', height = 180, title }: {
  data: DataPoint[]
  color?: string
  height?: number
  title?: string
}) {
  if (!data.length) return <div className="text-white/30 text-sm text-center py-8">Pas de données</div>

  const w = 600
  const h = height
  const pad = { top: 16, right: 16, bottom: 36, left: 44 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom

  const max = Math.max(...data.map(d => d.value), 1)

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - (d.value / max) * chartH,
  }))

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${lineD} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`

  return (
    <div>
      {title && <h3 className="text-sm font-medium text-white/60 mb-3">{title}</h3>}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0, 0.5, 1].map(t => (
          <g key={t}>
            <line
              x1={pad.left} y1={pad.top + chartH - t * chartH}
              x2={w - pad.right} y2={pad.top + chartH - t * chartH}
              stroke="rgba(255,255,255,0.05)"
            />
            <text x={pad.left - 6} y={pad.top + chartH - t * chartH + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={10}>
              {Math.round(t * max)}
            </text>
          </g>
        ))}
        <defs>
          <linearGradient id={`area-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#area-grad-${color.replace('#', '')})`} />
        <path d={lineD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
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
