# CuisineEnsemble Monitoring Guide

## 🎯 Architecture Overview

Your monitoring stack consists of:
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboarding
- **Loki**: Log aggregation
- **Application Metrics**: Custom prom-client instrumentation

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Monitoring Stack
```bash
# Start monitoring services (Prometheus, Grafana, Loki)
docker compose -f docker-compose.monitoring.yml up -d

# Or with your app
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

### 3. Access Dashboards

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://localhost:3001 | admin / admin |
| Prometheus | http://localhost:9090 | - |
| Loki | http://localhost:3100 | - |

## 📊 What's Monitored

### Application Metrics (`/metrics`)

#### HTTP Metrics
- `http_requests_total` - Total HTTP requests by method, route, status
- `http_request_duration_seconds` - Request latency histogram

#### Business Metrics
- `meal_orders_total` - Meal orders by status
- `supabase_auth_events_total` - Authentication events

#### Infrastructure Metrics
- `process_resident_memory_bytes` - Memory usage
- `process_cpu_seconds_total` - CPU time
- `application_errors_total` - Application errors by type

#### Cache Metrics
- `cache_hits_total` - Cache hit count
- `cache_misses_total` - Cache miss count

#### Database Metrics
- `database_query_duration_seconds` - Query latency

## 🔍 Verify Setup

### 1. Check Prometheus Targets
- Go to http://localhost:9090/targets
- Verify `cuisineensemble-app` shows status UP
- If DOWN, check that app is running and `/metrics` endpoint is accessible

### 2. Verify Metrics Collection
```bash
# Check if metrics are being scraped
curl http://localhost:3000/metrics

# Expected output: Prometheus format metrics
```

### 3. Check Grafana Data Source
1. Go to http://localhost:3001
2. Settings → Data sources
3. Click "Prometheus"
4. Click "Save & Test"
5. Should see "datasource is working"

## 📈 Available Dashboards

### CuisineEnsemble - Application Metrics
- Request rate and latency
- Error rates
- Memory usage
- HTTP status distribution

Auto-provisioned at: `/var/lib/grafana/dashboards/application-metrics.json`

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `monitoring/prometheus.yml` | Prometheus scrape configs |
| `monitoring/loki-config.yml` | Loki storage and ingestion |
| `monitoring/alerting-rules.yml` | Alert conditions |
| `src/lib/metrics.ts` | Application metrics definitions |
| `src/server.ts` | Metrics collection middleware |

## 🔔 Alerts

Configured alerts (in `alerting-rules.yml`):

- **HighErrorRate**: Error rate > 5% for 5 minutes
- **HighLatency**: P95 latency > 1 second
- **HighMemoryUsage**: Memory > 500MB
- **ContainerRestarting**: Unexpected container restarts
- **PrometheusScrapeFailed**: Can't scrape app metrics

## 📝 Troubleshooting

### Prometheus can't scrape app
- Check app is running: `docker ps | grep app`
- Check `/metrics` endpoint: `curl http://localhost:3000/metrics`
- Verify `host.docker.internal` works (macOS/Windows)
- For Linux, update `prometheus.yml` target to `app:3000` and add service to same network

### Grafana has no data
- Wait 30-60 seconds for first metrics to arrive
- Check Prometheus → Graph tab has data
- Verify datasource URL is `http://prometheus:9090`

### Memory/CPU metrics not showing
- Node exporter not in this stack
- These are process-level metrics from prom-client (available)
- For host metrics, add node-exporter service

## 🛠️ Customization

### Add New Metric
1. Edit `src/lib/metrics.ts`
2. Create metric with prom-client
3. Register in custom `register`
4. Use in code to record values

### Add New Dashboard
1. Create in Grafana UI
2. Export JSON to `monitoring/grafana/provisioning/dashboards/`
3. Restart Grafana to auto-load

### Change Scrape Interval
Edit `monitoring/prometheus.yml`:
```yaml
global:
  scrape_interval: 15s  # Change this
```

## 📚 References

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/grafana/latest/)
- [Loki Docs](https://grafana.com/docs/loki/latest/)
- [prom-client](https://github.com/siimon/prom-client)
