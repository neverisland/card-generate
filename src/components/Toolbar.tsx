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
      <div>
        <p className="eyebrow">Business Card Designer</p>
        <h1>实时名片生成器</h1>
      </div>

      <div className="toolbar-actions">
        <div className="segmented-control">
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
    </header>
  )
}
