import { FlagdProvider } from "@openfeature/flagd-provider";
import {
  EvaluationContext,
  OpenFeature,
  Provider,
  TrackingEventDetails,
} from "@openfeature/server-sdk";
import { ServerEventHook } from "@/libs/open-feature/server-event-hook";
import { sendTrackEvent } from "@/libs/open-feature/send-tracking-event";
import { ATTR_FEATURE_FLAG_CONTEXT_ID } from "./libs/open-feature/proposed-attributes";

console.log("registering the OpenFeature provider");

class FlagdEventProvider extends FlagdProvider implements Provider {
  track(
    trackingEventName: string,
    context?: EvaluationContext,
    trackingEventDetails?: TrackingEventDetails
  ): void {
    sendTrackEvent({
      ["feature_flag.event_name"]: trackingEventName,
      ...(context &&
        context.targetingKey && {
          [ATTR_FEATURE_FLAG_CONTEXT_ID]: context.targetingKey,
        }),
      ...context,
      ...trackingEventDetails,
    });
  }
}

OpenFeature.addHooks(new ServerEventHook("feature_flag"));
OpenFeature.setProvider(new FlagdEventProvider({ resolverType: "in-process" }));
