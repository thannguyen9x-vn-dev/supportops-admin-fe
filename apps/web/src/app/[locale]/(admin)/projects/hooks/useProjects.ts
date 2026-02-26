"use client";

import { useCallback, useEffect, useState } from "react";

import { mockDeleteProducts, mockFetchProducts, mockSaveProduct } from "../projects.mock";
import type { LoadState, Product, ProductDraft } from "../projects.types";

type UseProjectsReturn = {
  data: Product[];
  loadState: LoadState;
  reload: () => Promise<void>;
  removeProducts: (productIds: string[]) => Promise<void>;
  saveProduct: (draft: ProductDraft, productId?: string) => Promise<Product>;
};

export function useProjects(): UseProjectsReturn {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<Product[]>([]);

  const reload = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await mockFetchProducts();
      setData(response);
      setLoadState(response.length > 0 ? "ready" : "empty");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void reload();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [reload]);

  const saveProduct = useCallback(
    async (draft: ProductDraft, productId?: string) => {
      const savedProduct = await mockSaveProduct(draft, productId);

      setData((prev) => {
        if (productId) {
          return prev.map((item) => (item.id === productId ? savedProduct : item));
        }

        return [savedProduct, ...prev];
      });

      setLoadState("ready");
      return savedProduct;
    },
    [],
  );

  const removeProducts = useCallback(async (productIds: string[]) => {
    await mockDeleteProducts(productIds);
    const deleteSet = new Set(productIds);

    setData((prev) => {
      const next = prev.filter((item) => !deleteSet.has(item.id));
      if (next.length === 0) {
        setLoadState("empty");
      }

      return next;
    });
  }, []);

  return { data, loadState, reload, removeProducts, saveProduct };
}
