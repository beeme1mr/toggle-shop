import type { EvaluationContext } from "@openfeature/core";

const TARGETING_KEY_HEADER = "x-targeting-key";

export function tanstackMetaToHeader(
  meta?: EvaluationContext
): Record<string, string> {
  if (meta && meta.targetingKey) {
    return {
      [TARGETING_KEY_HEADER]: meta.targetingKey,
    };
  }

  return {};
}

export function headerToEvaluationContext(
  headers: Headers
): EvaluationContext | undefined {
  const targetingKey = headers.get(TARGETING_KEY_HEADER);
  if (targetingKey) {
    return { targetingKey };
  }

  return undefined;
}
