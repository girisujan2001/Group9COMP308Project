import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'community-app',
      filename: 'remoteEntry.js',
      exposes: {
        './CommunityApp': './src/CommunityApp.jsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client']
    })
  ],
  server: {
    port: 5002,
    proxy: {
      '/graphql': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    outDir: 'dist',
    assetsDir: '',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: './src/CommunityApp.jsx'
      },
      preserveEntrySignatures: 'exports-only'
    }
  }
});