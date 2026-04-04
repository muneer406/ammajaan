import { useCallback, useEffect, useState } from "react";
import { getCategories, getProducts } from "../services/api";
import { getRequestErrorMessage } from "../utils/errors";

function uniqueSortedCategories(products) {
  const set = new Set();
  for (const p of products) {
    if (p?.category) set.add(p.category);
  }
  return [...set].sort();
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const [productsResult, categoriesResult] = await Promise.allSettled([
        getProducts(),
        getCategories(),
      ]);

      if (productsResult.status === "rejected") {
        setProducts([]);
        setCategories([]);
        setError(
          getRequestErrorMessage(
            productsResult.reason,
            "Failed to load products. Please try again.",
          ),
        );
        return;
      }

      const list = productsResult.value;
      setProducts(list);

      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value);
      } else {
        setCategories(uniqueSortedCategories(list));
      }
    } catch (err) {
      setProducts([]);
      setCategories([]);
      setError(
        getRequestErrorMessage(
          err,
          "Failed to load products. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    categories,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
