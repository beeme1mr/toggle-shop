"use server";

import { NextResponse } from "next/server";
import { OpenFeature } from "@openfeature/server-sdk";
import { headerToEvaluationContext } from "@/libs/open-feature/evaluation-context";

export async function POST(request: Request) {
  const featureFlagClient = OpenFeature.getClient(
    headerToEvaluationContext(request.headers)
  );
  const order = await request.json();
  console.log("Order received:", order);
  featureFlagClient.track("order_received");

  return NextResponse.json({ message: "Order received successfully" });
}
