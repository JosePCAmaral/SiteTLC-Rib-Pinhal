import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH é definido no deploy do GitHub Pages (/SiteTLC-Rib-Pinhal/).
// Localmente e em domínio próprio, fica "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
