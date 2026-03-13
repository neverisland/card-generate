import { useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import type Konva from 'konva'
import { Group, Image, Layer, Rect, Stage, Text, Transformer } from 'react-konva'
import { useLoadedImage } from '../hooks/useLoadedImage'
import type { CardDocument, CardElement } from '../types'

interface CardCanvasProps {
  document: CardDocument
  selectedId: string | null
  qrCodeSrc: string | null
  isExporting: boolean
  stageRef: React.RefObject<Konva.Stage | null>
  onSelect: (elementId: string | null) => void
  onElementChange: (elementId: string, changes: Partial<CardElement>) => void
}

type ClipContext = {
  beginPath: () => void
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
  quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void
  closePath: () => void
}

const drawRoundedRectPath = (context: ClipContext, width: number, height: number, radius: number) => {
  const nextRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(nextRadius, 0)
  context.lineTo(width - nextRadius, 0)
  context.quadraticCurveTo(width, 0, width, nextRadius)
  context.lineTo(width, height - nextRadius)
  context.quadraticCurveTo(width, height, width - nextRadius, height)
  context.lineTo(nextRadius, height)
  context.quadraticCurveTo(0, height, 0, height - nextRadius)
  context.lineTo(0, nextRadius)
  context.quadraticCurveTo(0, 0, nextRadius, 0)
  context.closePath()
}

export function CardCanvas({
  document,
  selectedId,
  qrCodeSrc,
  isExporting,
  stageRef,
  onSelect,
  onElementChange,
}: CardCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const transformerRef = useRef<Konva.Transformer | null>(null)
  const shapeRefs = useRef<Record<string, Konva.Group | null>>({})
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const qrImage = useLoadedImage(qrCodeSrc ?? undefined)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer || isExporting) {
      return
    }

    const node = selectedId ? shapeRefs.current[selectedId] : null
    const element = document.elements.find((item) => item.id === selectedId)

    if (!node || !element || element.locked || !element.visible) {
      transformer.nodes([])
      transformer.getLayer()?.batchDraw()
      return
    }

    transformer.nodes([node])
    transformer.getLayer()?.batchDraw()
  }, [document.elements, isExporting, selectedId])

  const orderedElements = useMemo(
    () =>
      [...document.elements]
        .filter((element) => element.visible)
        .sort((left, right) => left.zIndex - right.zIndex),
    [document.elements],
  )

  const scale = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return 1
    }

    const viewportInset = viewport.width <= 720 ? 16 : 32
    const horizontal = (viewport.width - viewportInset) / document.meta.width
    const vertical = (viewport.height - viewportInset) / document.meta.height
    return Math.min(horizontal, vertical, 1)
  }, [document.meta.height, document.meta.width, viewport.height, viewport.width])

  const handleTransformEnd = (element: CardElement) => {
    const node = shapeRefs.current[element.id]
    if (!node) {
      return
    }

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)

    const nextWidth = Math.max(72, element.width * scaleX)
    const nextHeight = Math.max(28, element.height * scaleY)

    if (element.type === 'text') {
      onElementChange(element.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: nextWidth,
        height: nextHeight,
        fontSize: Math.max(12, element.fontSize * ((scaleX + scaleY) / 2)),
      })
      return
    }

    onElementChange(element.id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: nextWidth,
      height: nextHeight,
    })
  }

  return (
    <section className="canvas-panel">
      <div className="canvas-meta">
        <div>
          <span className="canvas-badge">实时预览</span>
          <h2>{document.meta.orientation === 'landscape' ? '横版名片' : '竖版名片'}</h2>
        </div>
        <p>
          {document.meta.width} x {document.meta.height}px
        </p>
      </div>

      <div className="canvas-shell custom-scrollbar" ref={containerRef}>
        <div className="canvas-frame" style={{ width: document.meta.width * scale, height: document.meta.height * scale }}>
          <div style={{ width: document.meta.width, height: document.meta.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <Stage
              ref={stageRef}
              width={document.meta.width}
              height={document.meta.height}
              onMouseDown={(event) => {
                const targetName = event.target.name()
                if (event.target === event.target.getStage() || targetName === 'background-node') {
                  onSelect(null)
                }
              }}
              onTouchStart={(event) => {
                const targetName = event.target.name()
                if (event.target === event.target.getStage() || targetName === 'background-node') {
                  onSelect(null)
                }
              }}
            >
              <Layer>
                <Group clipFunc={(context) => drawRoundedRectPath(context as unknown as ClipContext, document.meta.width, document.meta.height, document.meta.cornerRadius)}>
                  <Rect width={document.meta.width} height={document.meta.height} fill="#ffffff" name="background-node" />
                  <Rect width={document.meta.width} height={document.meta.height} fill={document.meta.backgroundColor} name="background-node" />
                  {document.meta.useGradient ? (
                    <Rect
                      width={document.meta.width}
                      height={document.meta.height}
                      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                      fillLinearGradientEndPoint={{ x: document.meta.width, y: document.meta.height }}
                      fillLinearGradientColorStops={[0, document.meta.backgroundColor, 0.55, '#fff4e8', 1, document.meta.accentColor]}
                      opacity={0.9}
                      name="background-node"
                    />
                  ) : null}
                  <Rect x={0} y={0} width={document.meta.width} height={document.meta.height} fillLinearGradientStartPoint={{ x: 0, y: document.meta.height * 0.25 }} fillLinearGradientEndPoint={{ x: document.meta.width, y: document.meta.height }} fillLinearGradientColorStops={[0, 'rgba(255,255,255,0)', 1, 'rgba(17,24,39,0.1)']} name="background-node" />
                  {orderedElements.map((element) => (
                    <EditableElement
                      key={element.id}
                      element={element}
                      qrImage={qrImage}
                      onSelect={onSelect}
                      onElementChange={onElementChange}
                      onTransformEnd={handleTransformEnd}
                      shapeRefs={shapeRefs}
                      content={document.content}
                      showFieldLabels={document.meta.showFieldLabels}
                    />
                  ))}
                </Group>

                {!isExporting ? (
                  <Transformer
                    ref={transformerRef}
                    anchorStroke="#f97316"
                    borderStroke="#f97316"
                    borderDash={[6, 6]}
                    anchorFill="#ffffff"
                    anchorSize={10}
                    rotateEnabled
                    ignoreStroke
                    boundBoxFunc={(oldBox, newBox) => (newBox.width < 40 || newBox.height < 24 ? oldBox : newBox)}
                  />
                ) : null}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </section>
  )
}

interface EditableElementProps {
  element: CardElement
  qrImage: HTMLImageElement | null
  onSelect: (elementId: string | null) => void
  onElementChange: (elementId: string, changes: Partial<CardElement>) => void
  onTransformEnd: (element: CardElement) => void
  shapeRefs: React.MutableRefObject<Record<string, Konva.Group | null>>
  content: CardDocument['content']
  showFieldLabels: boolean
}

function EditableElement({
  element,
  qrImage,
  onSelect,
  onElementChange,
  onTransformEnd,
  shapeRefs,
  content,
  showFieldLabels,
}: EditableElementProps) {
  const rawValue =
    element.type === 'text'
      ? content[element.contentKey].trim()
        ? element.uppercase
          ? content[element.contentKey].toUpperCase()
          : content[element.contentKey]
        : element.placeholder
      : ''
  const textValue =
    element.type === 'text'
      ? showFieldLabels
        ? `${element.label}：${rawValue}`
        : rawValue
      : ''
  const wrapMode =
    element.type === 'text' && ['email', 'address'].includes(element.contentKey) ? 'char' : 'word'
  const fontSizeMultiplier =
    showFieldLabels && element.type === 'text'
      ? element.contentKey === 'fullName'
        ? 0.58
        : 0.9
      : 1

  return (
    <Group
      ref={(node) => {
        shapeRefs.current[element.id] = node
      }}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      draggable={!element.locked}
      onMouseDown={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDragEnd={(event) => onElementChange(element.id, { x: event.target.x(), y: event.target.y() })}
      onTransformEnd={() => onTransformEnd(element)}
    >
      {element.type === 'text' ? (
        <Text
          text={textValue}
          width={element.width}
          height={element.height}
          fontSize={element.fontSize * fontSizeMultiplier}
          fontFamily={element.fontFamily}
          fontStyle={element.fontWeight >= 600 ? 'bold' : 'normal'}
          fill={content[element.contentKey].trim() ? element.color : 'rgba(55, 65, 81, 0.55)'}
          align={element.align}
          letterSpacing={element.letterSpacing}
          verticalAlign="middle"
          wrap={wrapMode}
          lineHeight={1.18}
          listening={false}
        />
      ) : null}
      {element.type === 'qrcode' ? <QRCodeNode element={element} qrImage={qrImage} qrText={content.qrText} /> : null}
    </Group>
  )
}

interface QRCodeNodeProps {
  element: Extract<CardElement, { type: 'qrcode' }>
  qrImage: HTMLImageElement | null
  qrText: string
}

function QRCodeNode({ element, qrImage, qrText }: QRCodeNodeProps) {
  const outerRadius = Math.max(20, Math.min(28, Math.min(element.width, element.height) * 0.14))
  const panelInset = Math.max(12, Math.min(18, Math.min(element.width, element.height) * 0.08))
  const qrSize = Math.min(element.width, element.height) - panelInset * 2

  return (
    <Group>
      <Rect
        width={element.width}
        height={element.height}
        fill="rgba(255, 247, 237, 0.92)"
        stroke="rgba(154, 52, 18, 0.12)"
        strokeWidth={1}
        cornerRadius={outerRadius}
        shadowColor="rgba(194, 65, 12, 0.12)"
        shadowBlur={18}
        shadowOffset={{ x: 0, y: 8 }}
        shadowOpacity={0.18}
      />
      {qrImage && qrText.trim() ? (
        <Image image={qrImage} x={panelInset} y={panelInset} width={qrSize} height={qrSize} cornerRadius={18} />
      ) : (
        <>
          <Rect
            x={panelInset}
            y={panelInset}
            width={qrSize}
            height={qrSize}
            cornerRadius={18}
            stroke={element.foregroundColor}
            dash={[8, 6]}
            strokeWidth={2}
          />
          <Text
            x={panelInset}
            y={panelInset}
            width={qrSize}
            height={qrSize}
            text="输入文本后\n生成二维码"
            align="center"
            verticalAlign="middle"
            fontFamily="Manrope"
            fontSize={Math.max(12, Math.min(16, element.width * 0.07))}
            fill={element.foregroundColor}
          />
        </>
      )}
    </Group>
  )
}
