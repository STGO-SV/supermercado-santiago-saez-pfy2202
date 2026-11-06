import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base:
    command === 'build' || isPreview
      ? '/supermercado-santiago-saez-pfy2202/'
      : '/',
  plugins: [react(), tailwindcss()],
}))
