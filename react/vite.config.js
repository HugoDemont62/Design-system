import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nodeModules = path.resolve(__dirname, 'node_modules')

export default defineConfig({
  root: path.resolve(__dirname, '..'),
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'react/jsx-dev-runtime', replacement: path.join(nodeModules, 'react', 'jsx-dev-runtime.js') },
      { find: 'react/jsx-runtime',     replacement: path.join(nodeModules, 'react', 'jsx-runtime.js') },
      { find: 'react-dom/client',      replacement: path.join(nodeModules, 'react-dom', 'client.js') },
      { find: 'react-dom',             replacement: path.join(nodeModules, 'react-dom') },
      { find: 'react',                 replacement: path.join(nodeModules, 'react') },
      { find: 'scheduler',             replacement: path.join(nodeModules, 'scheduler') },
    ]
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  server: {
    open: '/react/'
  }
})
