import { NextResponse } from "next/server";
import { getConnection } from "@/db";
import { OpenFeature } from "@openfeature/server-sdk";
import { headerToEvaluationContext } from "@/libs/open-feature/evaluation-context";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  const pid = Number(productId);
  const featureFlagClient = OpenFeature.getClient(
    headerToEvaluationContext(req.headers)
  );
  const db = await getConnection(featureFlagClient);
  const product = await db.get("products", pid);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return NextResponse.json(product);
}
