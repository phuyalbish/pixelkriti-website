import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from 'vite-plugin-remove-console'
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    removeConsole()
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
   build: {
    sourcemap: true, 
  },

  server: {
    host: "0.0.0.0",
    port: 5171,
  },
});

