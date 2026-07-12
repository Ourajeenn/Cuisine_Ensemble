# Fly.io Deployment Guide for CuisineEnsemble

## 📋 Prérequis

1. **Compte Fly.io** - https://fly.io (gratuit pour commencer)
2. **Fly CLI installée**
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   iwr https://fly.io/install.ps1 -useb | iex
   ```

3. **Authentification Fly.io**
   ```bash
   flyctl auth login
   # Suivre les instructions
   ```

4. **Secrets configurés localement**
   ```bash
   cat > .env << 'EOF'
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-clé-anon-key
   DATABASE_URL=postgresql://...
   EOF
   ```

---

## 🚀 Déploiement sur Fly.io

### Étape 1: Créer l'Application Fly

```bash
cd CuisineEnsemble

# Créer une nouvelle app (remplacer par votre nom unique)
flyctl launch --name cuisineensemble-app

# Ou si l'app existe déjà
flyctl apps list
flyctl deploy
```

**Questions lors de `flyctl launch`:**
```
? Would you like to set up a Postgresql database now? Yes
? Select a Postgresql version 15
? Select regions Sydney (syd) - us-west (primary), Sydney (syd), Tokyo (nrt)
? Scale of Postgresql: Development (shared-cpu-1x 256MB RAM)
? Would you like to set up an Upstash Redis cache now? No
? Do you want to deploy now? No (on va configurer d'abord)
```

### Étape 2: Configurer fly.toml

Le fichier `fly.toml` a été créé automatiquement. Vérifiez/mettez à jour:

```toml
app = "cuisineensemble-app"
primary_region = "syd"

[build]
dockerfile = "Dockerfile"

[env]
NODE_ENV = "production"

[http_service]
internal_port = 3000
force_https = true
auto_stop_machines = true
auto_start_machines = true

[[services]]
protocol = "tcp"
internal_port = 3000

[services.concurrency]
type = "requests"
hard_limit = 1000
soft_limit = 200

[services.tcp_checks]
grace_period = "30s"
interval = "15s"
timeout = "10s"

[metrics]
port = 3000
path = "/metrics"

[[statics]]
guest_path = "/app/dist/public"
url_path = "/static"
```

### Étape 3: Configurer les Secrets

```bash
# Ajouter les secrets Fly
flyctl secrets set \
  VITE_SUPABASE_URL="https://votre-projet.supabase.co" \
  VITE_SUPABASE_ANON_KEY="votre-clé-anon-key" \
  DATABASE_URL="postgresql://..." \
  NODE_ENV="production"

# Vérifier les secrets
flyctl secrets list
```

### Étape 4: Configurer PostgreSQL Fly

```bash
# Créer une DB (si pas déjà faite)
flyctl postgres create
# Ou connecter une DB existante
flyctl postgres attach DATABASE_NAME

# Vérifier la connexion
flyctl postgres connect -a cuisineensemble-app
```

### Étape 5: Déployer l'Application

```bash
# Déploiement initial
flyctl deploy --local-only

# Ou avec buildpack (sans Docker)
flyctl deploy --no-cache

# Suivre le déploiement
flyctl logs -a cuisineensemble-app
```

### Étape 6: Vérifier le Déploiement

```bash
# Status
flyctl status -a cuisineensemble-app

# Logs
flyctl logs -a cuisineensemble-app

# Accéder à l'app
# URL: https://cuisineensemble-app.fly.dev

# SSH dans la machine
flyctl ssh console -a cuisineensemble-app
```

---

## 🐳 Configuration Docker pour Fly.io

Le `Dockerfile` existant fonctionne, mais peut être optimisé:

```dockerfile
# Multi-stage build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server/server.js"]
```

✅ Déjà configuré dans le projet!

---

## 📊 Monitoring sur Fly.io

### Fly Dashboard
```bash
# Ouvrir le dashboard
flyctl open -a cuisineensemble-app

# Ou directement: https://fly.io/apps/cuisineensemble-app
```

### Logs en Temps Réel
```bash
flyctl logs -a cuisineensemble-app --follow
```

### Metrics Prometheus
```bash
# Fly expose automatiquement les métriques
# URL: https://cuisineensemble-app.fly.dev/metrics
curl https://cuisineensemble-app.fly.dev/metrics
```

### Setup Grafana Monitoring
```bash
# 1. Ajouter Fly.io comme datasource Prometheus
# Dans Grafana: Connections → Data sources → Add
# Type: Prometheus
# URL: https://your-prometheus-instance/

# 2. Ou utiliser Fly's built-in monitoring
# Via dashboard Fly.io
```

---

## 🔄 Déploiement Continu (CI/CD)

### GitHub Actions → Fly.io

Ajouter le workflow:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy app on Fly.io
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Build app
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: |
          npm ci
          npm run build

      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions@master
        with:
          args: "deploy --local-only"
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**Ajouter FLY_API_TOKEN à GitHub:**
```bash
# Générer un token
flyctl auth token

# Ajouter à GitHub Secrets
# Settings → Secrets and variables → Actions → New secret
# Name: FLY_API_TOKEN
# Value: (token généré)
```

---

## 🔒 Configuration de Sécurité

### HTTPS Automatique
✅ Fly.io configure HTTPS automatiquement

### Domaine Personnalisé
```bash
# Ajouter un domaine
flyctl certs add cuisineensemble.com -a cuisineensemble-app

# Vérifier
flyctl certs list -a cuisineensemble-app
```

### Variables d'Environnement Sécurisées
```bash
# Ajouter des secrets (chiffrés)
flyctl secrets set SUPER_SECRET_KEY="value"

# Lister
flyctl secrets list

# Supprimer
flyctl secrets unset SUPER_SECRET_KEY
```

---

## 📈 Scaling sur Fly.io

### Augmenter les Ressources

```bash
# Voir la config actuelle
flyctl scale show -a cuisineensemble-app

# Augmenter le CPU/RAM
flyctl scale vm shared-cpu-2x -a cuisineensemble-app
# Options: shared-cpu-1x, shared-cpu-2x, shared-cpu-4x, dedicated-cpu-1x, etc.

# Augmenter les replicas (instances)
flyctl scale count 3 -a cuisineensemble-app
# Min 1, max 10 (free tier: max 3)
```

### Auto-Scaling
```bash
# Ajouter auto-scaling (requires paid plan)
flyctl autoscale set --min=2 --max=5 -a cuisineensemble-app
```

---

## 🗄️ Base de Données Fly PostgreSQL

### Accéder à la DB

```bash
# Se connecter
flyctl postgres connect -a DATABASE_APP_NAME

# Ou via psql
flyctl postgres connect DATABASE_APP_NAME -- psql -c "SELECT 1"
```

### Backups

```bash
# Créer un backup
flyctl postgres backup create -a DATABASE_APP_NAME

# Lister les backups
flyctl postgres backups list -a DATABASE_APP_NAME

# Restaurer
flyctl postgres restore DATABASE_APP_NAME --backup-id BACKUP_ID
```

### Migration

```bash
# Exporter la DB locale
pg_dump -h localhost -U cuisineensemble -d cuisineensemble > backup.sql

# Importer dans Fly
flyctl postgres import -a DATABASE_APP_NAME < backup.sql
```

---

## 🚨 Troubleshooting

### App ne démarre pas

```bash
# Vérifier les logs
flyctl logs -a cuisineensemble-app

# Chercher les erreurs comme:
# - "ENOTFOUND" = problème de DNS
# - "ECONNREFUSED" = DB non accessible
# - "Cannot find module" = dépendances manquantes
```

**Solutions:**

```bash
# Reconstruire l'image
flyctl deploy --no-cache

# Vérifier les secrets
flyctl secrets list

# Redémarrer l'app
flyctl apps restart cuisineensemble-app
```

### Problèmes de Connexion à la DB

```bash
# Vérifier que la DB est attachée
flyctl postgres list

# Rattacher si nécessaire
flyctl postgres attach DATABASE_NAME -a cuisineensemble-app

# Vérifier DATABASE_URL
flyctl secrets list
```

### Problèmes de Performances

```bash
# Voir les metrics
flyctl status -a cuisineensemble-app

# Augmenter les ressources
flyctl scale vm shared-cpu-2x -a cuisineensemble-app

# Ajouter des replicas
flyctl scale count 3 -a cuisineensemble-app
```

---

## 📞 Commandes Utiles Fly.io

```bash
# Status général
flyctl status -a cuisineensemble-app

# Logs
flyctl logs -a cuisineensemble-app -f

# SSH
flyctl ssh console -a cuisineensemble-app

# Redémarrer
flyctl apps restart cuisineensemble-app

# Supprimer l'app
flyctl apps destroy cuisineensemble-app

# Liste des apps
flyctl apps list

# Informations détaillées
flyctl info -a cuisineensemble-app

# Ouvrir dans le navigateur
flyctl open -a cuisineensemble-app
```

---

## 🎯 Checklist Fly.io

- [ ] Fly CLI installée et authentifiée
- [ ] App créée: `flyctl launch`
- [ ] PostgreSQL attachée
- [ ] Secrets configurés: `flyctl secrets set ...`
- [ ] Dockerfile validé
- [ ] Deploy initial: `flyctl deploy`
- [ ] Vérifier les logs: `flyctl logs -a ...`
- [ ] App accessible: https://cuisineensemble-app.fly.dev
- [ ] Database connectée et fonctionnelle
- [ ] Monitoring configuré (optionnel)
- [ ] Domaine personnalisé (optionnel)
- [ ] GitHub Actions CI/CD (optionnel)

---

## 📚 Ressources Fly.io

- [Fly.io Docs](https://fly.io/docs/)
- [Deploying Node.js Apps](https://fly.io/docs/languages-and-frameworks/nodejs/)
- [Postgresql on Fly](https://fly.io/docs/postgres/)
- [CLI Reference](https://fly.io/docs/flyctl/deploy/)

---

## 💰 Pricing

**Free Tier:**
- ✅ 1 app gratuite
- ✅ 3 shared-cpu-1x instances
- ✅ 3GB persistent volume
- ✅ PostgreSQL 1 instance gratuite
- ✅ Metrics et monitoring

**Pricing au-delà:**
- Shared CPU: $0.0070/hour
- Dedicated CPU: $0.0335/hour
- RAM: $0.0015/GB/hour
- Data transfer: $0.02/GB
- PostgreSQL: $0.0073/hour (shared)

---

**Créé le:** 2025-07-12
**Version:** 1.0
**Status:** Ready for Production
