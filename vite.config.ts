// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //host: 'localhost', // or '0.0.0.0' if you access from LAN
      host: 'tourapi.pollutech.org.in', // or '0.0.0.0' if you access from LAN
      '/api': {
        //target: 'http://127.0.0.1:8000',  // Laravel port
        target: 'http://tourapi.pollutech.org.in',  // Laravel port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
