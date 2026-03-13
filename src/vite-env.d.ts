/// <reference types="vite/client" />

declare module 'qrcode' {
  interface QRCodeColor {
    dark?: string
    light?: string
  }

  interface QRCodeOptions {
    margin?: number
    width?: number
    color?: QRCodeColor
  }

  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>

  const QRCode: {
    toDataURL: typeof toDataURL
  }

  export default QRCode
}
