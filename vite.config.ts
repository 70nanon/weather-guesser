import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages でサブパス配信するため base を固定する。
// 公開 URL: https://70nanon.github.io/weather-guesser/
export default defineConfig({
  base: '/weather-guesser/',
  plugins: [react()],
})
