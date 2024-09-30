import type { Product } from "@/types/product";

export interface Database {
  get(table: string, id: number): Promise<Product | null>;
  list(table: string): Promise<Product[]>;
}
