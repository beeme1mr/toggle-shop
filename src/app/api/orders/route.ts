import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const order = await request.json();
  console.log("Order received:", order);
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json({ message: "Order received successfully" });
}
