'use client'

type BarData = { label: string; value: number; color?: string }

export function BarChart({ data, height = 200, title }: {
  data: BarData[]
  height?: number
  title?: string
}) {
  if (!data.length) return <div className="text-white/30 text-sm text-center py-8">Pas de données</div>
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div>
      {title && <h3 className="text-sm font-medium text-white/60 mb-3">{title}</h3>}
      <div className="space-y-2" style={{ maxHeight: height }}>
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-24 text-right truncate shrink-0">{d.label}</span>
            <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  background: d.color || 'linear-gradient(90deg, #E50914, #FF2D2D)',
                }}
              />
            </div>
            <span className="text-xs font-medium text-white/60 w-12 shrink-0">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
