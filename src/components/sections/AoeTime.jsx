const SKILLS = [
  { key: 'Skill0010', name: 'Storm Gust',                    default: 4700 },
  { key: 'Skill0011', name: 'Meteor Storm',                  default: 1000 },
  { key: 'Skill0012', name: 'Lord of Vermilion',             default: 4100 },
  { key: 'Skill0013', name: "Heaven's Drive",                default: 1000 },
  { key: 'Skill0014', name: 'Thunderstorm',                  default: 1000 },
  { key: 'Skill0015', name: 'Grand Cross / Grand Cross of Darkness', default: 1800 },
]

function msToDisplay(ms) {
  const n = parseInt(ms) || 0
  if (n < 1000) return `${n} ms`
  return `${(n / 1000).toFixed(2).replace(/\.?0+$/, '')} s`
}

export default function AoeTime({ get, set }) {
  return (
    <div className="section-card">
      <h2 className="section-title">AOE Timings</h2>
      <p className="section-subtitle">
        How long each AOE overlay is displayed on screen, in milliseconds.
        This is purely visual — it does not affect actual skill duration.
      </p>

      <div className="space-y-1">
        {SKILLS.map(({ key, name, default: def }) => {
          const val = get(key) || String(def)
          const ms = parseInt(val) || 0

          return (
            <div key={key} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
              <div className="w-48 flex-shrink-0">
                <div className="text-text font-display font-semibold text-sm">{name}</div>
                <div className="badge mt-0.5">{key}</div>
              </div>

              {/* Duration bar */}
              <div className="flex-1 relative h-1.5 bg-panel rounded-full overflow-hidden border border-border">
                <div
                  className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all"
                  style={{ width: `${Math.min((ms / 6000) * 100, 100)}%` }}
                />
              </div>

              {/* Input + unit display */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={val}
                  onChange={e => set(key, e.target.value)}
                  className="field-input w-24 text-right"
                />
                <span className="text-muted text-xs font-mono w-6">ms</span>
                <span className="text-accent font-mono text-xs w-12 text-right">{msToDisplay(val)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
