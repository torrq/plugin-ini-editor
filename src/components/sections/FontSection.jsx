import { useState, useEffect, useRef } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import ArgbPicker from '../ArgbPicker'
import Toggle from '../Toggle'

const WEIGHT_OPTIONS = [
  { value: '100', label: '100 — Thin' },
  { value: '200', label: '200 — Extra Light' },
  { value: '300', label: '300 — Light' },
  { value: '400', label: '400 — Regular' },
  { value: '500', label: '500 — Medium' },
  { value: '600', label: '600 — Semi Bold' },
  { value: '700', label: '700 — Bold' },
  { value: '800', label: '800 — Extra Bold' },
  { value: '900', label: '900 — Black' },
]

// ── Font picker combobox ──────────────────────────────────────────────────────

function FontPicker({ value, onChange }) {
  const [fonts, setFonts] = useState([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    if (fonts.length > 0) return
    setLoading(true)
    invoke('get_system_fonts')
      .then(f => setFonts(f))
      .finally(() => setLoading(false))
  }, [open])

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    window.addEventListener('mousedown', onClickOutside)
    return () => window.removeEventListener('mousedown', onClickOutside)
  }, [open])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const filtered = search
    ? fonts.filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : fonts

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); setSearch('') }}
        className="field-input text-left flex items-center justify-between gap-2"
      >
        <span style={{ fontFamily: value }} className="truncate">{value || 'Select font…'}</span>
        <span className="text-muted text-xs flex-shrink-0">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-panel border border-border-bright
                        rounded-lg shadow-2xl flex flex-col overflow-hidden"
             style={{ maxHeight: 320 }}>
          {/* Search */}
          <div className="p-2 border-b border-border flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fonts…"
              className="w-full bg-base border border-border rounded px-2 py-1.5 text-sm
                         text-text placeholder-muted font-mono focus:outline-none focus:border-accent"
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {loading && (
              <div className="text-muted text-sm font-mono px-3 py-4 text-center">
                Loading fonts…
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-muted text-sm font-mono px-3 py-4 text-center">
                No fonts match
              </div>
            )}
            {!loading && filtered.map(font => (
              <button
                key={font}
                onClick={() => { onChange(font); setOpen(false); setSearch('') }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent/10 transition-colors
                  ${font === value ? 'text-accent bg-accent/5' : 'text-text'}`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Anchor picker — visual screen mock ───────────────────────────────────────

const ANCHORS = [
  { value: 'TopLeft',     label: '↖', row: 0, col: 0 },
  { value: 'TopRight',    label: '↗', row: 0, col: 2 },
  { value: 'BottomLeft',  label: '↙', row: 2, col: 0 },
  { value: 'BottomRight', label: '↘', row: 2, col: 2 },
]

function AnchorPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-4">
      {/* Screen mock */}
      <div className="relative bg-base border-2 border-border-bright rounded"
           style={{ width: 120, height: 80 }}>
        {/* Screen bezel detail */}
        <div className="absolute inset-1 border border-border rounded opacity-30" />

        {ANCHORS.map(({ value: v, label, row, col }) => {
          const isActive = value === v
          const top    = row === 0 ? 4  : row === 2 ? undefined : '50%'
          const bottom = row === 2 ? 4  : undefined
          const left   = col === 0 ? 4  : col === 2 ? undefined : '50%'
          const right  = col === 2 ? 4  : undefined

          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              style={{ position: 'absolute', top, bottom, left, right }}
              title={v}
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                          transition-all border
                          ${isActive
                            ? 'bg-accent border-accent text-base shadow-lg shadow-accent/30'
                            : 'bg-panel border-border text-muted hover:border-accent hover:text-accent'
                          }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Current value label */}
      <div>
        <div className="text-text font-display font-semibold text-sm">{value}</div>
        <div className="text-muted text-xs font-mono mt-0.5">
          X/Y offset from this corner
        </div>
      </div>
    </div>
  )
}

// ── Field row layout ──────────────────────────────────────────────────────────

function FieldRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0 w-36">
        <div className="field-label">{label}</div>
        {hint && <div className="text-muted text-xs font-mono mt-0.5 leading-relaxed">{hint}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function FontSection({ getUi, setUi, getSrf, setSrf }) {
  const isItalic = getSrf('Italic') === 'true'

  return (
    <div>
      {/* UI Font */}
      <div className="section-card">
        <h2 className="section-title">UI Font</h2>
        <p className="section-subtitle">
          Font used for in-game UI elements.
        </p>
        <FieldRow label="Font Family">
          <FontPicker value={getUi('Font')} onChange={v => setUi('Font', v)} />
        </FieldRow>
      </div>

      {/* Screen Render Font */}
      <div className="section-card">
        <h2 className="section-title">Screen Render Font</h2>
        <p className="section-subtitle">
          Font and position for on-screen overlay text — FPS, ping, timestamp, etc.
        </p>

        <FieldRow label="Font Family">
          <FontPicker value={getSrf('Font')} onChange={v => setSrf('Font', v)} />
        </FieldRow>

        <FieldRow label="Size" hint="Points">
          <input
            type="number" min={6} max={72}
            value={getSrf('Size')}
            onChange={e => setSrf('Size', e.target.value)}
            className="field-input w-24"
          />
        </FieldRow>

        <FieldRow label="Weight">
          <select
            value={getSrf('Weight')}
            onChange={e => setSrf('Weight', e.target.value)}
            className="field-input"
          >
            {WEIGHT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </FieldRow>

        <FieldRow label="Italic">
          <Toggle
            checked={isItalic}
            onChange={v => setSrf('Italic', v ? 'true' : 'false')}
          />
        </FieldRow>

        <FieldRow label="Color" hint="Applies to all overlay text">
          <ArgbPicker value={getSrf('Color')} onChange={v => setSrf('Color', v)} hideHex />
        </FieldRow>

        <FieldRow label="Position" hint="Corner the X/Y offset is measured from">
          <AnchorPicker
            value={getSrf('Anchor') || 'TopLeft'}
            onChange={v => setSrf('Anchor', v)}
          />
        </FieldRow>

        <FieldRow label="X Offset" hint="Pixels from anchor (horizontal)">
          <input
            type="number"
            value={getSrf('X')}
            onChange={e => setSrf('X', e.target.value)}
            className="field-input w-28"
          />
        </FieldRow>

        <FieldRow label="Y Offset" hint="Pixels from anchor (vertical)">
          <input
            type="number"
            value={getSrf('Y')}
            onChange={e => setSrf('Y', e.target.value)}
            className="field-input w-28"
          />
        </FieldRow>
      </div>
    </div>
  )
}
