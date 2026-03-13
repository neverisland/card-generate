import type React from 'react'
import { CARD_THEMES } from '../themes'
import type {
  CardDocument,
  CardElement,
  CardMeta,
  CardThemeId,
  TextAlign,
  TextContentKey,
  TextElement,
} from '../types'

interface ControlPanelProps {
  document: CardDocument
  selectedElement: CardElement | null
  onContentChange: (key: TextContentKey, value: string) => void
  onMetaChange: (changes: Partial<CardMeta>) => void
  onApplyTheme: (themeId: Exclude<CardThemeId, 'custom'>) => void
  onElementChange: (elementId: string, changes: Partial<CardElement>) => void
  onDeleteElement: (elementId: string) => void
  onMoveLayer: (elementId: string, direction: 'up' | 'down') => void
  onSelectElement: (elementId: string) => void
}

type FieldConfig = {
  key: TextContentKey
  label: string
  multiline?: boolean
  fullWidth?: boolean
}

const identityFields: FieldConfig[] = [
  { key: 'fullName', label: '姓名', fullWidth: true },
  { key: 'role', label: '职位', fullWidth: true },
]

const mainContactFields: FieldConfig[] = [
  { key: 'phone', label: '手机号', fullWidth: true },
  { key: 'email', label: '邮箱', fullWidth: true },
]

const secondaryFields: FieldConfig[] = [
  { key: 'social', label: '社交账号' },
  { key: 'address', label: '地址', multiline: true, fullWidth: true },
]

const qrFields: FieldConfig[] = [
  { key: 'qrText', label: '二维码内容', multiline: true, fullWidth: true },
]

const alignOptions: Array<{ label: string; value: TextAlign }> = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
]

const renderField = (
  field: FieldConfig,
  document: CardDocument,
  onContentChange: ControlPanelProps['onContentChange'],
) => (
  <label key={field.key} className={`field ${field.fullWidth ? 'field-span-2' : ''}`}>
    <span>{field.label}</span>
    {field.multiline ? (
      <textarea
        rows={field.key === 'qrText' ? 3 : 2}
        value={document.content[field.key]}
        onChange={(event) => onContentChange(field.key, event.target.value)}
      />
    ) : (
      <input
        type="text"
        value={document.content[field.key]}
        onChange={(event) => onContentChange(field.key, event.target.value)}
      />
    )}
  </label>
)

