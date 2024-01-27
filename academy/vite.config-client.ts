/// <reference types="vitest" />
/// <reference types="vite/client" />

import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import {buildId} from './package.json';

const viteEnv = process.env['VIET_ENV'];
const DEV = process.env['DEV'];

export default defineConfig({
  publicDir: DEV ? '../../public' : false,
  base: DEV ? undefined : `https://static.rubydex.com/${buildId}/`,
  plugins: [
    solidPlugin({
      solid: {
        generate: 'dom',
        hydratable: true,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3003,
  },
  ssr: {
    format: 'esm',
  },
  build: {
    outDir: 'dist/client',
    ssr: viteEnv === 'server',
    manifest: 'client-manifest.json',
    target: 'esnext',
    minify: true,
    rollupOptions: {
      input: 'entry-client-prod.ts',
      output: {
        entryFileNames: 'js/main-[hash].js',
        chunkFileNames: 'js/chunk-[hash].js',
      },
    },
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    setupFiles: './setupVitest.ts',
    threads: false,
    isolate: false,
  },
});
