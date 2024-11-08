"use server";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const order = await request.json();
  console.log("Order received:", order);

  return NextResponse.json({ message: "Order received successfully" });
}
