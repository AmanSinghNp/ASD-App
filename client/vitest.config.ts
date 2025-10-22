import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results.xml'
    },
    // Add this to handle React components properly
    server: {
      deps: {
        inline: ['@testing-library/jest-dom']
      }
    }
  },
})
