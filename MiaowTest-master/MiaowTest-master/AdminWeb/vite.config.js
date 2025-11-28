import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 移除冲突的 vueDevTools 插件（适配 Vite 5 版本）
// import vueDevTools from 'vite-plugin-vue-devtools'
// 移除 escconfig 导入（避免变量解析异常，直接写死代理地址更稳定）
// import escconfig from './src/config/esc.config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 注释掉冲突的插件调用
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    proxy: {
      '/adminapi': {
        // 直接写死后端地址（适配之前启动的后端服务），避免配置文件干扰
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      }
    }
  },
})
