import { useState, useEffect, useRef } from 'react'

const SUFFIX_OPTIONS = [
  { value: '',              label: 'Basic — Hotkey + LMB' },
  { value: '<CLICK_ONLY>',  label: 'Click Only — LMB, hotkey blocked' },
  { value: '<HOTKEY_ONLY>', label: 'Hotkey Only — no click, cyclic' },
]

// Map browser KeyboardEvent.code → plugin.ini key name
const CODE_TO_INI = {
  KeyA:'A', KeyB:'B', KeyC:'C', KeyD:'D', KeyE:'E', KeyF:'F', KeyG:'G',
  KeyH:'H', KeyI:'I', KeyJ:'J', KeyK:'K', KeyL:'L', KeyM:'M', KeyN:'N',
  KeyO:'O', KeyP:'P', KeyQ:'Q', KeyR:'R', KeyS:'S', KeyT:'T', KeyU:'U',
  KeyV:'V', KeyW:'W', KeyX:'X', KeyY:'Y', KeyZ:'Z',
  Digit0:'0', Digit1:'1', Digit2:'2', Digit3:'3', Digit4:'4',
  Digit5:'5', Digit6:'6', Digit7:'7', Digit8:'8', Digit9:'9',
  F1:'F1', F2:'F2', F3:'F3', F4:'F4', F5:'F5', F6:'F6',
  F7:'F7', F8:'F8', F9:'F9', F10:'F10', F11:'F11', F12:'F12',
  F13:'F13', F14:'F14', F15:'F15', F16:'F16', F17:'F17', F18:'F18',
  F19:'F19', F20:'F20', F21:'F21', F22:'F22', F23:'F23', F24:'F24',
  Escape:'ESC', Tab:'TAB', CapsLock:'CAPS', Space:'SPACE',
  Enter:'ENTER', NumpadEnter:'ENTER',
  Backspace:'BACKSPACE',
  Insert:'INSERT', Delete:'DELETE',
  Home:'HOME', End:'END',
  PageUp:'PAGEUP', PageDown:'PAGEDOWN',
  ArrowLeft:'LEFT', ArrowRight:'RIGHT', ArrowUp:'UP', ArrowDown:'DOWN',
  PrintScreen:'PRINTSCREEN', ScrollLock:'SCROLLLOCK',
  Pause:'PAUSE', NumLock:'NUMLOCK',
  Numpad0:'NUMPAD0', Numpad1:'NUMPAD1', Numpad2:'NUMPAD2', Numpad3:'NUMPAD3',
  Numpad4:'NUMPAD4', Numpad5:'NUMPAD5', Numpad6:'NUMPAD6', Numpad7:'NUMPAD7',
  Numpad8:'NUMPAD8', Numpad9:'NUMPAD9',
  NumpadAdd:'NUMPADADD', NumpadSubtract:'NUMPADSUB',
  NumpadMultiply:'NUMPADMUL', NumpadDivide:'NUMPADDIV',
  NumpadDecimal:'DECIMAL',
  ShiftLeft:'LSHIFT', ShiftRight:'RSHIFT',
  ControlLeft:'LCTRL', ControlRight:'RCTRL',
  AltLeft:'LALT', AltRight:'RALT',
}

function parseSlotValue(raw) {
  const match = (raw || '').match(/^([^<]*?)(<[A-Z_]+>)?$/)
  if (!match) return { key: raw, suffix: '' }
  return { key: match[1] || '', suffix: match[2] || '' }
}

function buildSlotValue(key, suffix) {
  return key.trim() + suffix
}

function KeyCapture({ value, onChange }) {
  const [listening, setListening] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!listening) return
    const onKey = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.code === 'Escape') { setListening(false); return }
      const ini = CODE_TO_INI[e.code]
      if (ini) { onChange(ini); setListening(false) }
    }
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setListening(false)
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [listening, onChange])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setListening(l => !l)}
        className={`
          w-full text-left px-3 py-2 rounded border font-mono text-sm transition-all
          ${listening
            ? 'border-accent bg-accent/10 text-accent animate-pulse'
            : value
              ? 'border-border bg-panel text-text hover:border-border-bright cursor-pointer'
              : 'border-border border-dashed bg-panel text-subtle hover:border-border-bright cursor-pointer'
          }
        `}
      >
        {listening
          ? '⌨  Press a key…'
          : value
            ? <kbd className="px-2 py-0.5 bg-base border border-border-bright rounded text-accent text-xs font-mono">{value}</kbd>
            : <span className="text-subtle text-xs">Click to bind</span>
        }
      </button>
      {listening && (
        <div className="absolute -bottom-5 left-0 text-subtle text-xs font-mono whitespace-nowrap">
          ESC to cancel
        </div>
      )}
    </div>
  )
}

