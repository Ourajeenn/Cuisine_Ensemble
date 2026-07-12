# Architecture CuisineEnsemble

## Vue d’ensemble

CuisineEnsemble repose sur une application web moderne en React + TanStack Start, avec une base Supabase Postgres comme source principale de vérité, un pipeline GitHub Actions à 9 stages et un provisionnement multi-couches via Terraform + Ansible.

## Composants

- Frontend : React 19 + TanStack Start + Vite
- Authentification : Supabase Auth
- Base de données : Supabase Postgres
- Temps réel : Supabase Realtime avec fallback navigateur
- Déploiement front : Fly.io sur 1 VM dédiée
- Déploiement back : Fly.io sur 1 VM dédiée
- Infrastructure as Code : Terraform (`main.tf`, `variables.tf`, `backend.tf`)
- Provisionnement : Ansible (`site.yml`, `roles/`, `inventory/`, `group_vars/`)
- Docker : `Dockerfile` pour la construction de l’image du site, complété par `docker-compose.CuisineEnsemble.yml` + `docker-compose.monitoring.yml`
- Monitoring : Prometheus, Grafana, Loki, alerting rules

## Topologie cible

- 2 VM Fly.io pleinement séparées pour le front et le back
- un environnement de test qui reflète la prod (`mirror`)
- un environnement de production avec validation manuelle avant promotion
- un pipeline GitHub Actions en 9 stages, prêt pour le déploiement progressif

## Flux de livraison

1. `validate` : lint, tests, build, security, Ansible lint, validation des règles Prometheus.
2. `terraform-plan` : `terraform validate` puis `terraform plan` exporté en artefact.
3. `deploy-infra` : `terraform apply` pour créer ou mettre à jour les VM.
4. `configure-vms` : `ansible-playbook` pour configurer les VM.
5. `deploy-test` : déploiement de la stack de test.
6. `verify-test` : smoke test applicatif sur la VM TEST.
7. `deploy-prod` : déploiement en prod après validation manuelle.
8. `verify-prod` : smoke test applicatif sur la VM PROD + supervision.
9. `rollback` : redémarrage manuel de la stack déclenchable à tout moment.
