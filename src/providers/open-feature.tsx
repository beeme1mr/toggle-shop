"use client";

import {
  EvaluationContext,
  Logger,
  OccurrenceDetails,
  OpenFeatureProvider as OFProvider,
  OpenFeature,
  Provider,
} from "@openfeature/react-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";

class OFREPTrackingWebProvider extends OFREPWebProvider implements Provider {
  constructor(options: ConstructorParameters<typeof OFREPWebProvider>[0], logger?: Logger) {
    super(options);
  }

  track(occurrenceKey: string, context: EvaluationContext, occurrenceDetails: OccurrenceDetails): void {
      console.log(arguments, undefined, 4);
  }
}

// /ofrep/v1/evaluate/flags
OpenFeature.setProvider(
  new OFREPTrackingWebProvider({
    baseUrl: "http://localhost:3000/api",
  })
);

export function OpenFeatureProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OFProvider>{children}</OFProvider>;
}
