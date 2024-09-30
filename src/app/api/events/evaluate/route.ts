import { events } from "@opentelemetry/api-events";

const featureFlagEvaluation = events.getEventLogger("feature_flag");

export async function POST(request: Request) {
  const attributes = await request.json();

  featureFlagEvaluation.emit({
    name: "feature_flag.evaluation",
    attributes,
  });

  return new Response(null, { status: 202 });
}
