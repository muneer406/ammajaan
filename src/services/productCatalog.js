import axios from "axios";
import { parseProductRouteId } from "../utils/productIds";
import { fakeStoreApi } from "./api";

/**
 * DummyJSON (PRD alternative) when Fake Store is down (e.g. HTTP 523).
 * Same-origin `/dummyjson` in the browser — see vite.config.js + vercel.json.
 */
function resolveDummyJsonBaseURL() {
  if (typeof window !== "undefined") {
    return "/dummyjson";
  }
  return "https://dummyjson.com";
}

const dummyJsonApi = axios.create({
  baseURL: resolveDummyJsonBaseURL(),
  timeout: 15000,
});

/** @type {'fakestore' | 'dummyjson' | null} */
let catalogSource = null;

export function resetCatalogSource() {
  catalogSource = null;
}

function shouldFallbackFromFakeStore(err) {
  if (err?.code === "BAD_RESPONSE" || err?.code === "INVALID_PRODUCT_ID") {
    return false;
  }
  const s = err?.response?.status;
  if (s == null) {
    return true;
  }
  if (s === 404) {
    return false;
  }
  if (s === 523 || s === 502 || s === 503 || s === 504) {
    return true;
  }
  if (s >= 500) {
    return true;
  }
  return false;
}

function invalidProductIdError() {
  const err = new Error("Invalid product id");
  err.code = "INVALID_PRODUCT_ID";
  return err;
}

function normalizeFakeStoreProduct(p) {
  if (!p || typeof p !== "object") {
    return null;
  }
  const rating =
    p.rating && typeof p.rating === "object"
      ? p.rating
      : { rate: 0, count: 0 };
  return {
    ...p,
    rating: {
      rate: Number(rating.rate) || 0,
      count: Number(rating.count) || 0,
    },
    image: p.image || "",
    images:
      Array.isArray(p.images) && p.images.length
        ? p.images
        : p.image
          ? [p.image]
          : [],
  };
}

function normalizeDummyJsonProduct(p) {
  if (!p || typeof p !== "object") {
    return null;
  }
  const img =
    p.thumbnail ||
    (Array.isArray(p.images) && p.images[0]) ||
    "";
  return {
    id: p.id,
    title: p.title,
    price: Number(p.price) || 0,
    description: p.description ?? "",
    category: p.category ?? "general",
    image: img,
    images: Array.isArray(p.images) && p.images.length ? p.images : img ? [img] : [],
    rating: {
      rate: typeof p.rating === "number" ? p.rating : 0,
      count: Array.isArray(p.reviews)
        ? p.reviews.length
        : Number(p.stock) || 0,
    },
  };
}

function normalizeCategoryEntry(c) {
  if (typeof c === "string") {
    return c;
  }
  if (c && typeof c === "object" && c.slug != null) {
    return String(c.slug);
  }
  return String(c);
}

function uniqueSortedCategoriesFromProducts(products) {
  const set = new Set();
  for (const p of products) {
    if (p?.category) {
      set.add(p.category);
    }
  }
  return [...set].sort();
}

async function loadFakeStoreCatalog() {
  const { data: products } = await fakeStoreApi.get("/products");
  if (!Array.isArray(products) || products.length === 0) {
    const err = new Error("Unexpected catalog response");
    err.code = "BAD_RESPONSE";
    throw err;
  }

  let categories;
  try {
    const { data: cats } = await fakeStoreApi.get("/products/categories");
    categories = Array.isArray(cats)
      ? cats.map(normalizeCategoryEntry).filter(Boolean)
      : uniqueSortedCategoriesFromProducts(products);
  } catch {
    categories = uniqueSortedCategoriesFromProducts(products);
  }

  catalogSource = "fakestore";
  return {
    products: products.map(normalizeFakeStoreProduct).filter(Boolean),
    categories,
  };
}

async function loadDummyJsonCatalog() {
  const { data } = await dummyJsonApi.get("/products?limit=0");
  const raw = data?.products;
  if (!Array.isArray(raw) || raw.length === 0) {
    const err = new Error("Unexpected catalog response");
    err.code = "BAD_RESPONSE";
    throw err;
  }

  const products = raw.map(normalizeDummyJsonProduct).filter(Boolean);

  let categories;
  try {
    const { data: catData } = await dummyJsonApi.get("/products/category-list");
    categories = Array.isArray(catData)
      ? catData
        .map((x) => (typeof x === "string" ? x : x?.slug))
        .filter(Boolean)
      : uniqueSortedCategoriesFromProducts(products);
  } catch {
    categories = uniqueSortedCategoriesFromProducts(products);
  }

  catalogSource = "dummyjson";
  return { products, categories };
}

/**
 * Single coordinated fetch — avoids races between parallel Fake Store calls.
 */
export async function getCatalog() {
  if (catalogSource === "dummyjson") {
    return loadDummyJsonCatalog();
  }
  if (catalogSource === "fakestore") {
    try {
      return await loadFakeStoreCatalog();
    } catch (e) {
      if (!shouldFallbackFromFakeStore(e)) {
        throw e;
      }
      catalogSource = "dummyjson";
      return loadDummyJsonCatalog();
    }
  }

  try {
    return await loadFakeStoreCatalog();
  } catch (e) {
    if (!shouldFallbackFromFakeStore(e)) {
      throw e;
    }
    return loadDummyJsonCatalog();
  }
}

export async function getProductById(id) {
  const numericId = parseProductRouteId(id);
  if (numericId == null) {
    throw invalidProductIdError();
  }

  if (catalogSource === "dummyjson") {
    const { data } = await dummyJsonApi.get(`/products/${numericId}`);
    if (data == null || typeof data !== "object") {
      const err = new Error("Unexpected product response");
      err.code = "BAD_RESPONSE";
      throw err;
    }
    return normalizeDummyJsonProduct(data);
  }

  if (catalogSource === "fakestore") {
    try {
      const { data } = await fakeStoreApi.get(`/products/${numericId}`);
      if (data == null || typeof data !== "object") {
        const err = new Error("Unexpected product response");
        err.code = "BAD_RESPONSE";
        throw err;
      }
      return normalizeFakeStoreProduct(data);
    } catch (e) {
      if (e?.response?.status === 404) {
        throw e;
      }
      if (!shouldFallbackFromFakeStore(e)) {
        throw e;
      }
      catalogSource = "dummyjson";
      const { data } = await dummyJsonApi.get(`/products/${numericId}`);
      if (data == null || typeof data !== "object") {
        const err = new Error("Unexpected product response");
        err.code = "BAD_RESPONSE";
        throw err;
      }
      return normalizeDummyJsonProduct(data);
    }
  }

  try {
    const { data } = await fakeStoreApi.get(`/products/${numericId}`);
    if (data == null || typeof data !== "object") {
      const err = new Error("Unexpected product response");
      err.code = "BAD_RESPONSE";
      throw err;
    }
    catalogSource = "fakestore";
    return normalizeFakeStoreProduct(data);
  } catch (e) {
    if (e?.response?.status === 404) {
      throw e;
    }
    if (!shouldFallbackFromFakeStore(e)) {
      throw e;
    }
    catalogSource = "dummyjson";
    const { data } = await dummyJsonApi.get(`/products/${numericId}`);
    if (data == null || typeof data !== "object") {
      const err = new Error("Unexpected product response");
      err.code = "BAD_RESPONSE";
      throw err;
    }
    return normalizeDummyJsonProduct(data);
  }
}
