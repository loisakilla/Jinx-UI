import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@jinx-ui\/react\/runtime$/, replacement: resolve(__dirname, 'packages/react/src/runtime.ts') },
      { find: /^@jinx-ui\/react$/, replacement: resolve(__dirname, 'packages/react/src/index.ts') }
    ]
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html')
      }
    }
  }
});
