import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const hasSegment = (id: string, segment: string) => id.indexOf(segment) !== -1

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (hasSegment(id, 'react-konva') || hasSegment(id, '/konva/') || hasSegment(id, '\\konva\\')) {
            return 'canvas-vendor'
          }

          if (hasSegment(id, '/qrcode/') || hasSegment(id, '\\qrcode\\')) {
            return 'qr-vendor'
          }

          if (
            hasSegment(id, '/react/') ||
            hasSegment(id, '\\react\\') ||
            hasSegment(id, '/react-dom/') ||
            hasSegment(id, '\\react-dom\\')
          ) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
