import {
  EvaluationDetails,
  FlagValue,
  Hook,
  HookContext,
  OpenFeatureError,
} from "@openfeature/server-sdk";
import { EventLogger, events } from "@opentelemetry/api-events";
import {
  ATTR_FEATURE_FLAG_CONTEXT_ID,
  ATTR_FEATURE_FLAG_ENVIRONMENT_ID,
  ATTR_FEATURE_FLAG_ERROR_CODE,
  ATTR_FEATURE_FLAG_ERROR_MESSAGE,
  ATTR_FEATURE_FLAG_KEY,
  ATTR_FEATURE_FLAG_PROVIDER_NAME,
  ATTR_FEATURE_FLAG_REASON,
  ATTR_FEATURE_FLAG_VARIANT,
  ATTR_FEATURE_FLAG_VERSION,
  EVENT_NAME_FEATURE_FLAG_EVALUATION,
} from "./proposed-attributes";
import { Attributes } from "@opentelemetry/api";

export class EventHook implements Hook {
  private _el: EventLogger;

  // Hardcoded context that should come from the provider.
  private _additionalContext = {
    [ATTR_FEATURE_FLAG_VERSION]: "v1.0.0",
    [ATTR_FEATURE_FLAG_ENVIRONMENT_ID]: "dev",
  };

  constructor(loggerName: string) {
    this._el = events.getEventLogger(loggerName);
  }

  after(
    hookContext: Readonly<HookContext<FlagValue>>,
    evaluationDetails: EvaluationDetails<FlagValue>
  ): void | Promise<void> {
    // TODO allow context id to be controlled in user land
    const contextId = hookContext.context.targetingKey;

    if (contextId) {
      this._el.emit({
        name: "feature_flag.context",
        attributes: {
          ...hookContext.context,
          // TODO see if there's a better location for this.
          [ATTR_FEATURE_FLAG_CONTEXT_ID]: contextId,
        } as Attributes,
      });
    }

    this._el.emit({
      name: EVENT_NAME_FEATURE_FLAG_EVALUATION,
      attributes: {
        [ATTR_FEATURE_FLAG_KEY]: evaluationDetails.flagKey,
        [ATTR_FEATURE_FLAG_PROVIDER_NAME]: hookContext.providerMetadata.name,
        [ATTR_FEATURE_FLAG_VARIANT]: evaluationDetails.variant,
        [ATTR_FEATURE_FLAG_REASON]: evaluationDetails.reason,
        [ATTR_FEATURE_FLAG_ENVIRONMENT_ID]:
          this._additionalContext[ATTR_FEATURE_FLAG_ENVIRONMENT_ID],
        [ATTR_FEATURE_FLAG_VERSION]:
          this._additionalContext[ATTR_FEATURE_FLAG_VERSION],
        ...(contextId ? { [ATTR_FEATURE_FLAG_CONTEXT_ID]: contextId } : {}),
      },
    });
  }

  error(
    hookContext: Readonly<HookContext<FlagValue>>,
    error: unknown
  ): void | Promise<void> {
    const attributes: Attributes = {
      [ATTR_FEATURE_FLAG_KEY]: hookContext.flagKey,
      [ATTR_FEATURE_FLAG_PROVIDER_NAME]: hookContext.providerMetadata.name,
      // default variant doesn't have a name
      // should we insert the actual default value?
      [ATTR_FEATURE_FLAG_VARIANT]: "default variant",

      [ATTR_FEATURE_FLAG_ENVIRONMENT_ID]:
        this._additionalContext[ATTR_FEATURE_FLAG_ENVIRONMENT_ID],
      [ATTR_FEATURE_FLAG_VERSION]:
        this._additionalContext[ATTR_FEATURE_FLAG_VERSION],
    };
    if (error instanceof OpenFeatureError) {
      attributes[ATTR_FEATURE_FLAG_ERROR_CODE] = error.code;
      attributes[ATTR_FEATURE_FLAG_ERROR_MESSAGE] = error.message;
    } else if (error instanceof Error) {
      // TODO general may not be the right choice
      attributes[ATTR_FEATURE_FLAG_ERROR_CODE] = "GENERAL";
      attributes[ATTR_FEATURE_FLAG_ERROR_MESSAGE] = error.message;
    } else {
      // this is just a guess tbh
      attributes[ATTR_FEATURE_FLAG_ERROR_CODE] = "GENERAL";
      attributes[ATTR_FEATURE_FLAG_ERROR_MESSAGE] = String(error);
    }

    this._el.emit({
      name: EVENT_NAME_FEATURE_FLAG_EVALUATION,
      attributes,
    });
  }
}
