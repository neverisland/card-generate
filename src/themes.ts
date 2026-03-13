import type { CardDocument, CardElement, CardMeta, CardThemeId } from './types'

export interface CardThemeDefinition {
  id: Exclude<CardThemeId, 'custom'>
  label: string
  description: string
  backgroundColor: string
  accentColor: string
  useGradient: boolean
  primaryTextColor: string
  secondaryTextColor: string
  tertiaryTextColor: string
  qrDarkColor: string
  qrLightColor: string
}

export const DEFAULT_THEME_ID: Exclude<CardThemeId, 'custom'> = 'warm'

export const CARD_THEMES: CardThemeDefinition[] = [
  {
    id: 'warm',
    label: '白橙',
    description: '暖米白 + 橙色，适合作品型名片',
    backgroundColor: '#f5efe6',
    accentColor: '#f97316',
    useGradient: true,
    primaryTextColor: '#111827',
    secondaryTextColor: '#4b5563',
    tertiaryTextColor: '#6b7280',
    qrDarkColor: '#9a3412',
    qrLightColor: '#fff7ed',
  },
  {
    id: 'slate',
    label: '雾蓝',
    description: '冷静蓝灰，更偏专业与科技',
    backgroundColor: '#eaf0f6',
    accentColor: '#2563eb',
    useGradient: true,
    primaryTextColor: '#0f172a',
    secondaryTextColor: '#475569',
    tertiaryTextColor: '#64748b',
    qrDarkColor: '#1d4ed8',
    qrLightColor: '#eff6ff',
  },
  {
    id: 'forest',
    label: '森绿',
    description: '柔和绿色，适合品牌和设计工作者',
    backgroundColor: '#edf5ef',
    accentColor: '#15803d',
    useGradient: true,
    primaryTextColor: '#12231a',
    secondaryTextColor: '#466255',
    tertiaryTextColor: '#698170',
    qrDarkColor: '#166534',
    qrLightColor: '#f0fdf4',
  },
  {
    id: 'berry',
    label: '莓红',
    description: '偏编辑感的玫红主题，识别度高',
    backgroundColor: '#f7eff4',
    accentColor: '#be185d',
    useGradient: true,
    primaryTextColor: '#20131d',
    secondaryTextColor: '#6f4b62',
    tertiaryTextColor: '#927287',
    qrDarkColor: '#9d174d',
    qrLightColor: '#fdf2f8',
  },
  {
    id: 'ocean',
    label: '青蓝',
    description: '偏清爽的海盐青蓝，适合顾问与自由职业',
    backgroundColor: '#eef7f6',
    accentColor: '#0f766e',
    useGradient: true,
    primaryTextColor: '#102126',
    secondaryTextColor: '#44636a',
    tertiaryTextColor: '#6c8790',
    qrDarkColor: '#0f766e',
    qrLightColor: '#f0fdfa',
  },
]

const themeMap = new Map(CARD_THEMES.map((theme) => [theme.id, theme] as const))

export const getThemeDefinition = (themeId: CardThemeId) =>
  themeMap.get(themeId === 'custom' ? DEFAULT_THEME_ID : themeId) ?? themeMap.get(DEFAULT_THEME_ID)!

export const getQRCodePalette = (meta: CardMeta) => {
  if (meta.themeId === 'custom') {
    return {
      dark: meta.accentColor,
      light: '#fffaf5',
    }
  }

  const theme = getThemeDefinition(meta.themeId)
  return {
    dark: theme.qrDarkColor,
    light: theme.qrLightColor,
  }
}

const themedElement = (element: CardElement, theme: CardThemeDefinition): CardElement => {
  if (element.type === 'qrcode') {
    return {
      ...element,
      foregroundColor: theme.qrDarkColor,
      backgroundColor: theme.qrLightColor,
    }
  }

  if (element.id === 'role') {
    return { ...element, color: theme.accentColor }
  }

  if (element.id === 'social') {
    return { ...element, color: theme.secondaryTextColor }
  }

  if (element.id === 'address') {
    return { ...element, color: theme.tertiaryTextColor }
  }

  return {
    ...element,
    color: theme.primaryTextColor,
  }
}

export const applyThemeToDocument = (
  document: CardDocument,
  themeId: Exclude<CardThemeId, 'custom'>,
): CardDocument => {
  const theme = getThemeDefinition(themeId)

  return {
    ...document,
    meta: {
      ...document.meta,
      themeId: theme.id,
      backgroundColor: theme.backgroundColor,
      accentColor: theme.accentColor,
      useGradient: theme.useGradient,
    },
    elements: document.elements.map((element) => themedElement(element, theme)),
  }
}
