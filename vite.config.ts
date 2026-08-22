import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Case-study screens are large full-page exports; the default 500kB warning
    // fires on the image chunk and is just noise here.
    chunkSizeWarningLimit: 900,
  },
})
