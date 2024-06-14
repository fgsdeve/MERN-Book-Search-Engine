import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://https://mern-book-search-engine-2-1cso.onrender.com',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
