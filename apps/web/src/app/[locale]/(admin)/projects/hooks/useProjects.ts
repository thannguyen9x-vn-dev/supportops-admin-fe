"use client";

import { useCallback, useEffect, useState } from "react";

import { productService } from "@/features/products/services/product.service";

import type { LoadState, Product, ProductDraft } from "../projects.types";
import {
  mapContractProductToProject,
  mapDraftToCreateRequest,
  mapDraftToUpdateRequest,
  mapListItemToProject
} from "../projects.mapper";

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
      const { data: response } = await productService.list({
        page: 1,
        size: 100
      });

      const mapped = response.map((item) => mapListItemToProject(item));
      setData(mapped);
      setLoadState(mapped.length > 0 ? "ready" : "empty");
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
      if (productId) {
        const { data: updated } = await productService.update(productId, mapDraftToUpdateRequest(draft));
        const savedProduct = mapContractProductToProject(updated);

        setData((prev) => prev.map((item) => (item.id === productId ? savedProduct : item)));
        setLoadState("ready");
        return savedProduct;
      }

      const { data: created } = await productService.create(mapDraftToCreateRequest(draft));
      const savedProduct = mapContractProductToProject(created);

      setData((prev) => [savedProduct, ...prev]);
      setLoadState("ready");
      return savedProduct;
    },
    [],
  );

  const removeProducts = useCallback(async (productIds: string[]) => {
    if (productIds.length === 1) {
      const [singleId] = productIds;
      if (singleId) {
        await productService.delete(singleId);
      }
    } else {
      await productService.bulkDelete(productIds);
    }

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
