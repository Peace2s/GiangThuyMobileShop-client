import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'https://giangthuymobile-server-production.up.railway.app', // Thêm tên miền ngrok ở đây
    ],
  },
  build: {
    outDir: 'dist'
  },
  base: '/'
})
