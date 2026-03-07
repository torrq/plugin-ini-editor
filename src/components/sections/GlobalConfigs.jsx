import Toggle from '../Toggle'

export default function GlobalConfigs({ get, set }) {
  const isOn = (key) => get(key) === '1'
  const toggle = (key) => set(key, isOn(key) ? '0' : '1')

  const fadeVal = parseInt(get('fade_hold_percent') || '25')

  return (
    <div className="section-card">
      <h2 className="section-title">Global Configs</h2>
      <p className="section-subtitle">Global drawing and display behavior settings.</p>

      <div className="space-y-1">
        {/* draw_on_dc_lgp */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <div className="text-text font-display font-semibold">Draw Circle/Square on Dead Cells</div>
            <div className="text-muted text-xs font-mono">Paint circle/square overlays on non-walkable cells</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${isOn('draw_on_dc_lgp') ? 'text-green border-green' : ''}`}>
              {isOn('draw_on_dc_lgp') ? 'ON' : 'OFF'}
            </span>
            <Toggle checked={isOn('draw_on_dc_lgp')} onChange={() => toggle('draw_on_dc_lgp')} />
          </div>
        </div>

        {/* draw_on_dc_aoe */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <div className="text-text font-display font-semibold">Draw AOEs on Dead Cells</div>
            <div className="text-muted text-xs font-mono">Paint AOE overlays on non-walkable cells</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${isOn('draw_on_dc_aoe') ? 'text-green border-green' : ''}`}>
              {isOn('draw_on_dc_aoe') ? 'ON' : 'OFF'}
            </span>
            <Toggle checked={isOn('draw_on_dc_aoe')} onChange={() => toggle('draw_on_dc_aoe')} />
          </div>
        </div>

        {/* fade_hold_percent */}
        <div className="py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-text font-display font-semibold">Fade Hold Percent</div>
              <div className="text-muted text-xs font-mono">When AOE overlay starts fading (% of its display duration)</div>
            </div>
            <span className="font-mono text-accent text-sm font-semibold">{fadeVal}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted text-xs font-mono w-4">0</span>
            <input
              type="range"
              min="0"
              max="95"
              value={fadeVal}
              onChange={e => set('fade_hold_percent', e.target.value)}
              className="flex-1"
            />
            <span className="text-muted text-xs font-mono w-6">95</span>
            <input
              type="number"
              min="0"
              max="95"
              value={fadeVal}
              onChange={e => set('fade_hold_percent', e.target.value)}
              className="field-input w-16 text-right"
            />
          </div>
        </div>

        {/* aoes_indicator */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-text font-display font-semibold">AOE Center Indicator</div>
            <div className="text-muted text-xs font-mono">
              Highlight the center cell of a skill area even when <span className="text-accent">/aoes</span> is disabled
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${isOn('aoes_indicator') ? 'text-green border-green' : ''}`}>
              {isOn('aoes_indicator') ? 'ON' : 'OFF'}
            </span>
            <Toggle checked={isOn('aoes_indicator')} onChange={() => toggle('aoes_indicator')} />
          </div>
        </div>
      </div>
    </div>
  )
}
