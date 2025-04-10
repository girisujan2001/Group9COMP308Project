// auth-app/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'authApp',
      filename: 'remoteEntry.js',  // This tells Vite to generate remoteEntry.js
      exposes: {
        './AuthApp': './src/AuthApp.jsx', 
        // any other components you want to expose...
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    port: 5001  // so it serves remoteEntry.js from localhost:5001
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
    outDir: 'dist',
    assetsDir: '',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './src/AuthApp.jsx'
      },
      preserveEntrySignatures: 'exports-only'
    }
  }
})
