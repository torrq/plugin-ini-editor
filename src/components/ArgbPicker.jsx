import { useState } from 'react'

// Parses "0xAARRGGBB" or "0xRRGGBB" into { alpha, rgbHex }
function parseArgb(value) {
  const raw = (value || '0xFF888888').replace(/^0x/i, '').toUpperCase()
  const padded = raw.padStart(8, 'F')
  const alpha = parseInt(padded.slice(0, 2), 16) // 0–255
  const rgbHex = '#' + padded.slice(2)           // #RRGGBB
  return { alpha, rgbHex }
}

function buildArgb(alpha, rgbHex) {
  const a = Math.round(alpha).toString(16).padStart(2, '0').toUpperCase()
  const rgb = rgbHex.replace('#', '').toUpperCase()
  return `0x${a}${rgb}`
}

export default function ArgbPicker({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [rawInput, setRawInput] = useState('')

  const { alpha, rgbHex } = parseArgb(value)
  const alphaPercent = Math.round((alpha / 255) * 100)

  // Composite preview color for the swatch
  const previewStyle = {
    backgroundColor: rgbHex,
    opacity: alpha / 255,
  }

  const handleRgbChange = (e) => {
    onChange(buildArgb(alpha, e.target.value))
  }

  const handleAlphaSlider = (e) => {
    onChange(buildArgb(parseInt(e.target.value), rgbHex))
  }

  const handleHexInput = (e) => {
    const v = e.target.value
    setRawInput(v)
    if (/^0x[0-9A-Fa-f]{8}$/.test(v)) {
      onChange(v.toUpperCase())
    }
  }

  const handleHexBlur = () => {
    setEditing(false)
    setRawInput('')
  }

  const displayHex = editing ? rawInput : (value || '0xFF888888').toUpperCase()

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Swatch + color picker */}
      <div className="relative flex-shrink-0" style={{ width: 32, height: 32 }}>
        {/* Checkerboard background to show transparency */}
        <div
          className="absolute inset-0 rounded border border-border"
          style={{
            backgroundImage: 'repeating-conic-gradient(#2a2d3a 0% 25%, #1a1d26 0% 50%)',
            backgroundSize: '8px 8px',
          }}
        />
        <div
          className="absolute inset-0 rounded"
          style={previewStyle}
        />
        <input
          type="color"
          value={rgbHex}
          onChange={handleRgbChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Click to pick color"
        />
      </div>

      {/* Alpha slider */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-muted text-xs font-display uppercase tracking-wider w-8">A</span>
        <input
          type="range"
          min="0"
          max="255"
          value={alpha}
          onChange={handleAlphaSlider}
          className="w-20"
          title={`Alpha: ${alphaPercent}%`}
        />
        <span className="text-muted text-xs font-mono w-8 text-right">{alphaPercent}%</span>
      </div>

      {/* Hex input */}
      <input
        type="text"
        value={displayHex}
        onChange={handleHexInput}
        onFocus={() => { setEditing(true); setRawInput(displayHex) }}
        onBlur={handleHexBlur}
        className="font-mono text-xs bg-panel border border-border rounded px-2 py-1 w-28 text-text focus:outline-none focus:border-accent transition-colors"
        spellCheck={false}
        maxLength={10}
        title="Edit hex value directly (0xAARRGGBB)"
      />
    </div>
  )
}
