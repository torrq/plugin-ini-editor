import { useState, useEffect, useRef } from 'react'

const SUFFIX_OPTIONS = [
  { value: '',              label: 'Basic — Hotkey + LMB' },
  { value: '<CLICK_ONLY>',  label: 'Click Only — LMB, hotkey blocked' },
  { value: '<HOTKEY_ONLY>', label: 'Hotkey Only — no click, cyclic' },
]

const SLOTS = ['BTN_ID1', 'BTN_ID2', 'BTN_ID3', 'BTN_ID4']

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
      // ESC cancels without binding
      if (e.code === 'Escape') { setListening(false); return }
      const ini = CODE_TO_INI[e.code]
      if (ini) {
        onChange(ini)
        setListening(false)
      }
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
            ? <kbd className="px-2 py-0.5 bg-base border border-border-bright rounded text-accent text-xs font-mono">
                {value}
              </kbd>
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

export default function TurboHotkeys({ get, set }) {
  return (
    <div>
      <div className="section-card">
        <h2 className="section-title">Turbo Hotkeys</h2>
        <p className="section-subtitle">
          Click a key slot to bind it, then press the key you want.
          Enable Turbo Mode in-game with{' '}
          <span className="font-mono text-accent">/turbo</span>.
          Restart your client after saving changes.
        </p>

        <div className="space-y-3 mt-2">
          {SLOTS.map((slot, i) => {
            const raw = get(slot)
            const { key, suffix } = parseSlotValue(raw)

            return (
              <div key={slot} className="flex items-center gap-4 p-4 bg-panel rounded-lg border border-border">
                <div className="w-14 flex-shrink-0">
                  <div className="text-text font-display font-bold">Slot {i + 1}</div>
                  <div className="text-subtle text-xs font-mono">{slot}</div>
                </div>

                <div className="w-40 flex-shrink-0">
                  <div className="field-label text-xs mb-1.5">Key</div>
                  <KeyCapture
                    value={key}
                    onChange={newKey => set(slot, buildSlotValue(newKey, suffix))}
                  />
                </div>

                <div className="flex-1">
                  <div className="field-label text-xs mb-1.5">Mode</div>
                  <select
                    value={suffix}
                    onChange={e => set(slot, buildSlotValue(key, e.target.value))}
                    className="field-input"
                    disabled={!key}
                  >
                    {SUFFIX_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="w-52 flex-shrink-0 text-muted text-xs font-mono leading-relaxed">
                  {!key && <span className="text-subtle">—</span>}
                  {key && suffix === '' && 'Hold key, then left-click to place skill'}
                  {key && suffix === '<CLICK_ONLY>' && 'Quick LMB only — the hotkey itself is blocked'}
                  {key && suffix === '<HOTKEY_ONLY>' && 'Hotkey alone places skill — cycles through targets'}
                </div>

                {raw && (
                  <button
                    onClick={() => set(slot, '')}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center
                               text-subtle hover:text-red transition-colors text-xl leading-none"
                    title="Clear"
                  >
                    ×
                  </button>
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
