import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chatSimulator: resolve(__dirname, 'chat-simulator/index.html'),
      },
    },
  },
});
