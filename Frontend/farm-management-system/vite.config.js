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
});


