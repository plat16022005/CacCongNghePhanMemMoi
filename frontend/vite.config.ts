import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: '../src/public',
    emptyOutDir: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:6969',
        changeOrigin: true,
      }
    }
  }
})
