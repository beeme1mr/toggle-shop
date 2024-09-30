import { randomInt } from "crypto";
import { Database } from "./types";
import { BaseDb } from "./db-base";
import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { Product } from "@/types/product";

/**
 * Pretends to be a local sqlite-based database.
 * Latency is low, but concurrent access is impossible.
 */
export class SqliteDb extends BaseDb implements Database {
  private _lock = new Mutex();
  private _tracer = trace.getTracer("sqlite-db");

  // reads have latency between 5 and 20 ms
  async get(table: string, id: number): Promise<Product | null> {
    const span = this.startSpan(
      `SELECT toggleshop-db.${table}`,
      table,
      `SELECT * FROM ${table} WHERE User = '${id}'`
    );
    return this._lock.runExclusive(async () => {
      return new Promise<Product | null>((resolve, reject) => {
        setTimeout(() => {
          try {
            return resolve(this._get(table, id));
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            });
            reject(e);
          } finally {
            span.end();
          }
        }, randomInt(5, 20));
      });
    });
  }

  async list(table: string): Promise<Product[]> {
    const span = this.startSpan(
      `SELECT toggleshop-db.${table}`,
      table,
      `SELECT * FROM ${table}`
    );
    return this._lock.runExclusive(async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            return resolve(this._list(table));
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            span.recordException(err);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            });
            reject(e);
          } finally {
            span.end();
          }
        }, randomInt(10, 30));
      });
    });
  }

  private startSpan(spanName: string, table: string, statement?: string) {
    const span = this._tracer.startSpan(spanName, {
      kind: SpanKind.CLIENT,
      attributes: {
        "db.connection_string": `Server=Sqlite\v3.45`,
        "db.name": "toggleshop-db",
        "db.statement": statement ?? spanName,
        "db.operation": "SELECT",
        "db.collection.name": "products",
        "db.table": table,
        "db.system": "sqlite",
      },
    });
    return span;
  }
}

type ReleaseFunction = () => void;

class Mutex {
  private _queue: {
    resolve: (release: ReleaseFunction) => void;
  }[] = [];
  private _locked = false;

  acquire() {
    return new Promise<ReleaseFunction>((resolve) => {
      this._queue.push({ resolve });
      this._dispatch();
    });
  }

  async runExclusive<T>(callback: () => Promise<T>) {
    const release = await this.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }

  private _dispatch() {
    if (this._locked) {
      // resource is locked
      // wait until the next cycle
      return;
    }

    const next = this._queue.shift();
    if (!next) {
      // queue is empty. no jobs waiting
      return;
    }

    this._locked = true;
    next.resolve(this._makeReleaseFn());
  }

  private _makeReleaseFn(): ReleaseFunction {
    return () => {
      // Each release function make
      // the resource available again
      this._locked = false;
      // and call dispatch.
      this._dispatch();
    };
  }
}
