import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      '6e49-2405-4803-f4fe-ce10-ac85-a413-b18a-4cd8.ngrok-free.app', // Thêm tên miền ngrok ở đây
    ],
  },
  build: {
    outDir: 'dist'
  },
  base: '/'
})
