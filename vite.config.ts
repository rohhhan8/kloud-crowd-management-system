import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    rolldownOptions: {
      output: {
        // Stable vendor chunks: app code changes do not invalidate cached libraries.
        advancedChunks: {
          groups: [
            { name: 'vendor-react', test: /node_modules[/](react|react-dom|scheduler)[/]/ },
            { name: 'vendor-router', test: /node_modules[/](react-router|@remix-run)[/]/ },
            { name: 'vendor-tanstack', test: /node_modules[/]@tanstack[/]/ },
            { name: 'vendor-radix', test: /node_modules[/](@radix-ui|radix-ui|@floating-ui)[/]/ },
            {
              name: 'vendor-socket',
              test: /node_modules[/](socket\.io-[^/]+|engine\.io-[^/]+|@socket\.io)[/]/,
            },
          ],
        },
      },
    },
  },
})
