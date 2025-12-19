import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['cmc.john-land.com','www.cmc.john-land.com'],
    port: 3000,
    strictPort: true
  }
})
