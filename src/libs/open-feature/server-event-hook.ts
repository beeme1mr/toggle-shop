import {
  EvaluationDetails,
  FlagValue,
  Hook,
  HookContext,
  OpenFeatureError,
} from "@openfeature/server-sdk";
import type { Attributes } from "@opentelemetry/api";
import { EventLogger, events } from "@opentelemetry/api-events";
import {
  ATTR_FEATURE_FLAG_CONTEXT_ID,
  ATTR_FEATURE_FLAG_ERROR_CODE,
  ATTR_FEATURE_FLAG_ERROR_MESSAGE,
  ATTR_FEATURE_FLAG_KEY,
  ATTR_FEATURE_FLAG_REASON,
  ATTR_FEATURE_FLAG_SET_ID,
  ATTR_FEATURE_FLAG_SYSTEM,
  ATTR_FEATURE_FLAG_VALUE,
  ATTR_FEATURE_FLAG_VARIANT,
  ATTR_FEATURE_FLAG_VERSION,
  EVENT_NAME_FEATURE_FLAG_EVALUATION,
} from "./proposed-attributes";

export class ServerEventHook implements Hook {
  private _el: EventLogger;

  // Hardcoded context that should come from the provider.
  private _additionalContext = {
    [ATTR_FEATURE_FLAG_VERSION]: "v1.0.0",
    [ATTR_FEATURE_FLAG_SET_ID]: "toggle-shop/dev",
  };

  constructor(loggerName: string) {
    this._el = events.getEventLogger(loggerName);
  }

  after(
    hookContext: Readonly<HookContext<FlagValue>>,
    evaluationDetails: EvaluationDetails<FlagValue>
  ): void | Promise<void> {
    this._el.emit({
      name: EVENT_NAME_FEATURE_FLAG_EVALUATION,
      attributes: {
        [ATTR_FEATURE_FLAG_KEY]: hookContext.flagKey,
        [ATTR_FEATURE_FLAG_SYSTEM]: hookContext.providerMetadata.name,
        // The type of value can be null...
        ...(evaluationDetails.value && {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [ATTR_FEATURE_FLAG_VALUE]: evaluationDetails.value as any,
        }),
        [ATTR_FEATURE_FLAG_REASON]: evaluationDetails.reason ?? "UNKNOWN",
        // Optional fields
        ...(evaluationDetails.variant && {
          [ATTR_FEATURE_FLAG_VARIANT]: evaluationDetails.variant,
        }),
        ...(hookContext.context.targetingKey && {
          [ATTR_FEATURE_FLAG_CONTEXT_ID]: hookContext.context.targetingKey,
        }),
        [ATTR_FEATURE_FLAG_SET_ID]:
          this._additionalContext[ATTR_FEATURE_FLAG_SET_ID],
        [ATTR_FEATURE_FLAG_VERSION]:
          this._additionalContext[ATTR_FEATURE_FLAG_VERSION],
      },
    });
  }

  error(
    hookContext: Readonly<HookContext<FlagValue>>,
    error: unknown
  ): void | Promise<void> {
    const attributes: Attributes = {
      [ATTR_FEATURE_FLAG_KEY]: hookContext.flagKey,
      [ATTR_FEATURE_FLAG_SYSTEM]: hookContext.providerMetadata.name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [ATTR_FEATURE_FLAG_VALUE]: hookContext.defaultValue as any,
      [ATTR_FEATURE_FLAG_REASON]: "ERROR",
      // Optional fields
      ...(hookContext.context.targetingKey && {
        [ATTR_FEATURE_FLAG_CONTEXT_ID]: hookContext.context.targetingKey,
      }),
      [ATTR_FEATURE_FLAG_SET_ID]:
        this._additionalContext[ATTR_FEATURE_FLAG_SET_ID],
      [ATTR_FEATURE_FLAG_VERSION]:
        this._additionalContext[ATTR_FEATURE_FLAG_VERSION],
      // TODO add a reference trace ID
      [ATTR_FEATURE_FLAG_ERROR_CODE]:
        error instanceof OpenFeatureError ? error.code : "UNKNOWN",
      [ATTR_FEATURE_FLAG_ERROR_MESSAGE]:
        error instanceof OpenFeatureError ? error.message : "UNKNOWN",
    };

    this._el.emit({
      name: EVENT_NAME_FEATURE_FLAG_EVALUATION,
      attributes,
    });
  }
}
