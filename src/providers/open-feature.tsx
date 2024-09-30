"use client";

import {
  EvaluationContext,
  OpenFeatureProvider as OFProvider,
  OpenFeature,
} from "@openfeature/react-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";
import { useEffect } from "react";

export function OpenFeatureProvider({
  context,
  children,
}: {
  context: EvaluationContext;
  children: React.ReactNode;
}) {
  useEffect(() => {
    OpenFeature.setProvider(
      new OFREPWebProvider({
        baseUrl: "http://localhost:3000/api",
        // We're polling for updates frequently for demo purposes.
        // A real app may want to only update on page load.
        pollInterval: 5000,
      }),
      context
    );
  }, [context]);

  return <OFProvider>{children}</OFProvider>;
}
