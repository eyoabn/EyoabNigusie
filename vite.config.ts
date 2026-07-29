import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(rootDir, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Split the heavy, rarely-changing libraries out of the main bundle so a
    // content edit doesn't invalidate the whole cached chunk for returning visitors.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          motion: ['motion/react'],
        },
      },
    },
  },

  // Vite's dev server already falls back to index.html for unknown paths,
  // so BrowserRouter routes like /admin work on refresh with no extra config.
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
})
