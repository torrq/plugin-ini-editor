import logo from '../assets/logo.png'
import { Settings, Monitor, Type, Keyboard, SlidersHorizontal, Grid3x3, Image, Timer, Palette } from 'lucide-react'

const SECTIONS = [
  { id: 'Command Status', label: 'Command Status', Icon: Settings },
  { id: 'Client',         label: 'Client',         Icon: Monitor },
  { id: 'Fonts',          label: 'Fonts',          Icon: Type },
  { id: 'Turbo Hotkeys',  label: 'Turbo Hotkeys',  Icon: Keyboard },
  { id: 'Global Configs', label: 'Global Configs', Icon: SlidersHorizontal },
  { id: 'Cell Color',     label: 'Cell Colors',    Icon: Grid3x3 },
  { id: 'Images',         label: 'Images',         Icon: Image },
  { id: 'AOE Time',       label: 'AOE Timings',    Icon: Timer },
  { id: 'AOE Color',      label: 'AOE Colors',     Icon: Palette },
]

export default function Sidebar({ active, onSelect, hasFile }) {
  return (
    <aside className="w-52 flex-shrink-0 flex flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <img src={logo} alt="OSRO Plugin" className="w-full" draggable={false} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTIONS.map(({ id, label, Icon }) => {
          const isActive = active === id
          const disabled = !hasFile
          return (
            <button
              key={id}
              onClick={() => !disabled && onSelect(id)}
              disabled={disabled}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-left
                font-display font-semibold text-sm tracking-wide
                transition-all duration-100
                ${isActive
                  ? 'text-accent bg-panel border-r-2 border-accent'
                  : disabled
                    ? 'text-subtle cursor-not-allowed'
                    : 'text-muted hover:text-text hover:bg-panel cursor-pointer'
                }
              `}
            >
              <Icon size={15} className={`flex-shrink-0 ${isActive ? 'text-accent' : disabled ? 'text-subtle' : 'text-text'}`} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Version tag */}
      <div className="px-4 py-3 border-t border-border">
        <span className="text-subtle text-xs font-mono">v0.1.1</span>
      </div>
    </aside>
  )
}

export { SECTIONS }
