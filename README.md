# 🍽️ CuisineEnsemble - Partage de Repas Entre Voisins

**Une plateforme web pour partager et déguster les repas maison de votre voisinage.**

[![Status](https://img.shields.io/badge/status-production--ready-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node.js](https://img.shields.io/badge/node-24-green)]()
[![Docker](https://img.shields.io/badge/docker-required-blue)]()
[![Kubernetes](https://img.shields.io/badge/kubernetes-optional-blue)]()

---

## 🚀 Démarrage Rapide

### 1️⃣ Installation Locale (5 minutes)

```bash
git clone https://github.com/YOUR_USERNAME/CuisineEnsemble.git
cd CuisineEnsemble
npm install
npm run dev
```

Ouvrez: **http://localhost:5173**

### 2️⃣ Avec Docker Compose (10 minutes)

```bash
docker compose -f docker-compose.CuisineEnsemble.yml up -d
docker compose -f docker-compose.monitoring.yml up -d
```

Services:
- 🍽️ App: http://localhost:3000
- 📊 Grafana: http://localhost:3001 (admin/admin)
- 📈 Prometheus: http://localhost:9090

### 3️⃣ Avec Kubernetes (30 minutes)

```bash
./scripts/deploy-k8s.sh install
./scripts/deploy-k8s.sh status
```

Port forward:
```bash
kubectl port-forward -n cuisineensemble svc/cuisineensemble 3000:80
kubectl port-forward -n cuisineensemble svc/grafana 3001:3000
```

---

## 📚 Documentation

### Pour les Utilisateurs
- **[Guide Utilisateur](docs/DOCUMENTATION_COMPLETE.md#guide-utilisateur)** - Comment utiliser l'app
- **[FAQ](docs/DOCUMENTATION_COMPLETE.md#faq-utilisateur)** - Questions fréquentes

### Pour les Administrateurs
- **[Guide Admin Complet](docs/DOCUMENTATION_COMPLETE.md#guide-admin)** - Installation, configuration, maintenance
- **[Getting Started](docs/GETTING_STARTED.md)** - Étapes par étapes
- **[Kubernetes Guide](docs/kubernetes-guide.md)** - Déploiement K8s
- **[Grafana Setup](docs/GRAFANA_SETUP.md)** - Configuration monitoring
- **[CI/CD Troubleshooting](docs/ci-cd-troubleshooting.md)** - Pipeline GitHub Actions
- **[Monitoring Guide](docs/monitoring-guide.md)** - Prometheus + Grafana

### Technique
- **[Architecture](docs/DOCUMENTATION_COMPLETE.md#architecture)** - Diagramme et stack tech
- **[Dépannage](docs/DOCUMENTATION_COMPLETE.md#dépannage)** - Résolution de problèmes

---

## 🎯 Fonctionnalités

### 👨‍🍳 Pour les Cuisiniers
- ✅ Proposer vos repas
- ✅ Gérer les réservations
- ✅ Voir les avis clients
- ✅ Communiquer avec les clients

### 👨‍💼 Pour les Clients
- ✅ Découvrir les repas du quartier
- ✅ Réserver des portions
- ✅ Payer en ligne
- ✅ Laisser des avis

### 📊 Pour les Administrateurs
- ✅ Dashboards en temps réel
- ✅ Monitoring des performances
- ✅ Gestion des utilisateurs
- ✅ Alertes automatiques

---

## 🛠️ Stack Technologique

```
Frontend        React 19 + TypeScript + TanStack Start
Styles          Tailwind CSS + shadcn-ui
Backend         Node.js 24 + TanStack Start
Database        PostgreSQL 16
Auth            Supabase
Monitoring      Prometheus + Grafana
Container       Docker + Docker Compose
Orchestration   Kubernetes
CI/CD           GitHub Actions
Deployment      Fly.io / AWS EKS / GKE / AKS
```

---

## 📦 Structure du Projet

```
CuisineEnsemble/
├── src/
│   ├── components/       # React components
│   ├── routes/          # Pages
│   ├── lib/
│   │   ├── metrics.ts   # Prometheus metrics
│   │   └── error-capture.ts
│   └── server.ts        # Server entry point
├── k8s/                 # Kubernetes manifests
│   ├── app.yaml
│   ├── infrastructure.yaml
│   ├── storage.yaml
│   └── secrets-rbac.yaml
├── monitoring/          # Prometheus config
│   ├── prometheus.yml
│   └── alerting-rules.yml
├── docs/               # Documentation
│   ├── DOCUMENTATION_COMPLETE.md
│   ├── GETTING_STARTED.md
│   ├── kubernetes-guide.md
│   └── GRAFANA_SETUP.md
├── scripts/            # Déploiement scripts
│   └── deploy-k8s.sh
├── Dockerfile          # Multi-stage build
├── docker-compose.yml  # Compose config
└── package.json        # Dependencies
```

---

## ⚡ Commandes Principales

### Développement

```bash
npm run dev              # Vite dev server (port 5173)
npm run build           # Build production
npm run preview         # Preview production build
npm run lint            # ESLint check
npm run format          # Prettier format
npm run test:unit       # Unit tests
npm run test:e2e        # E2E tests
npm run test:coverage   # Coverage report
```

### Docker

```bash
docker compose up -d                              # Start all services
docker compose logs -f app                        # App logs
docker compose exec postgres psql -U cuisineensemble  # PostgreSQL shell
```

### Kubernetes

```bash
./scripts/deploy-k8s.sh install                   # Deploy all
./scripts/deploy-k8s.sh status                    # Status
./scripts/deploy-k8s.sh logs app                  # App logs
./scripts/deploy-k8s.sh shell postgres            # PostgreSQL shell
./scripts/deploy-k8s.sh update                    # Update app
./scripts/deploy-k8s.sh delete                    # Remove all
```

---

## 🔐 Configuration de Sécurité

### Secrets à Configurer

```bash
# .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
POSTGRES_PASSWORD=secure-password
GRAFANA_PASSWORD=secure-password
```

### GitHub Secrets

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_PROJECT_REF
FLY_API_TOKEN
```

### Kubernetes Secrets

```bash
vi k8s/secrets-rbac.yaml
# Update with your values
./scripts/deploy-k8s.sh install
```

---

## 📊 Monitoring

### Dashboards

- **Application Metrics**: http://localhost:3001
  - Request Rate
  - Latency (P95/P99)
  - Error Rate
  - Memory Usage

### Endpoints

- `/metrics` - Prometheus metrics
- `/` - Application
- `http://localhost:9090` - Prometheus
- `http://localhost:3001` - Grafana

---

## 🚀 Déploiement

### Production Checklist

- [ ] Secrets configurés dans GitHub
- [ ] Variables GitHub configurées
- [ ] Dockerfile testé localement
- [ ] Tests passent (unit + E2E)
- [ ] Database backups configurés
- [ ] Monitoring en place
- [ ] SSL/TLS certificate

### Déployer sur Main

```bash
git checkout main
git merge develop
git push origin main

# Pipeline GitHub Actions va:
# 1. Valider (lint, tests, build)
# 2. Terraform plan
# 3. Attendre approval
# 4. Terraform apply
# 5. Deploy production
# 6. Vérifier
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Vérifier: `lsof -i :3000` ou changer port |
| App ne démarre | Vérifier Node.js: `node --version` (24+) |
| Docker error | Vérifier: `docker ps` |
| Grafana: pas de connection | Voir: [docs/GRAFANA_SETUP.md](docs/GRAFANA_SETUP.md) |
| Kubernetes pods pending | Vérifier: `kubectl describe pvc -n cuisineensemble` |
| Pipeline échoue | Voir: [docs/ci-cd-troubleshooting.md](docs/ci-cd-troubleshooting.md) |

---

## 📞 Support

### Documentation
- [DOCUMENTATION_COMPLETE.md](docs/DOCUMENTATION_COMPLETE.md) - Guide complet
- [GETTING_STARTED.md](docs/GETTING_STARTED.md) - Quick start
- [kubernetes-guide.md](docs/kubernetes-guide.md) - K8s deployment

### Logging

```bash
# Docker
docker compose logs -f [app|postgres|prometheus|grafana]

# Kubernetes
kubectl logs -n cuisineensemble -l app=[app|postgres|prometheus|grafana] -f
```

---

## 📋 Checklist de Configuration

### Semaine 1 - Setup Local
- [ ] Cloner le repo
- [ ] `npm install`
- [ ] `npm run dev` fonctionne
- [ ] Docker Compose up fonctionne
- [ ] Grafana accessible
- [ ] Prometheus fonctionne

### Semaine 2 - Production
- [ ] Secrets GitHub configurés
- [ ] Variables GitHub configurées
- [ ] Pipeline CI/CD passe
- [ ] Kubernetes déployé
- [ ] App accessible en production
- [ ] Monitoring en place

### Semaine 3 - Optimisation
- [ ] Backups configurés
- [ ] Alertes Slack/Email
- [ ] Performance tuning
- [ ] Security audit
- [ ] Documentation à jour

---

## 📄 License

MIT License - Voir [LICENSE](LICENSE)

---

## 👥 Équipe

**CuisineEnsemble Team**

- Architecture & Deployment
- DevOps & Monitoring
- Documentation

---

## 🙏 Remerciements

- [TanStack](https://tanstack.com/) - Router et Start
- [Supabase](https://supabase.com/) - Authentication
- [Prometheus](https://prometheus.io/) - Monitoring
- [Grafana](https://grafana.com/) - Dashboards
- [Docker](https://docker.com/) - Containerization
- [Kubernetes](https://kubernetes.io/) - Orchestration

---

**Prêt à commencer?** → [Guide de Démarrage](docs/GETTING_STARTED.md)

---

*Last Updated: 2025-07-12 | Version 1.0*
