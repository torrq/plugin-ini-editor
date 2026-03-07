import { useState } from 'react'
import ArgbPicker from '../ArgbPicker'

const SKILLS = [
  { key: 'Skill0010', name: 'Storm Gust',           group: 'Wizard' },
  { key: 'Skill0011', name: 'Meteor Storm',          group: 'Wizard' },
  { key: 'Skill0012', name: 'Lord of Vermilion',     group: 'Wizard' },
  { key: 'Skill0013', name: "Heaven's Drive",        group: 'Wizard' },
  { key: 'Skill0014', name: 'Thunderstorm',          group: 'Mage' },
  { key: 'Skill0015', name: 'Grand Cross / Darkness',group: 'Crusader' },
  { key: 'Skill007E', name: 'Safety Wall',           group: 'Mage' },
  { key: 'Skill007F', name: 'Fire Wall',             group: 'Mage' },
  { key: 'Skill0080', name: 'Warp Portal (Zone A)',  group: 'Acolyte' },
  { key: 'Skill0081', name: 'Warp Portal (Zone B)',  group: 'Acolyte' },
  { key: 'Skill0082', name: 'Warp Portal (Zone C)',  group: 'Acolyte' },
  { key: 'Skill0083', name: 'Sanctuary',             group: 'Priest' },
  { key: 'Skill0084', name: 'Magnus Exorcismus',     group: 'Priest' },
  { key: 'Skill0085', name: 'Pneuma',                group: 'Acolyte' },
  { key: 'Skill0087', name: 'Fire Pillar',           group: 'Wizard' },
  { key: 'Skill0088', name: 'Fire Pillar (alt)',     group: 'Wizard' },
  { key: 'Skill0089', name: 'Sheltering Bliss',      group: 'Clown/Gypsy' },
  { key: 'Skill008A', name: 'Sheltering Bliss',      group: 'Clown/Gypsy' },
  { key: 'Skill008B', name: 'Sheltering Bliss',      group: 'Clown/Gypsy' },
  { key: 'Skill008C', name: 'Sheltering Bliss',      group: 'Clown/Gypsy' },
  { key: 'Skill008D', name: 'Ice Wall',              group: 'Wizard' },
  { key: 'Skill008E', name: 'Quagmire',              group: 'Wizard' },
  { key: 'Skill008F', name: 'Blast Mine',            group: 'Hunter' },
  { key: 'Skill0090', name: 'Skid Trap',             group: 'Hunter' },
  { key: 'Skill0091', name: 'Ankle Snare',           group: 'Hunter' },
  { key: 'Skill0092', name: 'Venom Dust',            group: 'Assassin' },
  { key: 'Skill0093', name: 'Land Mine',             group: 'Hunter' },
  { key: 'Skill0094', name: 'Shockwave Trap',        group: 'Hunter' },
  { key: 'Skill0095', name: 'Sandman',               group: 'Hunter' },
  { key: 'Skill0096', name: 'Flasher',               group: 'Hunter' },
  { key: 'Skill0097', name: 'Freezing Trap',         group: 'Hunter' },
  { key: 'Skill0098', name: 'Claymore Trap',         group: 'Hunter' },
  { key: 'Skill0099', name: 'Talkie Box',            group: 'Hunter' },
  { key: 'Skill009A', name: 'Volcano',               group: 'Sage' },
  { key: 'Skill009B', name: 'Deluge',                group: 'Sage' },
  { key: 'Skill009C', name: 'Whirlwind',             group: 'Sage' },
  { key: 'Skill009D', name: 'Land Protector',        group: 'Sage' },
  { key: 'Skill009E', name: 'Lullaby',               group: 'Bard' },
  { key: 'Skill009F', name: 'Mental Sensing',        group: 'Bard' },
  { key: 'Skill00A0', name: 'Down Tempo',            group: 'Bard' },
  { key: 'Skill00A1', name: 'Battle Theme',          group: 'Bard' },
  { key: 'Skill00A2', name: 'Harmonic Lick',         group: 'Bard' },
  { key: 'Skill00A3', name: 'Classical Pluck',       group: 'Bard' },
  { key: 'Skill00A4', name: 'Power Cord',            group: 'Bard' },
  { key: 'Skill00A5', name: 'Acoustic Rhythm',       group: 'Bard' },
  { key: 'Skill00A6', name: 'Unchained Serenade',    group: 'Bard' },
  { key: 'Skill00A7', name: 'Perfect Tablature',     group: 'Bard' },
  { key: 'Skill00A8', name: 'Impressive Riff',       group: 'Bard' },
  { key: 'Skill00A9', name: 'Magic Strings',         group: 'Bard' },
  { key: 'Skill00AA', name: 'Song of Lutie',         group: 'Bard' },
  { key: 'Skill00AB', name: 'Hip Shaker',            group: 'Dancer' },
  { key: 'Skill00AC', name: 'Focus Ballet',          group: 'Dancer' },
  { key: 'Skill00AD', name: 'Slow Grace',            group: 'Dancer' },
  { key: 'Skill00AE', name: 'Lady Luck',             group: 'Dancer' },
  { key: 'Skill00AF', name: "Gypsy's Kiss",          group: 'Dancer' },
  { key: 'Skill00B0', name: 'Scribble',              group: 'Rogue' },
  { key: 'Skill00B1', name: 'Bomb',                  group: 'Alchemist' },
  { key: 'Skill00B2', name: 'Romantic Rendezvous',   group: 'Other' },
  { key: 'Skill00B3', name: 'Battle Chant',          group: 'Paladin' },
  { key: 'Skill00B4', name: 'Basilica',              group: 'High Priest' },
  { key: 'Skill00B5', name: 'Solar Heat',            group: 'Star Gladiator' },
  { key: 'Skill00B6', name: 'Blinding Mist',         group: 'Professor' },
  { key: 'Skill00B7', name: 'Fiber Lock',            group: 'Professor' },
  { key: 'Skill00B8', name: 'Gravitational Field',   group: 'High Wizard' },
  { key: 'Skill00B9', name: "Hermode's Rod",         group: 'Clown/Gypsy' },
  { key: 'Skill00BA', name: 'Desperado',             group: 'Gunslinger' },
  { key: 'Skill00BB', name: 'Watery Evasion',        group: 'Ninja' },
  { key: 'Skill00BC', name: 'Flip Tatami',           group: 'Ninja' },
  { key: 'Skill00BD', name: 'Blaze Shield',          group: 'Ninja' },
  { key: 'Skill00BE', name: 'Gunslinger Mine',       group: 'Gunslinger' },
]

