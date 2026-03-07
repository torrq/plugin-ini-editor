import { useState } from 'react'
import ArgbPicker from '../ArgbPicker'
import { SKILL_BY_KEY, GROUP_COLORS } from '../../skills'

export default function AoeColor({ get, set, pairs }) {
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('All')

  // Derive skill list and group filter from the live AOE Color pairs
  const skillRows = pairs
    .filter(p => /^Skill[0-9A-Fa-f]{4}$/i.test(p.key))
    .map(p => ({
      key: p.key,
      ...(SKILL_BY_KEY[p.key] || { name: p.key, group: 'Unknown' }),
    }))
    .sort((a, b) => {
      const gc = a.group.localeCompare(b.group)
      return gc !== 0 ? gc : a.name.localeCompare(b.name)
    })

  const allGroups = ['All', ...[...new Set(skillRows.map(s => s.group))].sort()]

  const filtered = skillRows.filter(s => {
    const matchGroup = group === 'All' || s.group === group
    const q = search.toLowerCase()
    return matchGroup && (!q || s.name.toLowerCase().includes(q) || s.key.toLowerCase().includes(q))
  })

  return (
    <div>
      <div className="section-card">
        <h2 className="section-title">AOE Colors</h2>
        <p className="section-subtitle">
          Per-skill AOE overlay colors. Click the swatch to pick a color, adjust the alpha slider for transparency.
        </p>

        <div className="flex gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search skill name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="field-input flex-1 min-w-48"
          />
          <select
            value={group}
            onChange={e => setGroup(e.target.value)}
            className="field-input w-44"
          >
            {allGroups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {(search || group !== 'All') && (
            <button
              onClick={() => { setSearch(''); setGroup('All') }}
              className="px-3 py-1.5 bg-panel border border-border rounded text-muted text-sm
                         font-display hover:text-text hover:border-border-bright transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-muted text-xs font-mono mb-3">
          {filtered.length} / {skillRows.length} skills
        </div>

        <div className="space-y-0">
          {filtered.map(({ key, name, group: g }) => (
            <div key={key} className="flex items-center gap-6 py-2.5 border-b border-border last:border-0">
              <div className="w-56 flex-shrink-0">
                <div className="text-text font-display font-semibold text-sm">{name}</div>
                <span className={`text-xs font-display font-semibold ${GROUP_COLORS[g] || 'text-muted'}`}>
                  {g}
                </span>
              </div>
              <div className="flex-1">
                <ArgbPicker value={get(key)} onChange={v => set(key, v)} hideHex />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-muted py-8 font-mono text-sm">
              No skills match your filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
