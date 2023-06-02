import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const baseUrl = process.env.NODE_ENV === 'production' ? '/hifz-competition/' : './';

// https://vitejs.dev/config/
export default defineConfig({
  base: baseUrl,
  plugins: [vue(), vueJsx()],
  build: {
    minify: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL(baseUrl + 'src', import.meta.url))
    }
  }
})
