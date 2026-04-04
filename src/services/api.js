import axios from "axios";

/**
 * Fake Store API (primary). Browser uses same-origin `/fakestore` — proxied by
 * Vite (dev) and Vercel (`vercel.json`). Node uses the public URL.
 */
function resolveFakeStoreBaseURL() {
  if (typeof window !== "undefined") {
    return "/fakestore";
  }
  return "https://fakestoreapi.com";
}

export const fakeStoreApi = axios.create({
  baseURL: resolveFakeStoreBaseURL(),
  timeout: 10000,
});
