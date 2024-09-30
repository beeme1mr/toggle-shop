import { Client } from "@openfeature/server-sdk";
import { Database } from "./types";
import { PostgresDb } from "./postgres-db";
import { SqliteDb } from "./sqlite-db";
import { products } from "./seed";

export type { Database };

const postgres = new PostgresDb({ products });
const sqlite = new SqliteDb({ products });

export async function getConnection(flagsClient: Client): Promise<Database> {
  const useDistributed = await flagsClient.getBooleanValue(
    "use-distributed-db",
    false
  );

  return useDistributed ? postgres : sqlite;
}
