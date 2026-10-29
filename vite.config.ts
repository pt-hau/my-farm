import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the build works both at a domain root
  // (example.com/) and under a subpath (example.com/vuon-nha-be/).
  base: './',
  plugins: [react()],
})
