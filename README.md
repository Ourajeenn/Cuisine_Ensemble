# CuisineEnsemble

CuisineEnsemble est une application web de partage de repas entre voisins, construite avec React, TanStack Router et TanStack Start.

## Objectif

Créer une plateforme de réservation de repas entre voisins avec authentification, paiement simulé, notifications temps réel et observabilité d’exploitation.

## Stack

- Frontend : React 19, TypeScript, Vite, TanStack Router, TanStack Start
- UI : Tailwind CSS, Radix UI, composants shadcn-style
- Authentification : Supabase Auth + PostgreSQL
- Base de données : Supabase Postgres
- Déploiement : Fly.io sur 2 VM, Terraform + Ansible
- Conteneurs : `docker-compose.CuisineEnsemble.yml` + `docker-compose.monitoring.yml`
- Observabilité : Prometheus, Grafana, Loki
- Qualité : ESLint, Prettier, Vitest, Playwright, Semgrep

## Pré-requis

- Node.js 20+
- npm
- projet Supabase configuré
- token Fly.io `FLY_API_TOKEN`

## Variables d’environnement

Copier [.env.example](.env.example) vers `.env` puis remplir :

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_PROJECT_REF=<project-ref>
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me
FLY_API_TOKEN=
FLY_APP_FRONT=cuisineensemble-front
FLY_APP_BACK=cuisineensemble-back
```

Pour GitHub Actions, configurer les secrets et variables suivantes dans le dépôt ou l’environnement ciblé :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_PROJECT_REF`
- `FLY_API_TOKEN`
- `FLY_APP_FRONT` (variable)
- `FLY_APP_BACK` (variable)

## Démarrage local

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm run build
npm run lint
npm run test:unit -- --run
npm run test:coverage -- --run
npm run test:e2e
```

## Pipeline CI/CD

Le workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) est structuré en 9 stages :

1. `validate`
2. `terraform-plan`
3. `deploy-infra`
4. `configure-vms`
5. `deploy-test`
6. `verify-test`
7. `deploy-prod`
8. `verify-prod`
9. `rollback`

## Déploiement

### Stack applicative

```bash
docker compose -f docker-compose.CuisineEnsemble.yml up -d --build
```

### Stack monitoring

```bash
docker compose -f docker-compose.monitoring.yml up -d --build
```

### Terraform

```bash
terraform -chdir=infra/terraform init
terraform -chdir=infra/terraform plan
terraform -chdir=infra/terraform apply -auto-approve
```

### Ansible

```bash
ansible-playbook -i infra/ansible/inventory.ini infra/ansible/site.yml
```

## Documentation

- [docs/architecture.md](docs/architecture.md)
- [docs/deployment.md](docs/deployment.md)
- [docs/user-guide.md](docs/user-guide.md)
- [docs/admin-guide.md](docs/admin-guide.md)
- [docs/operations.md](docs/operations.md)
- [docs/performance-report.md](docs/performance-report.md)

## Observabilité

- Prometheus : agrégation des métriques
- Grafana : dashboards
- Loki : centralisation des logs
- Règles d’alerte : [monitoring/alerting-rules.yml](monitoring/alerting-rules.yml)

## Licence

Projet interne de démonstration.