export default function TurboHotkeys({ pairs, set, add, remove }) {
  // Derive slots from pairs, sorted by BTN_ID number
  const slots = pairs
    .filter(p => /^BTN_ID\d+$/i.test(p.key))
    .sort((a, b) => {
      const na = parseInt(a.key.replace(/\D/g, ''))
      const nb = parseInt(b.key.replace(/\D/g, ''))
      return na - nb
    })

  const nextSlotId = () => {
    if (slots.length === 0) return 'BTN_ID1'
    const max = Math.max(...slots.map(s => parseInt(s.key.replace(/\D/g, ''))))
    return `BTN_ID${max + 1}`
  }

  return (
    <div>
      <div className="section-card">
        <div className="flex items-center justify-between mb-1">
          <h2 className="section-title">Turbo Hotkeys</h2>
          <button
            onClick={() => add(nextSlotId(), '')}
            className="px-3 py-1.5 bg-accent/10 border border-accent rounded
                       text-accent font-display font-semibold text-sm
                       hover:bg-accent/20 transition-colors"
          >
            + Add Slot
          </button>
        </div>
        <p className="section-subtitle">
          Click a key slot to bind it — just press the key you want.
          Enable Turbo Mode in-game with{' '}
          <span className="font-mono text-accent">/turbo</span>.
          Restart your client after saving changes.
        </p>

        {slots.length === 0 && (
          <div className="text-center text-muted py-8 font-mono text-sm border border-dashed border-border rounded-lg">
            No hotkey slots. Click "+ Add Slot" to create one.
          </div>
        )}

        <div className="space-y-3 mt-2">
          {slots.map(({ key: slotKey, value: raw }, i) => {
            const { key, suffix } = parseSlotValue(raw)

            const note = !key ? null
              : suffix === '' ? 'Hold key, then left-click to place skill'
              : suffix === '<CLICK_ONLY>' ? 'Quick LMB only — the hotkey itself is blocked'
              : suffix === '<HOTKEY_ONLY>' ? 'Hotkey alone places skill — cycles through targets'
              : null

            return (
              <div key={slotKey} className="p-4 bg-panel rounded-lg border border-border">
                {/* Top row: label + key + mode + remove */}
                <div className="flex items-center gap-4">
                  <div className="w-14 flex-shrink-0">
                    <div className="text-text font-display font-bold">Slot {i + 1}</div>
                  </div>

                  <div className="w-40 flex-shrink-0">
                    <div className="field-label text-xs mb-1.5">Key</div>
                    <KeyCapture
                      value={key}
                      onChange={newKey => set(slotKey, buildSlotValue(newKey, suffix))}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="field-label text-xs mb-1.5">Mode</div>
                    <select
                      value={suffix}
                      onChange={e => set(slotKey, buildSlotValue(key, e.target.value))}
                      className="field-input"
                      disabled={!key}
                    >
                      {SUFFIX_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => remove(slotKey)}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center
                               text-subtle hover:text-red transition-colors text-xl leading-none mt-4"
                    title="Remove slot"
                  >
                    ×
                  </button>
                </div>

                {/* Note below */}
                {note && (
                  <div className="mt-2 ml-18 text-muted text-xs font-mono" style={{ marginLeft: '4.5rem' }}>
                    {note}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">How Turbo Works</h2>
        <div className="space-y-0 text-sm">
          <div className="flex gap-3 py-2.5 border-b border-border">
            <span className="font-display font-semibold text-text w-28 flex-shrink-0">Basic</span>
            <span className="text-muted">Hold the hotkey, then left-click to instantly place a skill.</span>
          </div>
          <div className="flex gap-3 py-2.5 border-b border-border">
            <span className="font-display font-semibold text-text w-28 flex-shrink-0">Click Only</span>
            <span className="text-muted">Triggers a quick left-click. The bound key is blocked from its normal function.</span>
          </div>
          <div className="flex gap-3 py-2.5">
            <span className="font-display font-semibold text-text w-28 flex-shrink-0">Hotkey Only</span>
            <span className="text-muted">Hotkey alone places the skill with no mouse click. Cycles through targets.</span>
          </div>
        </div>
        <div className="mt-4 text-xs text-subtle font-mono border-t border-border pt-3">
          Turbo does not automate gameplay — player input is always required.
        </div>
      </div>
    </div>
  )
}
