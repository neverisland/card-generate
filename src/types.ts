export type CardOrientation = 'landscape' | 'portrait'
export type ExportFormat = 'png' | 'jpeg'
export type CardElementType = 'text' | 'qrcode'
export type TextAlign = 'left' | 'center' | 'right'
export type CardThemeId = 'warm' | 'slate' | 'forest' | 'berry' | 'ocean' | 'custom'

export type TextContentKey =
  | 'fullName'
  | 'role'
  | 'phone'
  | 'email'
  | 'address'
  | 'social'
  | 'qrText'

export interface CardMeta {
  orientation: CardOrientation
  width: number
  height: number
  backgroundColor: string
  accentColor: string
  useGradient: boolean
  cornerRadius: number
  padding: number
  showFieldLabels: boolean
  layoutVersion: number
  themeId: CardThemeId
}

export interface CardContent {
  fullName: string
  role: string
  phone: string
  email: string
  address: string
  social: string
  qrText: string
}

export interface CardAssets {}

export interface BaseElement {
  id: string
  label: string
  type: CardElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  visible: boolean
  locked: boolean
}

export interface TextElement extends BaseElement {
  type: 'text'
  contentKey: TextContentKey
  placeholder: string
  fontSize: number
  fontFamily: string
  fontWeight: number
  color: string
  align: TextAlign
  letterSpacing: number
  uppercase?: boolean
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode'
  contentKey: 'qrText'
  foregroundColor: string
  backgroundColor: string
}

export type CardElement = TextElement | QRCodeElement

export interface CardDocument {
  meta: CardMeta
  content: CardContent
  assets: CardAssets
  elements: CardElement[]
}
