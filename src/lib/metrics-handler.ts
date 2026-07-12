import { register } from './metrics';

/**
 * Expose Prometheus metrics endpoint
 * Should be mounted on GET /metrics
 */
export function createMetricsHandler() {
  return {
    contentType: register.contentType,
    metrics: async () => {
      try {
        return await register.metrics();
      } catch (error) {
        console.error('Error generating metrics:', error);
        throw error;
      }
    },
  };
}

/**
 * Middleware to track HTTP request metrics
 * Use this in your request handler
 */
export function metricsMiddleware(
  method: string,
  route: string,
  statusCode: number,
  duration: number,
) {
  const { httpRequestDuration, httpRequestTotal } = require('./metrics');
  
  httpRequestDuration
    .labels(method, route, statusCode)
    .observe(duration / 1000); // Convert to seconds
  
  httpRequestTotal
    .labels(method, route, statusCode)
    .inc();
}
