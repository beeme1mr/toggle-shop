"use server";

import { NextResponse } from "next/server";
import { getConnection } from "@/db";
import { OpenFeature } from "@openfeature/server-sdk";
import { headerToEvaluationContext } from "@/libs/open-feature/evaluation-context";

export async function GET(req: Request) {
  const featureFlagClient = OpenFeature.getClient(
    headerToEvaluationContext(req.headers)
  );
  const db = await getConnection(featureFlagClient);
  const products = await db.list("products");
  return NextResponse.json(products);
}
