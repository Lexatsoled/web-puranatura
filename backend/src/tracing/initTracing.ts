import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace } from '@opentelemetry/api';

const exporter =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT &&
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT.length > 0
    ? new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
          ? Object.fromEntries(
              process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',').map((pair) => {
                const [key, value] = pair.split('=');
                return [key.trim(), value?.trim() ?? ''];
              })
            )
          : undefined,
      })
    : new ConsoleSpanExporter();

const provider = new NodeTracerProvider({
  resource: resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: 'puranatura-api',
    [SemanticResourceAttributes.SERVICE_VERSION]:
      process.env.npm_package_version ?? '0.0.0',
  }),
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});
provider.register();

export const tracer = trace.getTracer('puranatura-api');
