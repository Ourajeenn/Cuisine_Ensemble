# Opérations et supervision CuisineEnsemble

## Observabilité

### Prometheus

Collecte : CPU, mémoire, requêtes par seconde, latence, erreurs.

### Grafana

Tableaux de bord personnalisés pour :

- charge système
- latence applicative
- activité du frontend
- santé des services

### Loki

Centralisation des logs applicatifs et infrastructure.

## Alertes

- notification mail
- notification Slack
- déclenchement sur panne, latence élevée, erreurs critiques

## Traces

Des traces applicatives doivent être collectées pour diagnostiquer les temps de traitement et les goulots d’étranglement.
