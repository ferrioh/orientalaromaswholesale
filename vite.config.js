import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  esbuild: { jsx: 'automatic' },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/oriental-aromas.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/oriental-aromas.[ext]',
      },
    },
  },
});
