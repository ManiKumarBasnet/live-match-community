import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ESPN's public scoreboard API, proxied same-origin so the browser never
// deals with CORS. Accurate, real-time scores/status for the tournament.
const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    fs: {
      allow: [root],
    },
    proxy: {
      "/api/espn": {
        target: "https://site.api.espn.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/espn/, ""),
      },
    },
  },
});
