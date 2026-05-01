import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        // Correct function syntax for manualChunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    origin: 'http://localhost:5173',
    cors: true,
    proxy: {
      // Proxy Django backend routes so OAuth redirects work in dev
      '/accounts': 'http://localhost:8000',
      '/account':  'http://localhost:8000',
      '/api':      'http://localhost:8000',
      '/admin':    'http://localhost:8000',
      // OAuth callback page stays on Vite (/oauth-callback is a React route)
    },
  }
})
