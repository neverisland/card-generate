import { DEFAULT_THEME_ID, getThemeDefinition } from './themes'
import type { CardDocument, CardElement, CardMeta, CardOrientation } from './types'

export const CARD_PRESETS: Record<CardOrientation, { width: number; height: number }> = {
  landscape: { width: 960, height: 540 },
  portrait: { width: 540, height: 960 },
}

export const CURRENT_LAYOUT_VERSION = 4

const baseTheme = getThemeDefinition(DEFAULT_THEME_ID)

const createMeta = (orientation: CardOrientation): CardMeta => ({
  orientation,
  width: CARD_PRESETS[orientation].width,
  height: CARD_PRESETS[orientation].height,
  backgroundColor: baseTheme.backgroundColor,
  accentColor: baseTheme.accentColor,
  useGradient: baseTheme.useGradient,
  cornerRadius: 32,
  padding: 36,
  showFieldLabels: false,
  layoutVersion: CURRENT_LAYOUT_VERSION,
  themeId: DEFAULT_THEME_ID,
})

const createElements = (orientation: CardOrientation): CardElement[] => {
  if (orientation === 'portrait') {
    return [
      { id: 'fullName', label: '姓名', type: 'text', contentKey: 'fullName', placeholder: '你的名字', x: 64, y: 96, width: 348, height: 112, rotation: 0, zIndex: 0, visible: true, locked: false, fontSize: 56, fontFamily: 'Space Grotesk', fontWeight: 700, color: baseTheme.primaryTextColor, align: 'left', letterSpacing: -0.7 },
      { id: 'role', label: '职位', type: 'text', contentKey: 'role', placeholder: 'Creative Technologist', x: 68, y: 238, width: 306, height: 26, rotation: 0, zIndex: 1, visible: true, locked: false, fontSize: 17, fontFamily: 'Manrope', fontWeight: 700, color: baseTheme.accentColor, align: 'left', letterSpacing: 1.4, uppercase: true },
      { id: 'phone', label: '手机号', type: 'text', contentKey: 'phone', placeholder: '+86 138 0000 0000', x: 68, y: 346, width: 304, height: 24, rotation: 0, zIndex: 2, visible: true, locked: false, fontSize: 18, fontFamily: 'Manrope', fontWeight: 700, color: baseTheme.primaryTextColor, align: 'left', letterSpacing: 0 },
      { id: 'email', label: '邮箱', type: 'text', contentKey: 'email', placeholder: 'mail@domain.com', x: 68, y: 384, width: 344, height: 52, rotation: 0, zIndex: 3, visible: true, locked: false, fontSize: 16, fontFamily: 'Manrope', fontWeight: 600, color: baseTheme.primaryTextColor, align: 'left', letterSpacing: 0 },
      { id: 'social', label: '社交账号', type: 'text', contentKey: 'social', placeholder: '@yourhandle', x: 68, y: 458, width: 252, height: 24, rotation: 0, zIndex: 4, visible: false, locked: false, fontSize: 15, fontFamily: 'Manrope', fontWeight: 600, color: baseTheme.secondaryTextColor, align: 'left', letterSpacing: 0 },
      { id: 'address', label: '地址', type: 'text', contentKey: 'address', placeholder: 'Shanghai / Remote', x: 68, y: 492, width: 306, height: 40, rotation: 0, zIndex: 5, visible: false, locked: false, fontSize: 15, fontFamily: 'Manrope', fontWeight: 600, color: baseTheme.tertiaryTextColor, align: 'left', letterSpacing: 0 },
      { id: 'qrcode', label: '二维码', type: 'qrcode', contentKey: 'qrText', x: 126, y: 612, width: 288, height: 288, rotation: 0, zIndex: 6, visible: true, locked: false, foregroundColor: baseTheme.qrDarkColor, backgroundColor: baseTheme.qrLightColor },
    ]
  }

  return [
    { id: 'fullName', label: '姓名', type: 'text', contentKey: 'fullName', placeholder: '你的名字', x: 84, y: 84, width: 468, height: 116, rotation: 0, zIndex: 0, visible: true, locked: false, fontSize: 66, fontFamily: 'Space Grotesk', fontWeight: 700, color: baseTheme.primaryTextColor, align: 'left', letterSpacing: -0.8 },
    { id: 'role', label: '职位', type: 'text', contentKey: 'role', placeholder: 'Creative Technologist', x: 88, y: 220, width: 320, height: 22, rotation: 0, zIndex: 1, visible: true, locked: false, fontSize: 16, fontFamily: 'Manrope', fontWeight: 700, color: baseTheme.accentColor, align: 'left', letterSpacing: 1.6, uppercase: true },
    { id: 'phone', label: '手机号', type: 'text', contentKey: 'phone', placeholder: '+86 138 0000 0000', x: 88, y: 334, width: 252, height: 24, rotation: 0, zIndex: 2, visible: true, locked: false, fontSize: 18, fontFamily: 'Manrope', fontWeight: 700, color: baseTheme.primaryTextColor, align: 'left', letterSpacing: 0 },
    { id: 'email', label: '邮箱', type: 'text', contentKey: 'email', placeholder: 'mail@domain.com', x: 88, y: 370, width: 388, height: 46, rotation: 0, zIndex: 3, visible: true, locked: false, fontSize: 17, fontFamily: 'Manrope', fontWeight: 600, color: baseTheme.primaryTextColor, align: 'left', letterSpacing: 0 },
    { id: 'social', label: '社交账号', type: 'text', contentKey: 'social', placeholder: '@yourhandle', x: 88, y: 446, width: 236, height: 24, rotation: 0, zIndex: 4, visible: true, locked: false, fontSize: 15, fontFamily: 'Manrope', fontWeight: 600, color: baseTheme.secondaryTextColor, align: 'left', letterSpacing: 0 },
    { id: 'address', label: '地址', type: 'text', contentKey: 'address', placeholder: 'Shanghai / Remote', x: 352, y: 446, width: 258, height: 40, rotation: 0, zIndex: 5, visible: true, locked: false, fontSize: 15, fontFamily: 'Manrope', fontWeight: 600, color: baseTheme.tertiaryTextColor, align: 'left', letterSpacing: 0 },
    { id: 'qrcode', label: '二维码', type: 'qrcode', contentKey: 'qrText', x: 674, y: 116, width: 208, height: 208, rotation: 0, zIndex: 6, visible: true, locked: false, foregroundColor: baseTheme.qrDarkColor, backgroundColor: baseTheme.qrLightColor },
  ]
}

export const createDefaultDocument = (orientation: CardOrientation = 'landscape'): CardDocument => ({
  meta: createMeta(orientation),
  content: {
    fullName: 'Alex Chen',
    role: 'Creative Technologist',
    phone: '+86 138 0000 0000',
    email: 'hello@alexchen.studio',
    address: 'Shanghai / Remote',
    social: '@alexcodesdesign',
    qrText: 'https://alexchen.studio',
  },
  assets: {},
  elements: createElements(orientation),
})
