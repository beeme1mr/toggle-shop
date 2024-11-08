"use client";

import {
  EvaluationContext,
  OpenFeatureProvider as OFProvider,
  OpenFeature,
} from "@openfeature/react-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";
import { useEffect, useRef } from "react";
import { ClientEventHook } from "@/libs/open-feature/client-event-hook";

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
        new OFREPWebProvider({
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
