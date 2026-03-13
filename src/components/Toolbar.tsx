import type { CardOrientation, ExportFormat } from '../types'

interface ToolbarProps {
  orientation: CardOrientation
  onOrientationChange: (orientation: CardOrientation) => void
  onReset: () => void
  onExport: (format: ExportFormat) => void
}

export function Toolbar({ orientation, onOrientationChange, onReset, onExport }: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <p className="eyebrow">Business Card Designer</p>
        <h1>实时名片生成器</h1>
      </div>

      <div className="toolbar-controls">
        <div className="toolbar-group">
          <div className="segmented-control full-width toolbar-segmented">
            <button
              type="button"
              className={orientation === 'landscape' ? 'active' : ''}
              onClick={() => onOrientationChange('landscape')}
            >
              横版
            </button>
            <button
              type="button"
              className={orientation === 'portrait' ? 'active' : ''}
              onClick={() => onOrientationChange('portrait')}
            >
              竖版
            </button>
          </div>
        </div>

        <div className="toolbar-group toolbar-actions">
          <button type="button" className="secondary-button" onClick={onReset}>
            重置模板
          </button>
          <button type="button" className="secondary-button" onClick={() => onExport('jpeg')}>
            导出 JPG
          </button>
          <button type="button" className="primary-button" onClick={() => onExport('png')}>
            导出 PNG
          </button>
        </div>
      </div>
    </header>
  )
}
