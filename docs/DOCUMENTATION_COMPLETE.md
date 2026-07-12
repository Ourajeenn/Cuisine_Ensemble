# CuisineEnsemble - Documentation Technique Complète

## Table des Matières

1. [Guide Admin - Installation & Configuration](#guide-admin)
2. [Guide Utilisateur - Mode d'Emploi](#guide-utilisateur)
3. [Architecture Technique](#architecture)
4. [Dépannage](#dépannage)

---

# GUIDE ADMIN - Installation & Configuration

## 📋 Prérequis

### Système
- Windows 10/11, macOS 10.15+, ou Linux (Ubuntu 20.04+)
- 8GB RAM minimum (16GB recommandé)
- 20GB espace disque disponible
- Connexion internet stable

### Outils Requis

```bash
# Vérifier l'installation
node --version          # Node.js 24+
npm --version           # npm 10+
docker --version        # Docker 20.10+
docker-compose --version # Docker Compose 2.0+
git --version           # Git 2.30+
```

**Installation des outils:**

#### macOS (Homebrew)
```bash
brew install node docker git
brew install --cask docker
```

#### Windows (Chocolatey)
```powershell
choco install nodejs docker-desktop git -y
```

#### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install -y nodejs npm git docker.io docker-compose
sudo usermod -aG docker $USER
```

---

## 🚀 Installation Locale (Development)

### Étape 1: Cloner le Repo

```bash
git clone https://github.com/YOUR_USERNAME/CuisineEnsemble.git
cd CuisineEnsemble
```

### Étape 2: Configurer les Variables d'Environnement

```bash
# Créer fichier .env
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-key
NODE_ENV=development
EOF
```

### Étape 3: Installer les Dépendances

```bash
npm install
```

**Attendu:**
```
added 1234 packages in 2m
```

### Étape 4: Démarrer l'Application

```bash
npm run dev
```

**Attendu:**
```
  VITE v8.0.16  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Étape 5: Accéder à l'App

Ouvrez dans le navigateur: **http://localhost:5173**

---

## 🐳 Installation Docker Compose (Test/Production)

### Étape 1: Configurer les Secrets

```bash
# Éditer les fichiers de configuration
vi .env              # Variables d'app
vi docker-compose.yml  # Pour les données sensibles
```

**Fichier `.env` minimum:**
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-key
POSTGRES_USER=cuisineensemble
POSTGRES_PASSWORD=secure-password-change-me
```

### Étape 2: Démarrer la Stack

```bash
# Application + PostgreSQL
docker compose -f docker-compose.CuisineEnsemble.yml up -d

# Monitoring (dans un autre terminal)
docker compose -f docker-compose.monitoring.yml up -d
```

**Attendre 30 secondes que les services démarrent.**

### Étape 3: Vérifier l'État

```bash
# Voir les containers
docker compose ps

# Attendu:
# NAME                    SERVICE         STATUS
# cuisineensemble-app     app             Up 2 minutes
# postgres                postgres        Up 2 minutes
```

### Étape 4: Accéder aux Services

| Service | URL | Identifiant |
|---------|-----|-------------|
| App | http://localhost:3000 | - |
| Grafana | http://localhost:3001 | admin/admin |
| Prometheus | http://localhost:9090 | - |
| PostgreSQL | localhost:5432 | cuisineensemble/password |

---

## ☸️ Installation Kubernetes (Production)

### Prérequis Kubernetes

```bash
# Vérifier Kubernetes
kubectl version
kubectl get nodes

# Contexte actif
kubectl config current-context
```

**Contextes supportés:**
- `docker-desktop` (Docker Desktop)
- `minikube` (Minikube)
- `gke_PROJECT_ID_ZONE_CLUSTER` (Google GKE)
- `arn:aws:eks:...` (AWS EKS)
- `aks-...` (Azure AKS)

### Étape 1: Préparer les Secrets

```bash
# Éditer les secrets
vi k8s/secrets-rbac.yaml
```

**Modifier la section `data:`:**
```yaml
stringData:
  supabase-url: "https://votre-projet.supabase.co"
  supabase-anon-key: "votre-clé-anon-key"
  database-url: "postgresql://cuisineensemble:PASSWORD@postgres:5432/cuisineensemble"
```

### Étape 2: Créer les Répertoires (Local Only)

Pour Docker Desktop / Minikube avec stockage local:

```bash
# macOS / Linux
mkdir -p /mnt/data/postgres /mnt/data/prometheus /mnt/data/grafana

# Windows (Docker Desktop)
# Les répertoires sont créés automatiquement
```

### Étape 3: Déployer sur Kubernetes

```bash
# Rendre le script exécutable
chmod +x scripts/deploy-k8s.sh

# Déployer tous les ressources
./scripts/deploy-k8s.sh install
```

**Attendre 2-3 minutes que tous les pods démarrent.**

### Étape 4: Vérifier le Déploiement

```bash
./scripts/deploy-k8s.sh status
```

**Attendu:**
```
NAME                                READY   STATUS    RESTARTS   AGE
cuisineensemble-app-xxx-xxx         1/1     Running   0          2m
postgres-0                          1/1     Running   0          2m
prometheus-xxx-xxx                  1/1     Running   0          2m
grafana-xxx-xxx                     1/1     Running   0          2m
```

### Étape 5: Accéder aux Services (Port Forwarding)

```bash
# Terminal 1: App
kubectl port-forward -n cuisineensemble svc/cuisineensemble 3000:80

# Terminal 2: Grafana
kubectl port-forward -n cuisineensemble svc/grafana 3001:3000

# Terminal 3: Prometheus
kubectl port-forward -n cuisineensemble svc/prometheus 9090:9090
```

---

## ⚙️ Configuration GitHub Actions (CI/CD)

### Étape 1: Configurer les Secrets GitHub

1. Allez sur: `https://github.com/USERNAME/CuisineEnsemble/settings/secrets/actions`
2. Cliquer "New repository secret"
3. Ajouter:

| Secret | Valeur |
|--------|--------|
| `VITE_SUPABASE_URL` | https://votre-projet.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | votre-clé-anon-key |
| `SUPABASE_PROJECT_REF` | votre-project-ref |
| `FLY_API_TOKEN` | votre-token-fly.io (optionnel) |

### Étape 2: Configurer les Variables

1. Allez sur: `https://github.com/USERNAME/CuisineEnsemble/settings/variables`
2. Cliquer "New repository variable"
3. Ajouter:

| Variable | Valeur |
|----------|--------|
| `FLY_APP_FRONT` | cuisineensemble-front |
| `FLY_APP_BACK` | cuisineensemble-back |

### Étape 3: Tester le Pipeline

```bash
# Pousser un commit
git add .
git commit -m "chore: initial setup"
git push origin develop
```

Allez sur: `https://github.com/USERNAME/CuisineEnsemble/actions`

**Le pipeline doit:**
- ✅ Valider (lint, tests, build)
- ✅ Terraform plan
- ✅ Déployer TEST
- ✅ Vérifier TEST

---

## 🐛 Correction Grafana - Connexion

### Problème: Pas d'accès à Grafana

**Solution 1: Réinitialiser le mot de passe Grafana**

```bash
# Pour Docker Compose
docker compose exec grafana grafana-cli admin reset-admin-password admin

# Pour Kubernetes
kubectl exec -it -n cuisineensemble grafana-xxx-xxx -- \
  grafana-cli admin reset-admin-password admin
```

**Solution 2: Vérifier que Grafana tourne**

```bash
# Docker Compose
docker compose ps | grep grafana

# Kubernetes
kubectl get pods -n cuisineensemble -l app=grafana
```

**Solution 3: Port Forwarding (Kubernetes)**

```bash
# Vérifier le port-forward
kubectl port-forward -n cuisineensemble svc/grafana 3001:3000

# Accéder à: http://localhost:3001
# Identifiants: admin / admin
```

### Accès Grafana - Étapes Détaillées

1. **Ouvrir Grafana**
   - URL: http://localhost:3001 (Docker) ou http://localhost:3000 (K8s port-forward)
   
2. **Se Connecter**
   - Identifiant: `admin`
   - Mot de passe: `admin` (default) ou celui configuré

3. **Vérifier Prometheus**
   - Menu → Connections → Data sources
   - Cliquer "Prometheus"
   - Vérifier URL: `http://prometheus:9090` (K8s) ou `http://localhost:9090` (Docker)
   - Cliquer "Save & Test"
   - Attendre "datasource is working" ✅

4. **Voir le Dashboard**
   - Menu → Dashboards
   - Sélectionner "CuisineEnsemble - Application Metrics"

---

## 📊 Vérifier les Métriques

### Endpoint `/metrics`

```bash
# Vérifier que les métriques sont exposées
curl http://localhost:3000/metrics

# Attendu:
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/",status_code="200"} 5
```

### Prometheus

1. Allez à: http://localhost:9090
2. Graph tab
3. Taper: `http_requests_total`
4. Cliquer "Execute"
5. Voir les données ✅

---

## 🔧 Maintenance & Mise à Jour

### Mise à Jour de l'Application

```bash
# Développement
git pull origin develop
npm install
npm run dev

# Docker
git pull origin main
docker compose -f docker-compose.CuisineEnsemble.yml up -d --build

# Kubernetes
git pull origin main
./scripts/deploy-k8s.sh update
```

### Backups

```bash
# PostgreSQL
docker compose exec postgres pg_dump -U cuisineensemble -d cuisineensemble > backup.sql

# Restaurer
docker compose exec -T postgres psql -U cuisineensemble -d cuisineensemble < backup.sql
```

### Logs

```bash
# Docker Compose
docker compose logs -f app
docker compose logs -f postgres

# Kubernetes
kubectl logs -n cuisineensemble -l app=cuisineensemble -f
kubectl logs -n cuisineensemble -l app=postgres -f
```

---

# GUIDE UTILISATEUR - Mode d'Emploi

## 🎯 Qu'est-ce que CuisineEnsemble?

CuisineEnsemble est une **plateforme de partage de repas entre voisins**.

**Fonctionnalités principales:**
- 📱 Consulter les repas proposés par les voisins
- 🍽️ Réserver un repas
- 👨‍🍳 Proposer vos propres repas
- 💬 Communiquer avec d'autres utilisateurs
- ⭐ Noter et commenter les repas
- 📍 Voir les repas près de chez vous

---

## 👤 Créer un Compte

### Première Visite

1. Ouvrez: http://localhost:3000
2. Cliquer "S'inscrire" ou "Sign Up"
3. Entrer:
   - Email
   - Mot de passe (min 8 caractères)
   - Prénom
   - Localisation (adresse ou quartier)
4. Cliquer "Créer un compte"
5. Vérifier votre email (si authentification Supabase)

---

## 🔐 Se Connecter

1. Ouvrez: http://localhost:3000
2. Cliquer "Se Connecter" ou "Log In"
3. Entrer:
   - Email
   - Mot de passe
4. Cliquer "Connexion"
5. Vous êtes authentifié ✅

---

## 🍽️ Découvrir les Repas

### Page d'Accueil

- **Carte**: Voir les repas proposés près de chez vous
- **Filtres**: Par type de cuisine, prix, date
- **Tri**: Par distance, popularité, date

### Détails d'un Repas

Cliquer sur un repas pour voir:
- 📸 Photos du repas
- 👨‍🍳 Nom du cuisinier
- ⭐ Notes et avis
- 💰 Prix
- 🕐 Heure de service
- 📍 Localisation
- 📝 Description complète

---

## 📅 Réserver un Repas

1. Sélectionner un repas
2. Cliquer "Réserver"
3. Choisir la quantité (nombre de portions)
4. Ajouter des notes (allergies, préférences)
5. Cliquer "Confirmer la réservation"
6. Paiement (simulé en dev)
7. Reçu envoyé à votre email ✅

### Suivi de Réservation

- Mes Réservations → Voir l'état
- État possibles:
  - 🟡 En attente (En attente de confirmation du cuisinier)
  - 🟢 Confirmée (Cuisinier a accepté)
  - 🚚 Prête à être retirée
  - ✅ Complétée
  - ❌ Annulée

---

## 👨‍🍳 Proposer un Repas

### Créer une Annonce

1. Menu → "Proposer un repas"
2. Remplir:
   - **Nom du plat**: ex "Couscous maison"
   - **Description**: Ingrédients, préparation
   - **Type de cuisine**: Marocaine, Italienne, Française, etc.
   - **Prix par portion**: ex 10€
   - **Nombre de portions**: 5-20
   - **Date de service**: Aujourd'hui, demain, etc.
   - **Heure de service**: 12:00-13:00
   - **Localisation**: Votre adresse (masquée par défaut)
   - **Photo**: Uploader une image
   - **Allergènes**: Arachides, gluten, lactose, etc.

3. Cliquer "Publier l'annonce"
4. L'annonce est en ligne ✅

### Gérer les Réservations

1. Menu → "Mes annonces"
2. Voir les réservations reçues
3. Pour chaque réservation:
   - ✅ **Accepter**: Confirmer la commande
   - ❌ **Refuser**: Décliner poliment
   - 🚚 **Marquer comme prête**: Notifier le client

### Annuler une Annonce

1. Menu → "Mes annonces"
2. Cliquer les trois points (...)
3. "Annuler cette annonce"
4. Confirmer

---

## ⭐ Évaluer un Repas

Après avoir reçu votre repas:

1. Menu → "Mes réservations"
2. Cliquer sur le repas complété
3. Cliquer "Laisser un avis"
4. Donner une note (⭐⭐⭐⭐⭐)
5. Écrire un commentaire (optionnel)
6. Cliquer "Envoyer l'avis"

**Les avis aident les autres à trouver les meilleurs repas!**

---

## 💬 Communiquer

### Messages Privés

1. Cliquer sur le profil d'un cuisinier
2. Cliquer "Envoyer un message"
3. Taper votre message
4. Cliquer "Envoyer"

### Notes et Demandes Spéciales

- Lors de la réservation, ajouter des notes
- Exemple: "Je suis allergique aux cacahuètes"
- Le cuisinier en sera notifié

---

## 👤 Gérer Votre Profil

### Éditer Votre Profil

1. Menu → "Mon profil"
2. Cliquer "Éditer"
3. Modifier:
   - Photo de profil
   - Bio (présentation)
   - Localisation
   - Numéro de téléphone

4. Cliquer "Enregistrer"

### Préférences

1. Menu → "Paramètres"
2. Notifications:
   - [ ] Nouvelles réservations
   - [ ] Messages privés
   - [ ] Avis sur mes repas
3. Confidentialité:
   - [ ] Afficher mon profil publiquement
   - [ ] Masquer ma localisation
4. Cliquer "Enregistrer"

---

## ❓ FAQ Utilisateur

**Q: Comment sont traitées mes données personnelles?**
A: Vos données sont chiffrées et stockées sécurisément. Vous pouvez les supprimer à tout moment.

**Q: Que faire si un repas m'a rendu malade?**
A: Contactez immédiatement l'admin via le formulaire de contact. Nous enquêterons.

**Q: Puis-je annuler une réservation?**
A: Oui, tant qu'elle n'a pas été acceptée par le cuisinier. Sinon, contactez-le directement.

**Q: Comment fonctionnent les paiements?**
A: En développement, les paiements sont simulés. En production, nous utilisons Stripe (sécurisé).

**Q: Puis-je proposer des repas à titre gratuit?**
A: Oui, vous pouvez fixer le prix à 0€.

---

# ARCHITECTURE

## 📐 Diagramme Général

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)               │
│  ├─ Pages (Home, Browse, Reservations, MyDishes)      │
│  ├─ Components (Header, Cards, Forms)                 │
│  └─ Styles (Tailwind CSS, shadcn-ui)                  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────────┐
│            Backend (TanStack Start/Node.js)            │
│  ├─ API Routes (/api/meals, /api/reservations)       │
│  ├─ Authentication (Supabase)                         │
│  └─ Metrics (/metrics)                               │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
    ┌────────┐ ┌──────────┐ ┌──────────┐
    │PostgreSQL│ │Supabase  │ │Stripe API│
    │(Database)│ │(Auth)    │ │(Payments)│
    └────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────────────────────────┐
│                   Monitoring Stack                      │
│  Prometheus → Grafana (Dashboards)                     │
│  ├─ HTTP Requests Metrics                            │
│  ├─ Database Performance                             │
│  ├─ Error Rates                                      │
│  └─ System Resources                                 │
└─────────────────────────────────────────────────────────┘
```

## 🗄️ Stack Technologique

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, TanStack Router, Tailwind CSS, shadcn-ui |
| Build | Vite 8, TanStack Start |
| Backend | Node.js 24, TanStack Start |
| Database | PostgreSQL 16 |
| Auth | Supabase |
| Monitoring | Prometheus + Grafana |
| Container | Docker + Docker Compose |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Deployment | Fly.io, AWS EKS, Google GKE, Azure AKS |

---

# DÉPANNAGE

## ❌ L'app ne démarre pas

```bash
# Vérifier les logs
npm run dev

# Erreur commune: Port 5173 déjà utilisé
# Solution: Changer le port
npm run dev -- --port 3001
```

## ❌ Grafana: "Connexion refusée"

```bash
# Vérifier que Grafana tourne
docker compose ps | grep grafana

# Ou Kubernetes
kubectl get pods -n cuisineensemble -l app=grafana

# Redémarrer Grafana
docker compose restart grafana
# Ou K8s
kubectl rollout restart deployment/grafana -n cuisineensemble
```

## ❌ PostgreSQL: "Connexion refusée"

```bash
# Vérifier que PostgreSQL tourne
docker compose ps | grep postgres

# Vérifier les credentials dans .env
cat .env

# Tester la connexion
psql -h localhost -U cuisineensemble -d cuisineensemble
```

## ❌ Prometheus: "No data"

```bash
# Vérifier que l'app expose /metrics
curl http://localhost:3000/metrics

# Si vide, l'app ne démarre pas correctement
# Vérifier les logs de l'app
docker compose logs app
```

## ❌ Pipeline GitHub échoue

Allez sur: Actions tab → Voir le workflow

Chercher l'étape qui échoue et voir les logs

**Erreurs courantes:**
- Secrets manquants → Ajouter dans GitHub Settings
- Build échoue → Vérifier `npm run build` en local
- Tests échouent → `npm run test:unit -- --run`

---

## 📞 Support

**Documentation:**
- `docs/kubernetes-guide.md` - Kubernetes deployment
- `docs/ci-cd-troubleshooting.md` - CI/CD issues
- `docs/monitoring-guide.md` - Prometheus/Grafana
- `docs/GETTING_STARTED.md` - Quick start

**Commandes Utiles:**
```bash
./scripts/deploy-k8s.sh status          # Status K8s
./scripts/deploy-k8s.sh logs app        # Logs app
./scripts/deploy-k8s.sh shell postgres  # SSH into postgres
```

---

**Documentation créée le:** 2025-07-12
**Version:** 1.0
**Auteur:** CuisineEnsemble Team
