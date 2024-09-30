import { OpenFeature } from "@openfeature/server-sdk";
import { Database } from "./types";
import type { Product } from "@/types/product";

/**
 * Pretends to be a distributed database.
 * Latency is not as good as local files, but concurrent access is unrestrained.
 */
export abstract class BaseDb implements Database {
  protected _data = new Map<string, Map<number, Product>>();
  protected _featureFlagClient = OpenFeature.getClient();

  constructor(seedData: { products: Product[] }) {
    for (const table of Object.getOwnPropertyNames(seedData)) {
      if (!this._data.has(table)) this._data.set(table, new Map());
      for (const product of seedData.products) {
        this._data.get(table)?.set(product.id, product);
      }
    }
  }

  abstract get(table: string, id: number): Promise<Product | null>;
  abstract list(table: string): Promise<Product[]>;

  protected _get(table: string, id: number): Product | null {
    const tableData = this._data.get(table);
    if (tableData == null) {
      throw new Error(`Table not found - ${table}`);
    }
    return tableData.get(id) ?? null;
  }

  protected _list(table: string): Product[] {
    const tableData = this._data.get(table);
    if (tableData == null) {
      throw new Error(`Table not found - ${table}`);
    }
    return Array.from(tableData.values());
  }
}
