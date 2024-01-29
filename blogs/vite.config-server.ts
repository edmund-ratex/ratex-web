import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import {VitePluginNode} from 'vite-plugin-node';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3006,
  },
  plugins: [
    solidPlugin({
      solid: {
        generate: 'ssr',
        hydratable: true,
      },
    }),
    ...VitePluginNode({
      adapter: 'express',
      appPath: './entry-server.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'esbuild',
    }),
  ],
  build: {
    outDir: 'dist/server',
    ssr: true,
    manifest: false,
    target: 'esnext',
    minify: true,
    rollupOptions: {
      input: 'entry-server.ts',
      output: {
        entryFileNames: 'index.mjs',
        chunkFileNames: 'template-[hash].mjs',
      },
    },
  },
});
