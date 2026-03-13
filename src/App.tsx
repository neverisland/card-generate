import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import './App.css'
import { ControlPanel } from './components/ControlPanel'
import { Toolbar } from './components/Toolbar'
import { createDefaultDocument } from './defaultDocument'
import {
  deleteElementFromDocument,
  loadStoredDocument,
  moveElementLayer,
  scaleDocumentToOrientation,
  STORAGE_KEY,
  updateElementInDocument,
} from './lib/document'
import { applyThemeToDocument, getQRCodePalette } from './themes'
import type { CardDocument, CardElement, CardMeta, CardThemeId, ExportFormat, TextContentKey } from './types'

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
const MOBILE_LAYOUT_QUERY = '(max-width: 720px)'
const CardCanvas = lazy(() =>
  import('./components/CardCanvas').then((module) => ({ default: module.CardCanvas })),
)

type MobileWorkspaceView = 'preview' | 'editor'

function App() {
  const stageRef = useRef<Konva.Stage | null>(null)
  const [document, setDocument] = useState<CardDocument>(() => loadStoredDocument() ?? createDefaultDocument())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(() => window.matchMedia(MOBILE_LAYOUT_QUERY).matches)
  const [activeMobileView, setActiveMobileView] = useState<MobileWorkspaceView>('preview')

  const selectedElement = document.elements.find((element) => element.id === selectedId) ?? null

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(document))
  }, [document])

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LAYOUT_QUERY)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches)
    }

    setIsMobileLayout(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isMobileLayout) {
      setActiveMobileView('preview')
    }
  }, [isMobileLayout])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    if (!document.elements.some((element) => element.id === selectedId)) {
      setSelectedId(null)
    }
  }, [document.elements, selectedId])

  useEffect(() => {
    let cancelled = false

    const generate = async () => {
      if (!document.content.qrText.trim()) {
        setQrCodeSrc(null)
        return
      }

      const qrPalette = getQRCodePalette(document.meta)

      try {
        const { default: QRCode } = await import('qrcode')
        const dataUrl = await QRCode.toDataURL(document.content.qrText, {
          margin: 1,
          width: 360,
          color: {
            dark: qrPalette.dark,
            light: qrPalette.light,
          },
        })

        if (!cancelled) {
          setQrCodeSrc(dataUrl)
        }
      } catch {
        if (!cancelled) {
          setQrCodeSrc(null)
        }
      }
    }

    void generate()
    return () => {
      cancelled = true
    }
  }, [document.content.qrText, document.meta])

  const updateMeta = (changes: Partial<CardMeta>) => {
    setDocument((current) => ({
      ...current,
      meta: {
        ...current.meta,
        ...changes,
        themeId:
          'backgroundColor' in changes || 'accentColor' in changes || 'useGradient' in changes
            ? 'custom'
            : current.meta.themeId,
      },
    }))
  }

  const updateContent = (key: TextContentKey, value: string) => {
    setDocument((current) => ({
      ...current,
      content: { ...current.content, [key]: value },
    }))
  }

  const updateElement = (elementId: string, changes: Partial<CardElement>) => {
    setDocument((current) =>
      updateElementInDocument(current, elementId, (element) => ({ ...element, ...changes }) as CardElement),
    )
  }

  const applyTheme = (themeId: Exclude<CardThemeId, 'custom'>) => {
    setDocument((current) => applyThemeToDocument(current, themeId))
  }

  const handleExport = async (format: ExportFormat) => {
    const stage = stageRef.current
    if (!stage) {
      return
    }

    setSelectedId(null)
    setIsExporting(true)

    try {
      await nextFrame()
      await nextFrame()

      const dataUrl = stage.toDataURL({
        pixelRatio: 2,
        mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
        quality: format === 'png' ? 1 : 0.96,
      })

      const link = window.document.createElement('a')
      link.href = dataUrl
      link.download = `business-card.${format === 'png' ? 'png' : 'jpg'}`
      link.click()
    } finally {
      setIsExporting(false)
    }
  }

  const handleSelectElement = (elementId: string | null) => {
    setSelectedId(elementId)

    if (isMobileLayout && elementId) {
      setActiveMobileView('editor')
    }
  }

  return (
    <div className="app-shell">
      <Toolbar
        orientation={document.meta.orientation}
        onOrientationChange={(orientation) => {
          setDocument((current) => scaleDocumentToOrientation(current, orientation))
          setSelectedId(null)
        }}
        onReset={() => {
          setDocument(createDefaultDocument())
          setSelectedId(null)
        }}
        onExport={(format) => void handleExport(format)}
      />

      {isMobileLayout ? (
        <div className="workspace-tabs segmented-control full-width" aria-label="移动端视图切换">
          <button
            type="button"
            className={activeMobileView === 'preview' ? 'active' : ''}
            onClick={() => setActiveMobileView('preview')}
          >
            预览
          </button>
          <button
            type="button"
            className={activeMobileView === 'editor' ? 'active' : ''}
            onClick={() => setActiveMobileView('editor')}
          >
            编辑
          </button>
        </div>
      ) : null}

      <main className={`workspace ${isMobileLayout ? 'is-mobile-layout' : ''}`}>
        <div
          className={`workspace-pane workspace-pane-editor ${isMobileLayout && activeMobileView !== 'editor' ? 'workspace-pane-hidden' : ''}`}
        >
          <ControlPanel
            document={document}
            selectedElement={selectedElement}
            onContentChange={updateContent}
            onMetaChange={updateMeta}
            onApplyTheme={applyTheme}
            onElementChange={updateElement}
            onDeleteElement={(elementId) => {
              setDocument((current) => deleteElementFromDocument(current, elementId))
              setSelectedId(null)
            }}
            onMoveLayer={(elementId, direction) =>
              setDocument((current) => moveElementLayer(current, elementId, direction))
            }
            onSelectElement={handleSelectElement}
          />
        </div>

        <div
          className={`workspace-pane workspace-pane-preview ${isMobileLayout && activeMobileView !== 'preview' ? 'workspace-pane-hidden' : ''}`}
        >
          <Suspense fallback={<CanvasLoadingFallback orientation={document.meta.orientation} />}>
            <CardCanvas
              document={document}
              selectedId={selectedId}
              qrCodeSrc={qrCodeSrc}
              isExporting={isExporting}
              stageRef={stageRef}
              onSelect={handleSelectElement}
              onElementChange={updateElement}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function CanvasLoadingFallback({ orientation }: { orientation: CardDocument['meta']['orientation'] }) {
  return (
    <section className="canvas-panel canvas-panel-loading">
      <div className="canvas-meta">
        <div>
          <span className="canvas-badge">实时预览</span>
          <h2>{orientation === 'landscape' ? '横版名片' : '竖版名片'}</h2>
        </div>
        <p>正在加载画布...</p>
      </div>

      <div className="canvas-shell">
        <div className="canvas-loading-card">
          <div className="canvas-loading-shimmer" />
        </div>
      </div>
    </section>
  )
}

export default App