const ALL_GROUPS = ['All', ...new Set(SKILLS.map(s => s.group))]

const GROUP_COLORS = {
  Wizard:         'text-blue-400',
  Mage:           'text-blue-300',
  Priest:         'text-yellow-300',
  Acolyte:        'text-yellow-400',
  Crusader:       'text-orange-300',
  Hunter:         'text-green-400',
  Assassin:       'text-red-400',
  Sage:           'text-purple-400',
  Bard:           'text-pink-400',
  Dancer:         'text-pink-300',
  'Clown/Gypsy':  'text-rose-400',
  Rogue:          'text-gray-400',
  Alchemist:      'text-lime-400',
  Paladin:        'text-amber-300',
  'High Priest':  'text-amber-400',
  'Star Gladiator':'text-orange-400',
  Professor:      'text-cyan-400',
  'High Wizard':  'text-indigo-400',
  Gunslinger:     'text-orange-300',
  Ninja:          'text-teal-400',
  Other:          'text-gray-500',
}

export default function AoeColor({ get, set }) {
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('All')

  const filtered = SKILLS.filter(s => {
    const matchGroup = group === 'All' || s.group === group
    const q = search.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.key.toLowerCase().includes(q)
    return matchGroup && matchSearch
  })

  return (
    <div>
      <div className="section-card">
        <h2 className="section-title">AOE Colors</h2>
        <p className="section-subtitle">
          Per-skill AOE overlay colors. Format:{' '}
          <span className="font-mono text-accent">0xAARRGGBB</span>.
          Click the swatch to pick a color, adjust the alpha slider for transparency.
        </p>

        {/* Filters */}
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
            {ALL_GROUPS.map(g => (
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
          {filtered.length} / {SKILLS.length} skills
        </div>

        {/* Skill list */}
        <div className="space-y-0">
          {filtered.map(({ key, name, group: g }) => (
            <div
              key={key}
              className="flex items-center gap-4 py-2.5 border-b border-border last:border-0"
            >
              <div className="w-44 flex-shrink-0">
                <div className="text-text font-display font-semibold text-sm">{name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="badge">{key}</span>
                  <span className={`text-xs font-display font-semibold ${GROUP_COLORS[g] || 'text-muted'}`}>
                    {g}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <ArgbPicker value={get(key)} onChange={v => set(key, v)} />
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
