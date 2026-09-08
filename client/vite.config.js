import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['three', '@react-three/fiber', '@react-three/drei'],
    alias: {
      // force single three instance — stats-gl pulls three@0.170 otherwise warns Multiple instances
      'three': path.resolve('./node_modules/three'),
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
  server: {
    watch: {
      ignored: ['**/still_human.glb', '**/*.glb']
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
