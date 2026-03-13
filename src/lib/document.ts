import { createDefaultDocument } from '../defaultDocument'
import type {
  CardDocument,
  CardElement,
  CardOrientation,
  QRCodeElement,
  TextElement,
} from '../types'

export const STORAGE_KEY = 'business-card-designer:v1'

const SECONDARY_FIELD_IDS = new Set(['social', 'address'])

const sortByZIndex = (elements: CardElement[]) => [...elements].sort((left, right) => left.zIndex - right.zIndex)

export const normalizeElements = (elements: CardElement[]): CardElement[] =>
  sortByZIndex(elements).map((element, index) => ({
    ...element,
    zIndex: index,
  }))

const mergeElementStyle = (template: CardElement, existing?: CardElement): CardElement => {
  if (!existing || existing.type !== template.type) {
    return template
  }

  if (template.type === 'text' && existing.type === 'text') {
    const next: TextElement = {
      ...template,
      color: existing.color,
      fontFamily: existing.fontFamily,
      fontSize: existing.fontSize,
      fontWeight: existing.fontWeight,
      align: existing.align,
      letterSpacing: existing.letterSpacing,
      uppercase: existing.uppercase,
      visible: existing.visible,
      locked: existing.locked,
    }
    return next
  }

  if (template.type === 'qrcode' && existing.type === 'qrcode') {
    const next: QRCodeElement = {
      ...template,
      foregroundColor: existing.foregroundColor,
      backgroundColor: existing.backgroundColor,
      visible: existing.visible,
      locked: existing.locked,
    }
    return next
  }

  return template
}

const applyOrientationVisibility = (
  element: CardElement,
  orientation: CardOrientation,
  preserveCurrentVisibility: boolean,
): CardElement => {
  if (!SECONDARY_FIELD_IDS.has(element.id)) {
    return element
  }

  if (preserveCurrentVisibility) {
    return element
  }

  return {
    ...element,
    visible: orientation === 'landscape',
  }
}

export const loadStoredDocument = (): CardDocument | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<CardDocument>
    const orientation = parsed?.meta?.orientation === 'portrait' ? 'portrait' : 'landscape'
    const template = createDefaultDocument(orientation)
    const layoutMatches = parsed?.meta?.layoutVersion === template.meta.layoutVersion
    const incomingElements = new Map(
      (parsed.elements ?? [])
        .filter((element) => !['slogan', 'website', 'avatar', 'photo', 'company'].includes(element.id))
        .map((element) => [element.id, element] as const),
    )

    return {
      meta: {
        ...template.meta,
        ...parsed.meta,
        orientation,
        layoutVersion: template.meta.layoutVersion,
        themeId: parsed?.meta?.themeId ?? template.meta.themeId,
      },
      content: {
        ...template.content,
        ...parsed.content,
      },
      assets: {},
      elements: normalizeElements(
        template.elements.map((element) => {
          const existing = incomingElements.get(element.id)
          if (!existing || existing.type !== element.type) {
            return element
          }

          const merged = layoutMatches
            ? ({ ...element, ...existing, zIndex: element.zIndex } as CardElement)
            : mergeElementStyle(element, existing)

          return applyOrientationVisibility(merged, orientation, layoutMatches)
        }),
      ),
    }
  } catch {
    return null
  }
}

export const scaleDocumentToOrientation = (
  document: CardDocument,
  orientation: CardOrientation,
): CardDocument => {
  if (document.meta.orientation === orientation) {
    return document
  }

  const template = createDefaultDocument(orientation)
  const currentElements = new Map(document.elements.map((element) => [element.id, element] as const))

  return {
    meta: {
      ...template.meta,
      backgroundColor: document.meta.backgroundColor,
      accentColor: document.meta.accentColor,
      useGradient: document.meta.useGradient,
      cornerRadius: document.meta.cornerRadius,
      padding: document.meta.padding,
      showFieldLabels: document.meta.showFieldLabels,
      themeId: document.meta.themeId,
    },
    content: {
      ...document.content,
    },
    assets: {},
    elements: normalizeElements(
      template.elements.map((element) =>
        applyOrientationVisibility(
          mergeElementStyle(element, currentElements.get(element.id)),
          orientation,
          false,
        ),
      ),
    ),
  }
}

export const updateElementInDocument = (
  document: CardDocument,
  elementId: string,
  updater: (element: CardElement) => CardElement,
): CardDocument => ({
  ...document,
  elements: normalizeElements(
    document.elements.map((element) => (element.id === elementId ? updater(element) : element)),
  ),
})

export const moveElementLayer = (
  document: CardDocument,
  elementId: string,
  direction: 'up' | 'down',
): CardDocument => {
  const ordered = sortByZIndex(document.elements)
  const index = ordered.findIndex((element) => element.id === elementId)
  if (index === -1) {
    return document
  }

  const targetIndex =
    direction === 'up'
      ? Math.min(ordered.length - 1, index + 1)
      : Math.max(0, index - 1)

  if (targetIndex === index) {
    return document
  }

  const next = [...ordered]
  const [current] = next.splice(index, 1)
  next.splice(targetIndex, 0, current)

  return {
    ...document,
    elements: normalizeElements(next),
  }
}

export const deleteElementFromDocument = (document: CardDocument, elementId: string): CardDocument => ({
  ...document,
  elements: normalizeElements(document.elements.filter((element) => element.id !== elementId)),
})

export const resetDocument = () => createDefaultDocument()
