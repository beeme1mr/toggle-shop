"use client";

import {
  OpenFeatureProvider as OFProvider,
  OpenFeature,
} from "@openfeature/react-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";

// /ofrep/v1/evaluate/flags
OpenFeature.setProvider(
  new OFREPWebProvider({
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
