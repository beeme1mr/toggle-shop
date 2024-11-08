"use server";

import { events } from "@opentelemetry/api-events";

const featureFlagTrack = events.getEventLogger("feature_flag");

export async function POST(request: Request) {
  const attributes = await request.json();

  featureFlagTrack.emit({
    name: "feature_flag.track",
    attributes,
  });

  return new Response(null, { status: 202 });
}
