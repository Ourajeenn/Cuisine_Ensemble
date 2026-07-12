# CuisineEnsemble - Plan d'Action Complet

## 📊 État Actuel du Projet

### ✅ Déjà Fait
- [x] Application React/TanStack Start configurée
- [x] Monitoring (Prometheus + Grafana) configuré
- [x] Métriques exposées sur `/metrics`
- [x] Docker Compose pour dev/test/prod
- [x] Kubernetes manifests avec volumes
- [x] CI/CD GitHub Actions corrigé
- [x] Documentation complète

### 🎯 À Faire Maintenant (Priorités)

---

## ÉTAPE 1: Démarrage Local (Facile - 15 min)

### 1.1 Vérifier que tout fonctionne localement

```bash
# Terminal 1: App en développement
cd CuisineEnsemble
npm install
npm run dev
# → http://localhost:5173 (dev server Vite)

# Terminal 2: Monitoring
docker compose -f docker-compose.monitoring.yml up -d
# → Grafana: http://localhost:3001
# → Prometheus: http://localhost:9090
```

**Vérifier:**
- [ ] App affichée sur http://localhost:5173
- [ ] Grafana accessible http://localhost:3001 (admin/admin)
- [ ] Prometheus accessible http://localhost:9090
- [ ] Endpoint `/metrics` retourne des données

### 1.2 Accéder à Grafana

```bash
# Allez à: http://localhost:3001
# Identifiants: admin / admin
# → Connections → Data sources → Prometheus (cliquer)
# → Save & Test (doit afficher "datasource is working")
```

---

## ÉTAPE 2: Configurer GitHub Secrets (Important - 10 min)

### 2.1 Aller sur GitHub

1. Ouvrez: https://github.com/YOUR_USERNAME/CuisineEnsemble
2. Settings → Secrets and variables → Actions

### 2.2 Ajouter les Secrets

Cliquer "New repository secret" pour chaque:

```
VITE_SUPABASE_URL
→ https://votre-projet.supabase.co

VITE_SUPABASE_ANON_KEY
→ votre-clé-anon-key

SUPABASE_PROJECT_REF
→ votre-project-ref

FLY_API_TOKEN
→ votre-token-fly.io
```

### 2.3 Ajouter les Variables

Cliquer "New repository variable" pour chaque:

```
FLY_APP_FRONT = cuisineensemble-front
FLY_APP_BACK = cuisineensemble-back
```

**Vérifier:**
- [ ] 4 secrets configurés
- [ ] 2 variables configurées

---

## ÉTAPE 3: Tester le Pipeline CI (15 min)

### 3.1 Faire un commit

```bash
git add .
git commit -m "chore: configure monitoring and k8s"
git push origin develop
```

### 3.2 Vérifier le Pipeline

1. Allez sur: https://github.com/YOUR_USERNAME/CuisineEnsemble/actions
2. Voir le workflow "CuisineEnsemble CI/CD" tourner
3. Attendre que tous les stages passent (validate → terraform → test)

**Vérifier:**
- [ ] ✅ Validate stage (lint, tests, build, docker)
- [ ] ✅ Terraform plan stage
- [ ] ✅ Deploy TEST stage
- [ ] ✅ Verify TEST stage

---

## ÉTAPE 4: Déployer sur Kubernetes (30 min)

### 4.1 Vérifier Kubernetes

```bash
kubectl version
kubectl get nodes
```

### 4.2 Éditer Configuration Kubernetes

```bash
# 1. Mettre à jour les secrets
vi CuisineEnsemble/k8s/secrets-rbac.yaml

# Remplir:
# - supabase-url
# - supabase-anon-key
# - database-url
# - postgres password
# - grafana password
```

### 4.3 Créer les Répertoires (Local Only)

```bash
mkdir -p /mnt/data/postgres
mkdir -p /mnt/data/prometheus
mkdir -p /mnt/data/grafana
```

### 4.4 Déployer

```bash
cd CuisineEnsemble
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh install
```

### 4.5 Vérifier le Déploiement

```bash
./scripts/deploy-k8s.sh status
```

Attendre que tous les pods soient `Running`:
```
NAME                                READY   STATUS    RESTARTS   AGE
cuisineensemble-app-xxx-xxx         1/1     Running   0          1m
postgres-0                          1/1     Running   0          1m
prometheus-xxx-xxx                  1/1     Running   0          1m
grafana-xxx-xxx                     1/1     Running   0          1m
```

**Vérifier:**
- [ ] Tous les pods en "Running"

---

## ÉTAPE 5: Accéder à l'App Kubernetes (10 min)

### 5.1 Port Forwarding

```bash
# Terminal 1: App
kubectl port-forward -n cuisineensemble svc/cuisineensemble 3000:80

# Terminal 2: Grafana
kubectl port-forward -n cuisineensemble svc/grafana 3000:3000

# Terminal 3: Prometheus
kubectl port-forward -n cuisineensemble svc/prometheus 9090:9090
```

### 5.2 Accéder aux Services

