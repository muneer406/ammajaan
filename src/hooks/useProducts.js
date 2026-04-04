import { useCallback, useEffect, useState } from "react";
import {
  getCatalog,
  resetCatalogSource,
} from "../services/productCatalog";
import { getRequestErrorMessage } from "../utils/errors";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      resetCatalogSource();
      const { products: list, categories: cats } = await getCatalog();
      setProducts(list);
      setCategories(cats);
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
