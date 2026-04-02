// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       host: 'localhost', // or '0.0.0.0' if you access from LAN
//       //host: 'tourapi.pollutech.org.in', // or '0.0.0.0' if you access from LAN
//       '/api': {
//         target: 'http://localhost:8000',  // Laravel port
//         //target: 'https://tourapi.pollutech.org.in',  // Laravel port
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })
//---------------------------------
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        //target: 'https://tourapi.pollutech.org.in',  // Laravel port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
