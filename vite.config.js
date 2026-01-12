import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['mapbox-gl'],
    exclude: ['@mapbox/mapbox-gl-draw']
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})

