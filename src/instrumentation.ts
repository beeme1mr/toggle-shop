import { registerOTel, SpanExporterOrName } from "@vercel/otel";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";

import {
  type MetricReader,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import {
  type LogRecordProcessor,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { events } from "@opentelemetry/api-events";
import { logs } from "@opentelemetry/api-logs";
import { EventLoggerProvider } from "@opentelemetry/sdk-events";

const headers: Record<string, string> = {};
if (process.env.OTLP_AUTHORIZATION) {
  headers["Authorization"] = `Api-Token ${process.env.OTLP_AUTHORIZATION}`;
}

let traceExporter: SpanExporterOrName | undefined;
if (process.env.OTLP_TRACE_URL) {
  traceExporter = new OTLPTraceExporter({
    url: process.env.OTLP_TRACE_URL,
    headers,
  });
}

let metricReader: MetricReader | undefined;
if (process.env.OTLP_METRICS_URL) {
  metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTLP_METRICS_URL,
      headers,
    }),
  });
}

let logRecordProcessor: LogRecordProcessor | undefined;
if (process.env.OTLP_LOGS_URL) {
  logRecordProcessor = new SimpleLogRecordProcessor(
    new OTLPLogExporter({
      url: process.env.OTLP_LOGS_URL,
      headers,
    })
  );
}

export function register() {
  registerOTel({
    serviceName: "toggle-shop",
    traceExporter,
    metricReader,
    logRecordProcessor,
  });

  console.log("setting global log provider");
  events.setGlobalEventLoggerProvider(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new EventLoggerProvider(logs.getLoggerProvider() as any)
  );

  if (process.env.NEXT_RUNTIME === "nodejs") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./register.openfeature");
  }
}
