"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";

export function useProducts() {
  console.log("fetching products");
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("http://localhost:3000/api/products", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });
  return data;
}
