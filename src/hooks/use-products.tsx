"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";
import { tanstackMetaToHeader } from "@/libs/open-feature/evaluation-context";

export function useProducts() {
  console.log("fetching products");
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: async ({ meta }): Promise<Product[]> => {
      const res = await fetch("http://localhost:3000/api/products", {
        cache: "no-store",
        headers: tanstackMetaToHeader(meta),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });
  return data;
}

export function useProduct(id: string) {
  console.log("fetching products");
  const { data } = useSuspenseQuery({
    queryKey: ["products", id],
    queryFn: async ({ meta }): Promise<Product> => {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        cache: "no-store",
        headers: tanstackMetaToHeader(meta),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });
  return data;
}
