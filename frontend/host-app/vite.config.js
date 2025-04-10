// host-app/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'hostApp',
      remotes: {
        authApp: 'http://localhost:5001/dist/remoteEntry.js',
        communityApp: 'http://localhost:5002/dist/remoteEntry.js'
      },
      shared: [
        'react', 'react-dom', 'react-router-dom', 
        '@apollo/client', '@apollo/client/link/context', '@apollo/client/link/error'
      ]
    })
  ],
  server: {
    port: 5000
  }
})
