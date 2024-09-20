import { FlagdCore } from "@openfeature/flagd-core";
import { promises as fs } from "node:fs";
import hash from "object-hash";

const flagdCore = new FlagdCore();

export async function POST(request: Request) {
  const file = await fs.readFile(process.cwd() + "/flags.json", "utf8");
  const context = await request.json();
  flagdCore.setConfigurations(file);

  // We have to map these names to be compatible with OFREP
  const flags = flagdCore
    .resolveAll(context)
    .map(({ flagKey, flagMetadata, ...flag }) => ({
      key: flagKey,
      metadata: flagMetadata,
      ...flag,
    }));

  const hashValue = hash(flags);

  if (request.headers.get("If-None-Match") === hashValue) {
    return new Response(null, { status: 304 });
  }

  return new Response(JSON.stringify({ flags }), {
    headers: { ETag: hashValue, "Content-Type": "application/json" },
  });
}
