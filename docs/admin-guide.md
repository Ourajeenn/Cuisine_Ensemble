# Guide administrateur CuisineEnsemble

## Installation

```bash
npm install
npm run build
```

## Configuration

- variables d’environnement pour l’URL de la base PostgreSQL
- variables pour MongoDB
- configuration JWT et refresh token
- configuration HTTPS/Ingress

## Maintenance

- vérifier les logs Loki
- contrôler les métriques Prometheus/Grafana
- exécuter les migrations SQL
- sauvegarder les volumes Docker et les bases de données

## Sécurité

- rotation des secrets
- vérification Semgrep dans le pipeline
- audit des permissions sur les services d’infrastructure
