import { invoke } from '@tauri-apps/api/tauri'

const GENERIC = [
  { key: 'square_image', label: 'Square Range Image', desc: 'Generic square range overlay' },
  { key: 'circle_image', label: 'Circle Range Image', desc: 'Generic circle range overlay' },
  { key: 'aoe_image',    label: 'AOE Image',          desc: 'Generic AOE area overlay' },
  { key: 'dc_image',     label: 'Dead Cell Image',    desc: 'Dead cell indicator' },
]

const SKILL_IMAGES = [
  { key: 'Skill0083', name: 'Sanctuary' },
  { key: 'Skill0085', name: 'Pneuma' },
  { key: 'Skill007E', name: 'Safety Wall' },
  { key: 'Skill0010', name: 'Storm Gust' },
  { key: 'Skill0011', name: 'Meteor Storm' },
  { key: 'Skill0012', name: 'Lord of Vermilion' },
  { key: 'Skill008E', name: 'Quagmire' },
  { key: 'Skill0087', name: 'Fire Pillar' },
  { key: 'Skill009A', name: 'Volcano' },
  { key: 'Skill009B', name: 'Deluge' },
  { key: 'Skill009C', name: 'Whirlwind' },
  { key: 'Skill009D', name: 'Land Protector' },
  { key: 'Skill00A8', name: 'Impressive Riff' },
  { key: 'Skill00A9', name: 'Magic Strings' },
  { key: 'Skill00AA', name: 'Song of Lutie' },
  { key: 'Skill00AD', name: 'Slow Grace' },
  { key: 'Skill00AF', name: "Gypsy's Kiss" },
  { key: 'Skill00A4', name: 'Power Cord' },
  { key: 'Skill00B6', name: 'Blinding Mist' },
  { key: 'Skill00B7', name: 'Fiber Lock' },
  { key: 'Skill00B8', name: 'Gravitational Field' },
]

function ImageRow({ label, desc, keyName, value, onChange }) {
  const handleBrowse = async () => {
    try {
      const filename = await invoke('pick_image_file')
      if (filename) onChange(filename)
    } catch (e) {
      console.error('File pick failed:', e)
    }
  }

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="w-44 flex-shrink-0">
        <div className="text-text font-display font-semibold text-sm">{label}</div>
        {desc && <div className="text-muted text-xs font-mono">{desc}</div>}
        <div className="badge mt-0.5">{keyName}</div>
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
    </div>
  )
}

export default function ImagesSection({ get, set }) {
  return (
    <div>
      <div className="section-card">
        <h2 className="section-title">Generic Overlay Images</h2>
        <p className="section-subtitle">
          Images for range indicators and dead cells. Files are loaded from the{' '}
          <span className="font-mono text-accent">data</span> folder first, but can be located anywhere on disk.
          Only the filename is stored.
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
          Custom BMP overlays for specific skills. Format:{' '}
          <span className="font-mono text-accent">Skill#### = filename.bmp</span> where{' '}
          #### is the hex skill ID.
        </p>
        {SKILL_IMAGES.map(({ key, name }) => (
          <ImageRow
            key={key}
            keyName={key}
            label={name}
            value={get(key)}
            onChange={v => set(key, v)}
          />
        ))}
      </div>
    </div>
  )
}
