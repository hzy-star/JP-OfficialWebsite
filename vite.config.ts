import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 可保留或去掉这一行。如果你遇到 sass 版本不兼容问题，可先删掉它。
        // api: 'modern-compiler'
      }
    }
  },
  server: {
    port: 3000
  }
});