- **App**: http://localhost:3000
- **Grafana**: http://localhost:3000 (admin/grafana-secure-password-change-me)
- **Prometheus**: http://localhost:9090

**Vérifier:**
- [ ] App affichée
- [ ] Grafana accessible
- [ ] Prometheus accessible

---

## ÉTAPE 6: Vérifier le Monitoring (10 min)

### 6.1 Dans Grafana

1. Allez à: http://localhost:3000
2. Identifiants: admin / (votre password)
3. Dashboards → Application Metrics

Vérifier les graphiques:
- [ ] Request Rate
- [ ] Request Latency
- [ ] Memory Usage
- [ ] Application Errors

### 6.2 Dans Prometheus

1. Allez à: http://localhost:9090
2. Graph tab
3. Chercher: `http_requests_total`
4. Exécuter

Vérifier les résultats:
- [ ] Données apparaissent
- [ ] Status: "Success"

---

## ÉTAPE 7: Configurer Production (Optional - 30 min)

### 7.1 Push vers Main

```bash
git checkout main
git merge develop
git push origin main
```

Pipeline va:
1. Valider (lint, tests, build)
2. Terraform plan
3. **Attendre approval** (Settings → Environments → production)
4. Terraform apply (infrastructure)
5. Deploy production (docker compose)

### 7.2 Approuver le Déploiement

1. Actions tab
2. Cliquer sur workflow run
3. Cliquer "Review deployments"
4. Sélectionner "production"
5. Cliquer "Approve and deploy"

---

## 📋 Checklist Complète

### Semaine 1 - Setup
- [ ] Étape 1: Local fonctionne
- [ ] Étape 2: GitHub secrets configurés
- [ ] Étape 3: Pipeline CI passe
- [ ] Étape 4: K8s déployé
- [ ] Étape 5: App accessible
- [ ] Étape 6: Monitoring fonctionne

### Semaine 2 - Production
- [ ] Étape 7: Production setup
- [ ] Configurer domaine DNS
- [ ] SSL/TLS certificate
- [ ] Ingress controller
- [ ] Load balancer

### Semaine 3 - Optimisation
- [ ] Configurer backups
- [ ] Setup logging centralisé
- [ ] Alertes email/Slack
- [ ] Performance testing
- [ ] Security audit

---

## 🆘 Aide par Problème

### L'app ne démarre pas
```bash
# Vérifier les logs
npm run dev

# Si erreur node_modules:
rm -rf node_modules package-lock.json
npm install
```

### Grafana ne se connecte pas à Prometheus
```bash
# Grafana: Settings → Data sources → Prometheus
# URL doit être: http://prometheus:9090 (dans K8s)
# Ou: http://localhost:9090 (port-forward)
```

### Pipeline GitHub échoue
```bash
# Voir les logs: Actions tab → workflow run → job
# Copier l'erreur
# Consulter: docs/ci-cd-troubleshooting.md
```

### K8s pods ne démarrent pas
```bash
./scripts/deploy-k8s.sh status
./scripts/deploy-k8s.sh logs app
# Vérifier: docs/kubernetes-guide.md → Troubleshooting
```

### Port déjà utilisé
```bash
# Changer le port du port-forward:
kubectl port-forward -n cuisineensemble svc/grafana 3001:3000
# → http://localhost:3001
```

---

## 🎯 Prochaines Tâches (Après Completion)

### Court Terme (Cette semaine)
1. ✅ Tester localement
2. ✅ Configurer CI/CD
3. ✅ Déployer sur K8s
4. ⚠️ Mettre en cache les images Docker
5. ⚠️ Optimiser les ressources

### Moyen Terme (Ce mois)
1. Configurer production
2. Domaine + SSL
3. Backups automatiques
4. Monitoring avancé (alertes)
5. Logging centralisé

### Long Terme (Roadmap)
1. Multi-région
2. Auto-scaling avancé
3. Disaster recovery
4. Performance optimization
5. Security hardening

---

## 📞 Besoin d'Aide?

### Voir la Documentation
- `docs/kubernetes-guide.md` - Setup K8s
- `docs/ci-cd-troubleshooting.md` - Pipeline issues
- `docs/monitoring-guide.md` - Prometheus/Grafana
- `docs/ci-cd-fixes.md` - Pipeline corrections

### Commandes Utiles

```bash
# Status général
./scripts/deploy-k8s.sh status

# Logs spécifiques
./scripts/deploy-k8s.sh logs app
./scripts/deploy-k8s.sh logs prometheus
./scripts/deploy-k8s.sh logs postgres
./scripts/deploy-k8s.sh logs grafana

# Shell interactif
./scripts/deploy-k8s.sh shell postgres
./scripts/deploy-k8s.sh shell app

# Mettre à jour l'app
./scripts/deploy-k8s.sh update

# Tout supprimer
./scripts/deploy-k8s.sh delete
```

---

## 🚀 Commencez par l'ÉTAPE 1!

Allez-y étape par étape. Chaque étape prend 10-30 minutes.
