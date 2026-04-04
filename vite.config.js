import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Same-origin proxies so the browser never hits third-party CORS.
 * - /fakestore → fakestoreapi.com
 * - /dummyjson → dummyjson.com (fallback when Fake Store is unavailable, e.g. 523)
 */
const devProxy = {
  "/fakestore": {
    target: "https://fakestoreapi.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/fakestore/, ""),
    secure: true,
  },
  "/dummyjson": {
    target: "https://dummyjson.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/dummyjson/, ""),
    secure: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: devProxy,
  },
  preview: {
    proxy: devProxy,
  },
});
