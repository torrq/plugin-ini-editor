import { useState } from 'react'
import { SKILL_BY_KEY, GROUP_COLORS } from '../../skills'

function msToDisplay(ms) {
  const n = parseInt(ms) || 0
  if (n < 1000) return `${n} ms`
  return `${(n / 1000).toFixed(2).replace(/\.?0+$/, '')} s`
}

function AddSkillRow({ existingKeys, skillKeys, onAdd }) {
  const [selected, setSelected] = useState('')

  const available = skillKeys
    .filter(k => !existingKeys.has(k))
    .map(k => ({ key: k, ...(SKILL_BY_KEY[k] || { name: k, group: '' }) }))
    .sort((a, b) => {
      const gc = a.group.localeCompare(b.group)
      return gc !== 0 ? gc : a.name.localeCompare(b.name)
    })

  if (available.length === 0) return null

  return (
    <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className="field-input flex-1"
      >
        <option value="">— Add skill timing…</option>
        {available.map(s => (
          <option key={s.key} value={s.key}>
            {s.name !== s.key ? `${s.name} (${s.key})` : s.key}{s.group ? ` — ${s.group}` : ''}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (!selected) return
          onAdd(selected, '1000')
          setSelected('')
        }}
        disabled={!selected}
        className={`flex-shrink-0 px-4 py-1.5 rounded border font-display font-semibold text-sm transition-colors
          ${selected
            ? 'bg-accent/10 border-accent text-accent hover:bg-accent/20'
            : 'bg-panel border-border text-subtle cursor-not-allowed'}`}
      >
        Add
      </button>
    </div>
  )
}

export default function AoeTime({ pairs, set, add, remove, skillKeys = [] }) {
  const existingKeys = new Set(pairs.map(p => p.key))

  return (
    <div className="section-card">
      <h2 className="section-title">AOE Timings</h2>
      <p className="section-subtitle">
        How long each AOE overlay is displayed on screen, in milliseconds.
        This is purely visual — it does not affect actual skill duration.
      </p>

      <div className="space-y-1">
        {pairs.map(({ key, value }) => {
          const meta = SKILL_BY_KEY[key]
          const ms = parseInt(value) || 0

          return (
            <div key={key} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
              <div className="w-48 flex-shrink-0">
                <div className="text-text font-display font-semibold text-sm">
                  {meta ? meta.name : key}
                </div>
                {meta && (
                  <span className={`text-xs font-display font-semibold ${GROUP_COLORS[meta.group] || 'text-muted'}`}>
                    {meta.group}
                  </span>
                )}
              </div>

              <div className="flex-1 relative h-1.5 bg-panel rounded-full overflow-hidden border border-border">
                <div
                  className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all"
                  style={{ width: `${Math.min((ms / 6000) * 100, 100)}%` }}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={value}
                  onChange={e => set(key, e.target.value)}
                  className="field-input w-24 text-right"
                />
                <span className="text-muted text-xs font-mono w-6">ms</span>
                <span className="text-accent font-mono text-xs w-12 text-right">{msToDisplay(value)}</span>
                <button
                  onClick={() => remove(key)}
                  className="w-6 h-6 flex items-center justify-center
                             text-subtle hover:text-red transition-colors text-xl leading-none"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}

        {pairs.length === 0 && (
          <div className="text-muted text-sm font-mono py-3">
            No timings defined. Add one below.
          </div>
        )}
      </div>

      <AddSkillRow existingKeys={existingKeys} skillKeys={skillKeys} onAdd={add} />
    </div>
  )
}
