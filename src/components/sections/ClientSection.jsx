import Toggle from '../Toggle'

const SETTINGS = [
  {
    key: 'WindowLock',
    label: 'Window Lock',
    desc: 'Removes borders and locks the client window to fullscreen (excluding taskbar). Overrides the resolution set in setup.exe.',
    warning: null,
  },
  {
    key: 'ServerSelectPing',
    label: 'Server Select Ping',
    desc: 'Displays ping on the server selection screen.',
    warning: 'Disable if you experience "Failed to connect to server" errors.',
  },
  {
    key: 'LoginVideo',
    label: 'Login Video',
    desc: 'Plays the intro video on login.',
    warning: 'Disable alongside Server Select Ping if you have login/connection issues.',
  },
]

export default function ClientSection({ get, set }) {
  const isOn = (key) => get(key) === '1'
  const toggle = (key) => set(key, isOn(key) ? '0' : '1')

  return (
    <div className="section-card">
      <h2 className="section-title">Client</h2>
      <p className="section-subtitle">Window behavior and connection settings.</p>

      <div className="grid grid-cols-1 gap-3">
        {SETTINGS.map(({ key, label, desc, warning }) => (
          <div
            key={key}
            className={`
              flex items-start justify-between gap-4 p-3 rounded-lg border
              ${warning ? 'border-amber/30 bg-amber/5' : 'border-border bg-panel'}
            `}
          >
            <div className="flex-1">
              <div className="text-text font-display font-semibold">{label}</div>
              <div className="text-muted text-sm mt-1">{desc}</div>
              {warning && (
                <div className="text-amber text-xs font-mono mt-2 flex items-start gap-1.5">
                  <span className="mt-0.5">⚠</span>
                  <span>{warning}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mt-1">
              <span className={`badge ${isOn(key) ? 'text-green border-green' : ''}`}>
                {isOn(key) ? 'ON' : 'OFF'}
              </span>
              <Toggle checked={isOn(key)} onChange={() => toggle(key)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
