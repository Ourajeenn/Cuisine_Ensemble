import promClient from 'prom-client';

// Créer un registre personnalisé
export const register = new promClient.Registry();

// Enregistrer les métriques par défaut (CPU, mémoire, etc.)
promClient.collectDefaultMetrics({ register });

// Métriques personnalisées pour l'application
export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

export const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register],
});

export const cacheHitRate = new promClient.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_name'],
  registers: [register],
});

export const cacheMissRate = new promClient.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_name'],
  registers: [register],
});

export const supabaseAuthEvents = new promClient.Counter({
  name: 'supabase_auth_events_total',
  help: 'Total number of authentication events',
  labelNames: ['event_type'],
  registers: [register],
});

export const mealOrdersTotal = new promClient.Counter({
  name: 'meal_orders_total',
  help: 'Total number of meal orders',
  labelNames: ['status'],
  registers: [register],
});

export const applicationErrors = new promClient.Counter({
  name: 'application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['error_type', 'endpoint'],
  registers: [register],
});
