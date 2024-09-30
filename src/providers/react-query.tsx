"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import type { EvaluationContext } from "@openfeature/react-sdk";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: EvaluationContext;
    mutationMeta: EvaluationContext;
  }
}

export function ReactQueryProvider({
  targetingKey,
  children,
}: {
  targetingKey: string;
  children: React.ReactNode;
}) {
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: { meta: { targetingKey } },
        mutations: { meta: { targetingKey } },
      },
    });
  }, [targetingKey]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
