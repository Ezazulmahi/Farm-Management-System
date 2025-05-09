import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      events: 'events-browserify',
      buffer: 'buffer',
      util: 'util',
    },
  },
  define: {
    'process.env': {},
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Replace with your backend URL
    },
  },
});


