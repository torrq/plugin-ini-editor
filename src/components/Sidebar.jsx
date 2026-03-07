const SECTIONS = [
  { id: 'Command Status', label: 'Command Status', icon: '⚙' },
  { id: 'Client',         label: 'Client',         icon: '🖥' },
  { id: 'Fonts',          label: 'Fonts',          icon: 'T' },
  { id: 'Turbo Hotkeys',  label: 'Turbo Hotkeys',  icon: '⌨' },
  { id: 'Global Configs', label: 'Global Configs', icon: '◈' },
  { id: 'Cell Color',     label: 'Cell Colors',    icon: '▣' },
  { id: 'Images',         label: 'Images',         icon: '🖼' },
  { id: 'AOE Time',       label: 'AOE Timings',    icon: '⏱' },
  { id: 'AOE Color',      label: 'AOE Colors',     icon: '🎨' },
]

export default function Sidebar({ active, onSelect, hasFile }) {
  return (
    <aside className="w-52 flex-shrink-0 flex flex-col border-r border-border bg-surface">
      {/* Logo / title */}
      <div className="px-4 pt-5 pb-4 border-b border-border">
        <div className="text-accent font-display font-bold text-lg tracking-widest uppercase">
          OSRO Revo
        </div>
        <div className="text-muted text-xs font-mono mt-0.5">plugin.ini editor</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTIONS.map(({ id, label, icon }) => {
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
              <span className="text-base w-5 text-center flex-shrink-0 font-mono">
                {icon}
              </span>
              {label}
            </button>
          )
        })}
      </nav>

      {/* Version tag */}
      <div className="px-4 py-3 border-t border-border">
        <span className="text-subtle text-xs font-mono">v0.1.0</span>
      </div>
    </aside>
  )
}

export { SECTIONS }