export function ControlPanel({
  document,
  selectedElement,
  onContentChange,
  onMetaChange,
  onApplyTheme,
  onElementChange,
  onDeleteElement,
  onMoveLayer,
  onSelectElement,
}: ControlPanelProps) {
  const orderedElements = [...document.elements].sort((left, right) => right.zIndex - left.zIndex)

  return (
    <aside className="panel custom-scrollbar">
      <section className="panel-section">
        <div className="section-heading">
          <h2>内容配置</h2>
          <span>文本信息 + 二维码</span>
        </div>

        <div className="section-stack">
          <div className="content-group">
            <div className="group-head">
              <p className="group-label">身份信息</p>
              <span className="group-note">保留更纯粹的文字主视觉</span>
            </div>
            <div className="field-grid">{identityFields.map((field) => renderField(field, document, onContentChange))}</div>
          </div>

          <div className="content-group">
            <div className="group-head">
              <p className="group-label">主联系方式</p>
              <span className="group-note">个人展示与职场交换都适用</span>
            </div>
            <div className="field-grid">{mainContactFields.map((field) => renderField(field, document, onContentChange))}</div>
          </div>

          <div className="content-group">
            <div className="group-head">
              <p className="group-label">次级信息</p>
              <span className="group-note">竖版默认收起，横版默认显示</span>
            </div>
            <div className="field-grid">{secondaryFields.map((field) => renderField(field, document, onContentChange))}</div>
          </div>

          <div className="content-group">
            <div className="group-head">
              <p className="group-label">二维码</p>
              <span className="group-note">输入链接、文本或联系方式即可生成</span>
            </div>
            <div className="field-grid">{qrFields.map((field) => renderField(field, document, onContentChange))}</div>
          </div>

          <label className="field toggle toggle-rich">
            <input
              type="checkbox"
              checked={document.meta.showFieldLabels}
              onChange={(event) => onMetaChange({ showFieldLabels: event.target.checked })}
            />
            <div className="toggle-copy">
              <span>显示字段标题</span>
              <small>例如：姓名：Alex Chen</small>
            </div>
          </label>
        </div>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <h2>视觉样式</h2>
          <span>{document.meta.themeId === 'custom' ? '当前为自定义主题' : '切换整套颜色方案'}</span>
        </div>

        <div className="theme-grid">
          {CARD_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`theme-card ${document.meta.themeId === theme.id ? 'selected' : ''}`}
              onClick={() => onApplyTheme(theme.id)}
            >
              <div className="theme-swatches">
                <span style={{ background: theme.backgroundColor }} />
                <span style={{ background: theme.accentColor }} />
                <span style={{ background: theme.qrDarkColor }} />
              </div>
              <strong>{theme.label}</strong>
              <small>{theme.description}</small>
            </button>
          ))}
        </div>

        <div className="field-grid compact">
          <label className="field">
            <span>背景色</span>
            <input type="color" value={document.meta.backgroundColor} onChange={(event) => onMetaChange({ backgroundColor: event.target.value })} />
          </label>
          <label className="field">
            <span>强调色</span>
            <input type="color" value={document.meta.accentColor} onChange={(event) => onMetaChange({ accentColor: event.target.value })} />
          </label>
          <label className="field toggle">
            <input type="checkbox" checked={document.meta.useGradient} onChange={(event) => onMetaChange({ useGradient: event.target.checked })} />
            <span>启用渐变背景</span>
          </label>
          <label className="field">
            <span>圆角</span>
            <input type="range" min="0" max="72" value={document.meta.cornerRadius} onChange={(event) => onMetaChange({ cornerRadius: Number(event.target.value) })} />
          </label>
          <label className="field">
            <span>边距</span>
            <input type="range" min="12" max="72" value={document.meta.padding} onChange={(event) => onMetaChange({ padding: Number(event.target.value) })} />
          </label>
        </div>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <h2>图层管理</h2>
          <span>按视觉权重检查元素</span>
        </div>
        <div className="element-list">
          {orderedElements.map((element) => (
            <button key={element.id} type="button" className={`element-chip ${selectedElement?.id === element.id ? 'selected' : ''}`} onClick={() => onSelectElement(element.id)}>
              <span>{element.label}</span>
              <small>{element.visible ? '显示' : '隐藏'} / {element.locked ? '锁定' : '可编辑'}</small>
            </button>
          ))}
        </div>
      </section>

      {selectedElement ? (
        <section className="panel-section accent">
          <div className="section-heading">
            <h2>当前元素</h2>
            <span>{selectedElement.label}</span>
          </div>

          <div className="field-grid compact">
            <label className="field toggle">
              <input type="checkbox" checked={selectedElement.visible} onChange={(event) => onElementChange(selectedElement.id, { visible: event.target.checked })} />
              <span>显示元素</span>
            </label>
            <label className="field toggle">
              <input type="checkbox" checked={selectedElement.locked} onChange={(event) => onElementChange(selectedElement.id, { locked: event.target.checked })} />
              <span>锁定元素</span>
            </label>
            <label className="field">
              <span>X</span>
              <input type="number" value={Math.round(selectedElement.x)} onChange={(event) => onElementChange(selectedElement.id, { x: Number(event.target.value) })} />
            </label>
            <label className="field">
              <span>Y</span>
              <input type="number" value={Math.round(selectedElement.y)} onChange={(event) => onElementChange(selectedElement.id, { y: Number(event.target.value) })} />
            </label>
            <label className="field">
              <span>宽度</span>
              <input type="number" value={Math.round(selectedElement.width)} onChange={(event) => onElementChange(selectedElement.id, { width: Number(event.target.value) })} />
            </label>
            <label className="field">
              <span>高度</span>
              <input type="number" value={Math.round(selectedElement.height)} onChange={(event) => onElementChange(selectedElement.id, { height: Number(event.target.value) })} />
            </label>
          </div>

          {selectedElement.type === 'text' ? <TextElementControls element={selectedElement} onElementChange={onElementChange} /> : null}

          <div className="inline-actions">
            <button type="button" className="secondary-button" onClick={() => onMoveLayer(selectedElement.id, 'up')}>上移一层</button>
            <button type="button" className="secondary-button" onClick={() => onMoveLayer(selectedElement.id, 'down')}>下移一层</button>
            <button type="button" className="danger-button" onClick={() => onDeleteElement(selectedElement.id)}>删除元素</button>
          </div>
        </section>
      ) : null}
    </aside>
  )
}

interface TextElementControlsProps {
  element: TextElement
  onElementChange: ControlPanelProps['onElementChange']
}

function TextElementControls({ element, onElementChange }: TextElementControlsProps) {
  return (
    <div className="field-grid compact">
      <label className="field">
        <span>字号</span>
        <input type="range" min="12" max="88" value={element.fontSize} onChange={(event) => onElementChange(element.id, { fontSize: Number(event.target.value) })} />
      </label>
      <label className="field">
        <span>颜色</span>
        <input type="color" value={element.color} onChange={(event) => onElementChange(element.id, { color: event.target.value })} />
      </label>
      <label className="field">
        <span>字重</span>
        <input type="range" min="400" max="800" step="100" value={element.fontWeight} onChange={(event) => onElementChange(element.id, { fontWeight: Number(event.target.value) })} />
      </label>
      <label className="field">
        <span>字距</span>
        <input type="range" min="0" max="8" step="0.2" value={element.letterSpacing} onChange={(event) => onElementChange(element.id, { letterSpacing: Number(event.target.value) })} />
      </label>
      <div className="field segmented-field">
        <span>对齐</span>
        <div className="segmented-control full-width">
          {alignOptions.map((option) => (
            <button key={option.value} type="button" className={element.align === option.value ? 'active' : ''} onClick={() => onElementChange(element.id, { align: option.value })}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <label className="field toggle">
        <input type="checkbox" checked={Boolean(element.uppercase)} onChange={(event) => onElementChange(element.id, { uppercase: event.target.checked })} />
        <span>全部大写</span>
      </label>
    </div>
  )
}

