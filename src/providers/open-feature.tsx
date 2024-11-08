"use client";

import {
  EvaluationContext,
  OpenFeatureProvider as OFProvider,
  OpenFeature,
  Provider,
  TrackingEventDetails,
} from "@openfeature/react-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";
import { useEffect, useRef } from "react";
import { ClientEventHook } from "@/libs/open-feature/client-event-hook";
import { getBaseUrl } from "@/libs/url";
import { ATTR_FEATURE_FLAG_CONTEXT_ID } from "@/libs/open-feature/proposed-attributes";

class OFREPWebEventProvider extends OFREPWebProvider implements Provider {
  metadata = { name: "OREFP" };

  track(
    trackingEventName: string,
    context?: EvaluationContext,
    trackingEventDetails?: TrackingEventDetails
  ): void {
    fetch(getBaseUrl() + "/api/events/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ["feature_flag.event_name"]: trackingEventName,
        ...(context &&
          context.targetingKey && {
            [ATTR_FEATURE_FLAG_CONTEXT_ID]: context.targetingKey,
          }),
        ...context,
        ...trackingEventDetails,
      }),
    }).catch(console.error);
  }
}

export function OpenFeatureProvider({
  context,
  children,
}: {
  context: EvaluationContext;
  children: React.ReactNode;
}) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      console.log("initializing OFREP provider");
      OpenFeature.addHooks(new ClientEventHook());
      OpenFeature.setProvider(
        new OFREPWebEventProvider({
          baseUrl: "/api",
          // We're polling for updates frequently for demo purposes.
          // A real app may want to only update on page load.
          pollInterval: 5000,
        }),
        context
      );
      hasInitialized.current = true;
    }
    return () => {
      OpenFeature.close();
    };
  });

  return <OFProvider>{children}</OFProvider>;
}
