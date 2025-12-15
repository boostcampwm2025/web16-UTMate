import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MySDK',
      // the proper extensions will be added
      fileName: 'my-sdk',
      formats: ['es', 'umd', 'iife'],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
