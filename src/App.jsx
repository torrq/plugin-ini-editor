import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
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
  const [fatalError, setFatalError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmQuit, setConfirmQuit] = useState(false)

  // ── Auto-load on launch ───────────────────────────────────────────────────

  useEffect(() => {
    invoke('auto_load_config')
      .then(([path, cfg]) => {
        setFilePath(path)
        setConfig(cfg)
        setLoading(false)
      })
      .catch(err => {
        setFatalError(String(err))
        setLoading(false)
      })
  }, [])

  // ── Intercept window close for unsaved changes ────────────────────────────

  useEffect(() => {
    const unlisten = appWindow.onCloseRequested(async (event) => {
      if (dirty) {
        event.preventDefault()
        setConfirmQuit(true)
      }
    })
    return () => { unlisten.then(fn => fn()) }
  }, [dirty])

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

  const addValue = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.name === section
          ? { ...s, pairs: [...s.pairs, { key, value }] }
          : s
      ),
    }))
    setDirty(true)
  }

  const removeValue = (section, key) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.name === section
          ? { ...s, pairs: s.pairs.filter(p => p.key !== key) }
          : s
      ),
    }))
    setDirty(true)
  }

  const getSectionPairs = (section) =>
    config?.sections.find(s => s.name === section)?.pairs ?? []

  const g = (section) => (key) => getValue(section, key)
  const s = (section) => (key, value) => setValue(section, key, value)

  // ── File operations ───────────────────────────────────────────────────────

  const flash = (msg, color = 'text-accent') => {
    setStatus({ msg, color })
    setTimeout(() => setStatus(null), 2500)
  }

  const handleSave = async () => {
    try {
      await invoke('save_config', { path: filePath, config })
      setDirty(false)
      flash('Saved')
    } catch (e) {
      flash(`Save failed: ${e}`, 'text-red')
    }
  }

  const handleReset = async () => {
    try {
      const defaults = await invoke('get_defaults')
      setConfig(defaults)
      setDirty(true)
      flash('Reset to defaults — save to apply', 'text-amber')
    } catch (e) {
      flash(`Reset failed: ${e}`, 'text-red')
    }
  }

  const doQuit = async () => {
    setDirty(false)
    await appWindow.close()
  }

  // ── Section renderer ──────────────────────────────────────────────────────

  const renderSection = () => {
    if (!config) return null
    switch (activeSection) {
      case 'Command Status':
        return <CommandStatus get={g('Command Status')} set={s('Command Status')} />
      case 'Client':
        return <ClientSection get={g('Client')} set={s('Client')} />
      case 'Fonts':
        return (
          <FontSection
            getUi={g('UI Font')} setUi={s('UI Font')}
            getSrf={g('Screen Render Font')} setSrf={s('Screen Render Font')}
          />
        )
      case 'Turbo Hotkeys':
        return (
          <TurboHotkeys
            pairs={getSectionPairs('Turbo Hotkeys')}
            set={(key, value) => setValue('Turbo Hotkeys', key, value)}
            add={(key, value) => addValue('Turbo Hotkeys', key, value)}
            remove={(key) => removeValue('Turbo Hotkeys', key)}
          />
        )
      case 'Global Configs':
        return <GlobalConfigs get={g('Global Configs')} set={s('Global Configs')} />
      case 'Cell Color':
        return <CellColors get={g('Cell Color')} set={s('Cell Color')} />
      case 'Images':
        return (
          <ImagesSection
            get={g('Images')} set={s('Images')}
            pairs={getSectionPairs('Images')}
            add={(key, value) => addValue('Images', key, value)}
            remove={(key) => removeValue('Images', key)}
            skillKeys={getSectionPairs('AOE Color').map(p => p.key)}
          />
        )
      case 'AOE Time':
        return (
          <AoeTime
            pairs={getSectionPairs('AOE Time')}
            set={(key, value) => setValue('AOE Time', key, value)}
            add={(key, value) => addValue('AOE Time', key, value)}
            remove={(key) => removeValue('AOE Time', key)}
            skillKeys={getSectionPairs('AOE Color').map(p => p.key)}
          />
        )
      case 'AOE Color':
        return (
          <AoeColor
            get={g('AOE Color')} set={s('AOE Color')}
            pairs={getSectionPairs('AOE Color')}
          />
        )
      default:
        return null
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base">
        <div className="text-muted font-mono text-sm">Loading…</div>
      </div>
    )
  }

  // ── Fatal error — file not found ──────────────────────────────────────────

  if (fatalError) {
    return (
      <div className="flex items-center justify-center h-screen bg-base">
        <div className="bg-surface border border-red/40 rounded-xl p-8 max-w-md w-full mx-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-red text-2xl">⚠</span>
            <h2 className="text-text font-display font-bold text-xl tracking-wide">
              plugin.ini Not Found
            </h2>
          </div>
          <p className="text-muted text-sm font-mono leading-relaxed whitespace-pre-wrap mb-6">
            {fatalError}
          </p>
          <button
            onClick={doQuit}
            className="w-full px-4 py-2.5 bg-panel border border-red/40 rounded
                       text-red font-display font-semibold text-sm
                       hover:bg-red/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // ── Unsaved changes / quit confirm ────────────────────────────────────────

  return (
    <div className="flex h-screen bg-base overflow-hidden">

      {confirmQuit && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm">
          <div className="bg-surface border border-border-bright rounded-xl p-7 max-w-sm w-full mx-6 shadow-2xl">
            <h2 className="text-text font-display font-bold text-lg mb-2">Unsaved changes</h2>
            <p className="text-muted text-sm mb-6">
              You have unsaved changes. Quit anyway?
            </p>
            <div className="flex gap-3">
              <button
                onClick={doQuit}
                className="flex-1 px-4 py-2 bg-red/10 border border-red/40 rounded
                           text-red font-display font-semibold text-sm
                           hover:bg-red/20 transition-colors"
              >
                Quit without saving
              </button>
              <button
                onClick={() => setConfirmQuit(false)}
                className="flex-1 px-4 py-2 bg-accent/10 border border-accent rounded
                           text-accent font-display font-semibold text-sm
                           hover:bg-accent/20 transition-colors"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar active={activeSection} onSelect={setActiveSection} hasFile={!!config} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface flex-shrink-0">
          <div className="flex-1 min-w-0">
            {filePath && (
              <div className="flex items-center gap-2">
                <span className="text-muted text-xs font-mono truncate" title={filePath}>
                  {(() => {
                    const parts = filePath.replace(/\//g, '\\').split('\\')
                    return parts.length >= 2 ? parts.slice(-2).join('\\') : filePath
                  })()}
                </span>
                {dirty && (
                  <span className="flex-shrink-0 text-amber text-xs font-mono">● unsaved</span>
                )}
              </div>
            )}
          </div>

          {status && (
            <span className={`text-xs font-mono ${status.color}`}>{status.msg}</span>
          )}

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-panel border border-border rounded text-muted text-sm
                         font-display font-semibold hover:border-amber hover:text-amber transition-colors"
              title="Reset all settings to factory defaults"
            >
              Reset defaults
            </button>
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
