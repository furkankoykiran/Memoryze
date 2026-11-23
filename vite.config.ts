import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages repo name for base path
  base: '/Memoryze/',
  build: {
    rollupOptions: {
      output: {
        // Keep the large, rarely-changing vendors in their own cacheable chunks
        // so an app-only change does not invalidate all of them.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
