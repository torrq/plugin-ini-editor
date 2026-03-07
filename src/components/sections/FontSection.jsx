import ArgbPicker from '../ArgbPicker'
import Toggle from '../Toggle'

const ANCHOR_OPTIONS = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight']
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

function FieldRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0 w-40">
        <div className="field-label">{label}</div>
        {hint && <div className="text-muted text-xs font-mono mt-0.5">{hint}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default function FontSection({ getUi, setUi, getSrf, setSrf }) {
  const isItalic = getSrf('Italic') === 'true'

  return (
    <div>
      {/* UI Font */}
      <div className="section-card">
        <h2 className="section-title">UI Font</h2>
        <p className="section-subtitle">
          Font used for game UI elements. Must match a Windows font family name exactly.
          Find names in <span className="font-mono text-accent">C:\Windows\Fonts</span> — open
          a font file and read the family name at the top.
        </p>
        <FieldRow label="Font Family" hint="e.g. Arial, Segoe UI">
          <input
            type="text"
            value={getUi('Font')}
            onChange={e => setUi('Font', e.target.value)}
            className="field-input"
            placeholder="Arial"
          />
        </FieldRow>
      </div>

      {/* Screen Render Font */}
      <div className="section-card">
        <h2 className="section-title">Screen Render Font</h2>
        <p className="section-subtitle">
          Font and position for on-screen overlay text (FPS counter, ping, timestamp, etc.).
        </p>

        <FieldRow label="Font Family" hint="Tahoma · Verdana · Arial · Lucida Console · Consolas · Segoe UI">
          <input
            type="text"
            value={getSrf('Font')}
            onChange={e => setSrf('Font', e.target.value)}
            className="field-input"
            placeholder="Segoe UI"
          />
        </FieldRow>

        <FieldRow label="Size" hint="Font size in points">
          <input
            type="number"
            min={6}
            max={72}
            value={getSrf('Size')}
            onChange={e => setSrf('Size', e.target.value)}
            className="field-input w-28"
          />
        </FieldRow>

        <FieldRow label="Weight" hint="Thickness of the font">
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

        <FieldRow label="Color" hint="ARGB hex — applies to all screen overlay text">
          <ArgbPicker
            value={getSrf('Color')}
            onChange={v => setSrf('Color', v)}
          />
        </FieldRow>

        <FieldRow label="Anchor" hint="Corner to measure X/Y offset from">
          <div className="flex gap-2 flex-wrap">
            {ANCHOR_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setSrf('Anchor', opt)}
                className={`
                  px-3 py-1.5 rounded text-sm font-display font-semibold border transition-colors
                  ${getSrf('Anchor') === opt
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-panel border-border text-muted hover:text-text hover:border-border-bright'
                  }
                `}
              >
                {opt}
              </button>
            ))}
          </div>
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
