import { NextResponse } from "next/server";
import { getConnection } from "@/db";
import { OpenFeature } from "@openfeature/server-sdk";
import { FlagdProvider } from "@openfeature/flagd-provider";
import { headerToEvaluationContext } from "@/libs/open-feature/evaluation-context";
import { EventHook } from "@/libs/open-feature/event-hook";

// TODO move this to a shared location
(async () => {
  console.log("registering the provider");
  await Promise.race([
    OpenFeature.setProvider(
      new FlagdProvider({
        resolverType: "in-process",
        offlineFlagSourcePath: process.cwd() + "/flags.json",
      })
    ),
    new Promise((_, reject) => setTimeout(reject, 5000)),
  ]);
  OpenFeature.addHooks(new EventHook("feature_flag"));
  console.log("provider registered");
})();

export async function GET(req: Request) {
  const featureFlagClient = OpenFeature.getClient(
    headerToEvaluationContext(req.headers)
  );
  const db = await getConnection(featureFlagClient);
  const products = await db.list("products");
  return NextResponse.json(products);
}
