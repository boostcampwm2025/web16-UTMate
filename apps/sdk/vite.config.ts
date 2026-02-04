import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// 환경변수에 따라 빌드 타켓을 구분하고
// 두번 빌드함
const isRecorderBuild = process.env.BUILD_TARGET === 'recorder';

export default defineConfig({
  build: {
    emptyOutDir: !isRecorderBuild, // 첫 번째 빌드에서만 dist 폴더 비우기
    lib: {
      entry: resolve(__dirname, isRecorderBuild ? 'src/recorder.ts' : 'src/index.ts'),
      name: isRecorderBuild ? 'UTMateRecorder' : 'UtmateSDK',
      fileName: () => (isRecorderBuild ? 'utmate-recorder.iife.js' : 'utmate-sdk.iife.js'),
      formats: ['umd'],
    },
  },
  plugins: isRecorderBuild ? [] : [dts({ rollupTypes: true })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/integration/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
