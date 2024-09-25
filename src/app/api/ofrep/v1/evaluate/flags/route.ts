import { FlagdCore } from "@openfeature/flagd-core";
import { readFileSync, watchFile, promises as fsPromises } from "node:fs";
import hash from "object-hash";

const flagdCore = new FlagdCore();

const filename = process.cwd() + "/flags.json";
const encoding = "utf8";

const flagConfig = readFileSync(filename, encoding);
flagdCore.setConfigurations(flagConfig);

watchFile(filename, async () => {
  console.log("File changed");
  try {
    const flagConfig = await fsPromises.readFile(filename, encoding);
    flagdCore.setConfigurations(flagConfig);
  } catch (err) {
    console.error(err);
  }
});

export async function POST(request: Request) {
  const context = await request.json();

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
