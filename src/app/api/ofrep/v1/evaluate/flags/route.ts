import { NextResponse } from "next/server";
// import { FlagdCore } from "@openfeature/flagd-core";
// import { } from "node:fs/promises";

// const flagdCore = new FlagdCore();

// flagdCore.

// Read and watch ./flags.json file

export async function POST(request: Request) {
  const context = await request.json();
  console.log("context", context);

  // const flags = new Fea
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json({
    flags: [{ key: "show-landing-page-banner", value: true }],
  });
}
