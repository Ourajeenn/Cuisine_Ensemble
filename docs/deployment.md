# Déploiement CuisineEnsemble

## Pré-requis

- Docker
- Docker Compose
- Node.js 20+
- Fly.io CLI
- projet Supabase avec les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

## Déploiement local via Docker Compose

Le Dockerfile du dépôt construit l’image du site frontend SPA. La CI GitHub Actions l’utilise ensuite pour produire et publier l’image du site avant le déploiement.

```bash
docker build -t cuisineensemble-site:local -f Dockerfile .
docker compose -f docker-compose.CuisineEnsemble.yml up -d --build
docker compose -f docker-compose.monitoring.yml up -d --build
```

Services fournis :

- `app` : application CuisineEnsemble
- `postgres` : base SQL isolée par environnement
- `prometheus` : agrégation des métriques
- `grafana` : visualisation des dashboards
- `loki` : centralisation des logs

## Topologie Fly.io

Le dépôt cible 2 machines Fly.io distinctes :

- front : [fly.toml](../fly.toml)
- back : [fly.back.toml](../fly.back.toml)

Les déploiements sont pilotés séparément pour refléter la séparation des responsabilités du front et du back.

## Pipeline GitHub Actions (9 stages)

Le workflow [.github/workflows/ci.yml](../.github/workflows/ci.yml) impose la séquence suivante :

1. `validate`
2. `terraform-plan`
3. `deploy-infra`
4. `configure-vms`
5. `deploy-test`
6. `verify-test`
7. `deploy-prod`
8. `verify-prod`
9. `rollback`

## Terraform / Ansible

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

## Supabase

1. Créer un projet Supabase.
2. Importer [db/supabase/schema.sql](../db/supabase/schema.sql).
3. Récupérer l’URL, la clé anonyme et la référence du projet.
4. Ajouter les variables d’environnement dans GitHub Actions et le runtime local :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_PROJECT_REF`
   - `FLY_API_TOKEN`
   - `FLY_APP_FRONT`
   - `FLY_APP_BACK`

## Rollback

Le rollback manuel est piloté par [scripts/rollback.sh](../scripts/rollback.sh) et doit être déclenchable à tout moment depuis le workflow GitHub Actions.
