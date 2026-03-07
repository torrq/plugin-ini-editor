import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import Sidebar from './components/Sidebar'
import CommandStatus from './components/sections/CommandStatus'
import ClientSection from './components/sections/ClientSection'
import FontSection from './components/sections/FontSection'
import TurboHotkeys from './components/sections/TurboHotkeys'
import GlobalConfigs from './components/sections/GlobalConfigs'
import CellColors from './components/sections/CellColors'
import ImagesSection from './components/sections/ImagesSection'
import AoeTime from './components/sections/AoeTime'
import AoeColor from './components/sections/AoeColor'

export default function App() {
  const [filePath, setFilePath] = useState(null)
  const [config, setConfig] = useState(null)
  const [activeSection, setActiveSection] = useState('Command Status')
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState(null)

  // ── Config accessors ──────────────────────────────────────────────────────

  const getValue = (section, key) => {
    const sec = config?.sections.find(s => s.name === section)
    return sec?.pairs.find(p => p.key === key)?.value ?? ''
  }

  const setValue = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.name === section
          ? { ...s, pairs: s.pairs.map(p => p.key === key ? { ...p, value } : p) }
          : s
      ),
    }))
    setDirty(true)
  }

  // Curry get/set for a specific section
  const g = (section) => (key) => getValue(section, key)
  const s = (section) => (key, value) => setValue(section, key, value)

  // ── File operations ───────────────────────────────────────────────────────

  const flash = (msg, color = 'text-accent') => {
    setStatus({ msg, color })
    setTimeout(() => setStatus(null), 2500)
  }

  const handleOpen = async () => {
    try {
      const result = await invoke('open_config')
      if (result) {
        const [path, cfg] = result
        setFilePath(path)
        setConfig(cfg)
        setDirty(false)
        flash('File loaded successfully')
      }
    } catch (e) {
      flash(`Error: ${e}`, 'text-red')
    }
  }

  const handleSave = async () => {
    if (!filePath) return handleSaveAs()
    try {
      await invoke('save_config', { path: filePath, config })
      setDirty(false)
      flash('Saved')
    } catch (e) {
      flash(`Save failed: ${e}`, 'text-red')
    }
  }

  const handleSaveAs = async () => {
    try {
      const newPath = await invoke('save_config_as', { config })
      if (newPath) {
        setFilePath(newPath)
        setDirty(false)
        flash('Saved as ' + newPath.split('\\').pop())
      }
    } catch (e) {
      flash(`Save failed: ${e}`, 'text-red')
    }
  }

  // ── Section renderer ──────────────────────────────────────────────────────

  const renderSection = () => {
    if (!config) return <EmptyState onOpen={handleOpen} />

    switch (activeSection) {
      case 'Command Status':
        return <CommandStatus get={g('Command Status')} set={s('Command Status')} />
      case 'Client':
        return <ClientSection get={g('Client')} set={s('Client')} />
      case 'Fonts':
        return (
          <FontSection
            getUi={g('UI Font')}  setUi={s('UI Font')}
            getSrf={g('Screen Render Font')} setSrf={s('Screen Render Font')}
          />
        )
      case 'Turbo Hotkeys':
        return <TurboHotkeys get={g('Turbo Hotkeys')} set={s('Turbo Hotkeys')} />
      case 'Global Configs':
        return <GlobalConfigs get={g('Global Configs')} set={s('Global Configs')} />
      case 'Cell Color':
        return <CellColors get={g('Cell Color')} set={s('Cell Color')} />
      case 'Images':
        return <ImagesSection get={g('Images')} set={s('Images')} />
      case 'AOE Time':
        return <AoeTime get={g('AOE Time')} set={s('AOE Time')} />
      case 'AOE Color':
        return <AoeColor get={g('AOE Color')} set={s('AOE Color')} />
      default:
        return null
    }
  }

  const fileName = filePath ? filePath.split('\\').pop() : null

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <Sidebar
        active={activeSection}
        onSelect={setActiveSection}
        hasFile={!!config}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface flex-shrink-0">
          <div className="flex-1 min-w-0">
            {filePath ? (
              <div className="flex items-center gap-2">
                <span className="text-muted text-xs font-mono truncate" title={filePath}>
                  {filePath}
                </span>
                {dirty && (
                  <span className="flex-shrink-0 text-amber text-xs font-mono">● unsaved</span>
                )}
              </div>
            ) : (
              <span className="text-subtle text-xs font-mono">No file open</span>
            )}
          </div>

          {status && (
            <span className={`text-xs font-mono ${status.color} transition-opacity`}>
              {status.msg}
            </span>
          )}

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleOpen}
              className="px-3 py-1.5 bg-panel border border-border rounded text-muted text-sm
                         font-display font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              Open
            </button>
            {config && (
              <>
                <button
                  onClick={handleSave}
                  disabled={!dirty}
                  className={`
                    px-3 py-1.5 rounded text-sm font-display font-semibold border transition-colors
                    ${dirty
                      ? 'bg-accent/10 border-accent text-accent hover:bg-accent/20'
                      : 'bg-panel border-border text-subtle cursor-not-allowed'
                    }
                  `}
                >
                  Save
                </button>
                <button
                  onClick={handleSaveAs}
                  className="px-3 py-1.5 bg-panel border border-border rounded text-muted text-sm
                             font-display font-semibold hover:border-border-bright hover:text-text transition-colors"
                >
                  Save As
                </button>
              </>
            )}
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}

function EmptyState({ onOpen }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {/* Grid decoration */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative text-center">
        <div className="text-accent font-display font-bold text-6xl tracking-widest mb-2">
          OSRO Revo
        </div>
        <div className="text-muted font-mono text-sm">plugin.ini configuration editor</div>
      </div>

      <button
        onClick={onOpen}
        className="relative px-8 py-3 bg-accent/10 border border-accent rounded
                   text-accent font-display font-bold text-lg tracking-widest uppercase
                   hover:bg-accent/20 transition-colors"
      >
        Open plugin.ini
      </button>

      <div className="text-subtle text-xs font-mono text-center max-w-xs">
        Open your plugin.ini to start editing. It's usually in your OsRO game folder.
      </div>
    </div>
  )
}
