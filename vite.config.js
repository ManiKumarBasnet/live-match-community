import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ESPN's public scoreboard API, proxied same-origin so the browser never
// deals with CORS. Accurate, real-time scores/status for the tournament.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
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
