import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UtmateSDK',
      // the proper extensions will be added
      fileName: 'utmate-sdk',
      formats: ['iife'],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
