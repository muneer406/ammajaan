import axios from "axios";
import { parseProductRouteId } from "../utils/productIds";

/**
 * Same-origin `/fakestore` avoids CORS: the browser only hits your origin.
 * - Local: Vite proxies `/fakestore` → fakestoreapi.com (vite.config.js).
 * - Vercel: `vercel.json` rewrites `/fakestore/*` → fakestoreapi.com.
 * Node/tests (no window): call the API URL directly.
 */
function resolveApiBaseURL() {
  if (typeof window !== "undefined") {
    return "/fakestore";
  }
  return "https://fakestoreapi.com";
}

export const api = axios.create({
  baseURL: resolveApiBaseURL(),
  timeout: 10000,
});

function invalidProductIdError() {
  const err = new Error("Invalid product id");
  err.code = "INVALID_PRODUCT_ID";
  return err;
}

export async function getProducts() {
  const { data } = await api.get("/products");
  if (!Array.isArray(data)) {
    const err = new Error("Unexpected catalog response");
    err.code = "BAD_RESPONSE";
    throw err;
  }
  return data;
}

export async function getProductById(id) {
  const numericId = parseProductRouteId(id);
  if (numericId == null) {
    throw invalidProductIdError();
  }

  const { data } = await api.get(`/products/${numericId}`);
  if (data == null || typeof data !== "object") {
    const err = new Error("Unexpected product response");
    err.code = "BAD_RESPONSE";
    throw err;
  }
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  if (!Array.isArray(data)) {
    const err = new Error("Unexpected categories response");
    err.code = "BAD_RESPONSE";
    throw err;
  }
  return data;
}
