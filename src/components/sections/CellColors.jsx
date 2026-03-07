import ArgbPicker from '../ArgbPicker'

const CELLS = [
  { key: 'square_color', label: 'Square Range', desc: 'Color for the square range indicator overlay' },
  { key: 'circle_color', label: 'Circle Range', desc: 'Color for the circular range indicator overlay' },
  { key: 'dc_color',     label: 'Dead Cells',   desc: 'Color for non-walkable cell highlights' },
]

export default function CellColors({ get, set }) {
  return (
    <div className="section-card">
      <h2 className="section-title">Cell Colors</h2>
      <p className="section-subtitle">
        Colors for range indicators and dead cell overlays.
        Click the swatch to pick a color, use the slider to adjust transparency.
      </p>

      <div className="space-y-1">
        {CELLS.map(({ key, label, desc }) => (
          <div key={key} className="py-4 border-b border-border last:border-0">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-48">
                <div className="text-text font-display font-semibold">{label}</div>
                <div className="text-muted text-xs font-mono mt-0.5">{desc}</div>
              </div>
              <div className="flex-1">
                <ArgbPicker value={get(key)} onChange={v => set(key, v)} hideHex />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
