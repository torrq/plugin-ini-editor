import Toggle from '../Toggle'

const TOGGLES = [
  { key: 'lgp',     label: 'Land Grid Preview',    desc: 'LGP cell overlay' },
  { key: 'circle',  label: 'Circle Indicator',     desc: 'Circular range overlay' },
  { key: 'square',  label: 'Square Indicator',     desc: 'Square range overlay' },
  { key: 'aoes',    label: 'AOE Overlay',          desc: 'Skill area display' },
  { key: 'dc',      label: 'Dead Cells',           desc: 'Non-walkable cell overlay' },
  { key: 'timestamp', label: 'Timestamp',          desc: 'On-screen timestamp' },
  { key: 'fps',     label: 'FPS Counter',          desc: 'Frames per second display' },
  { key: 'ping',    label: 'Ping Display',         desc: 'Latency in ms' },
  { key: 'refresh', label: 'Refresh Rate',         desc: 'Monitor refresh rate' },
  { key: 'turbo',   label: 'Turbo Mode',           desc: 'Enable turbo skill placement' },
  { key: 'partysp', label: 'Party SP',             desc: 'Party SP display' },
]

const NUMBERS = [
  { key: 'circle_range', label: 'Circle Range',    desc: 'Radius in cells',    min: 1, max: 99 },
  { key: 'square_range', label: 'Square Range',    desc: 'Radius in cells',    min: 1, max: 99 },
  { key: 'walkdelay',    label: 'Walk Delay',      desc: 'Delay in ms',        min: 0, max: 9999 },
]

export default function CommandStatus({ get, set }) {
  const isOn = (key) => get(key) === '1'
  const toggle = (key) => set(key, isOn(key) ? '0' : '1')

  return (
    <div>
      <div className="section-card">
        <h2 className="section-title">Command Status</h2>
        <p className="section-subtitle">Toggle in-game overlays. These settings can also be changed at runtime via in-game slash commands.</p>

        {/* Toggle grid */}
        <div className="grid grid-cols-1 gap-2">
          {TOGGLES.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <div className="text-text font-display font-semibold text-sm">{label}</div>
                <div className="text-muted text-xs font-mono">{desc}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${isOn(key) ? 'text-green border-green' : ''}`}>
                  {isOn(key) ? 'ON' : 'OFF'}
                </span>
                <Toggle checked={isOn(key)} onChange={() => toggle(key)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">Numeric Settings</h2>
        <div className="grid grid-cols-1 gap-4">
          {NUMBERS.map(({ key, label, desc, min, max }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-text font-display font-semibold text-sm">{label}</div>
                <div className="text-muted text-xs font-mono">{desc} · range {min}–{max}</div>
              </div>
              <input
                type="number"
                min={min}
                max={max}
                value={get(key)}
                onChange={e => set(key, e.target.value)}
                className="field-input w-28 text-right"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
