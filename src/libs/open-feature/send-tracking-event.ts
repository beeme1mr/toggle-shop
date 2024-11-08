"use server";

import { events, Event } from "@opentelemetry/api-events";

const featureFlagTrack = events.getEventLogger("feature_flag");

export async function sendTrackEvent(attributes: Event["attributes"]) {
  featureFlagTrack.emit({
    name: "feature_flag.track",
    attributes,
  });
}
