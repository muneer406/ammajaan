import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Browser → localhost/fakestore/* is proxied to fakestoreapi.com so dev/preview
 * avoid CORS. (Direct calls can fail with CORS when the API returns error pages
 * like Cloudflare 523 without Access-Control-Allow-Origin.)
 */
const fakeStoreProxy = {
  "/fakestore": {
    target: "https://fakestoreapi.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/fakestore/, ""),
    secure: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: fakeStoreProxy,
  },
  preview: {
    proxy: fakeStoreProxy,
  },
});
