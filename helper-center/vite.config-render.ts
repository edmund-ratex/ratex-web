import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import {buildId} from './package.json';

export default defineConfig({
  publicDir: false,
  base: `https://static.rubydex.com/${buildId}/`,
  plugins: [
    solidPlugin({
      solid: {
        generate: 'ssr',
        hydratable: true,
      },
    }),
  ],
  ssr: {
    format: 'esm',
  },
  build: {
    outDir: 'dist/render',
    ssr: true,
    manifest: false,
    target: 'esnext',
    minify: true,
    rollupOptions: {
      input: 'entry-render.ts',
      output: {
        entryFileNames: 'index.mjs',
        chunkFileNames: 'template-[hash].mjs',
      },
    },
  },
});
