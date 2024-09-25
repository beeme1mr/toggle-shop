import { NextResponse } from "next/server";
import { events } from "@opentelemetry/api-events";

export async function POST(request: Request) {
  const order = await request.json();
  console.log("Order received:", order);
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const otelEvent = events.getEventLogger("test");
  otelEvent.emit({
    name: "order_received",
    attributes: { order: JSON.stringify(order) },
  });
  return NextResponse.json({ message: "Order received successfully" });
}
