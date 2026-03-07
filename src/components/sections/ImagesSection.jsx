import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { SKILL_BY_KEY, GROUP_COLORS } from '../../skills'

const GENERIC = [
  { key: 'square_image', label: 'Square Range' },
  { key: 'circle_image', label: 'Circle Range' },
  { key: 'aoe_image',    label: 'AOE Area' },
  { key: 'dc_image',     label: 'Dead Cell' },
]

function ImageRow({ label, desc, keyName, value, onChange, onRemove }) {
  const handleBrowse = async () => {
    try {
      const filename = await invoke('pick_image_file')
      if (filename) onChange(filename)
    } catch (e) {}
  }

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="w-44 flex-shrink-0">
        <div className="text-text font-display font-semibold text-sm">{label}</div>
        {desc && <div className="mt-0.5">{desc}</div>}
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="field-input flex-1"
        placeholder="filename.bmp"
      />
      <button
        onClick={handleBrowse}
        className="flex-shrink-0 px-3 py-1.5 bg-panel border border-border rounded text-muted text-sm
                   font-display font-semibold hover:border-accent hover:text-accent transition-colors"
      >
        Browse
      </button>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center
                     text-subtle hover:text-red transition-colors text-xl leading-none"
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  )
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
        <option value="">— Add skill image…</option>
        {available.map(s => (
          <option key={s.key} value={s.key}>
            {s.name !== s.key ? `${s.name} (${s.key})` : s.key}{s.group ? ` — ${s.group}` : ''}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (!selected) return
          onAdd(selected, '')
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

export default function ImagesSection({ get, set, pairs, add, remove, skillKeys = [] }) {
  const skillPairs = pairs.filter(p => /^Skill[0-9A-Fa-f]{4}$/i.test(p.key))
  const existingSkillKeys = new Set(skillPairs.map(p => p.key))
  const getSkillMeta = (key) => SKILL_BY_KEY[key]

  return (
    <div>
      <div className="section-card">
        <h2 className="section-title">Generic Overlay Images</h2>
        <p className="section-subtitle">
          Images for range indicators and dead cells. Files are loaded from the{' '}
          <span className="font-mono text-accent">data</span> folder first, but can be located anywhere on disk.
        </p>
        {GENERIC.map(({ key, label, desc }) => (
          <ImageRow
            key={key}
            keyName={key}
            label={label}
            desc={desc}
            value={get(key)}
            onChange={v => set(key, v)}
          />
        ))}
      </div>

      <div className="section-card">
        <h2 className="section-title">Skill Images</h2>
        <p className="section-subtitle">
          Custom BMP overlays for specific skills.
          Use <span className="font-mono text-accent">Browse</span> to select a file,
          or type a filename directly. Only the filename is stored.
        </p>

        {skillPairs.length === 0 && (
          <div className="text-muted text-sm font-mono py-3">
            No skill images defined. Add one below.
          </div>
        )}

        {skillPairs.map(({ key, value }) => {
          const meta = getSkillMeta(key)
          return (
            <ImageRow
              key={key}
              keyName={key}
              label={meta ? meta.name : key}
              desc={meta ? (
                <span className={`text-xs font-display font-semibold ${GROUP_COLORS[meta.group] || 'text-muted'}`}>
                  {meta.group}
                </span>
              ) : null}
              value={value}
              onChange={v => set(key, v)}
              onRemove={() => remove(key)}
            />
          )
        })}

        <AddSkillRow existingKeys={existingSkillKeys} skillKeys={skillKeys} onAdd={add} />
      </div>
    </div>
  )
}
