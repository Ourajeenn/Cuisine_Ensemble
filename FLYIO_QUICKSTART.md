# 🚀 Fly.io Quick Start - CuisineEnsemble

## En 5 Étapes

### 1️⃣ Installer Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows
iwr https://fly.io/install.ps1 -useb | iex

# Vérifier
flyctl version
```

### 2️⃣ Se Connecter

```bash
flyctl auth login
# Suivre les instructions et créer un compte
```

### 3️⃣ Créer l'App

```bash
cd CuisineEnsemble
flyctl launch

# Questions (répondre):
# App name: cuisineensemble-app (ou votre nom)
# PostgreSQL database: Yes
# Postgres version: 15
# Region: Sydney (syd) ou votre région
# Postgres scale: Development
# Deploy now: No (on va configurer d'abord)
```

### 4️⃣ Configurer les Secrets

```bash
# Remplacer par vos vraies valeurs
flyctl secrets set \
  VITE_SUPABASE_URL="https://votre-projet.supabase.co" \
  VITE_SUPABASE_ANON_KEY="votre-clé-anon-key" \
  DATABASE_URL="postgresql://user:pass@host/db"
```

### 5️⃣ Déployer

```bash
flyctl deploy

# Attendre 1-2 minutes...
# Puis accéder à: https://cuisineensemble-app.fly.dev ✅
```

---

## 📊 Vérifier le Déploiement

```bash
# Status
flyctl status

# Logs
flyctl logs

# Ouvrir dans le navigateur
flyctl open

# Accéder à l'app
https://cuisineensemble-app.fly.dev
```

---

## 🔄 Déploiement Continu (GitHub Actions)

### Configurer GitHub Secrets

1. Allez sur GitHub: Settings → Secrets and variables → Actions
2. Ajouter:
   - `FLY_API_TOKEN` (générer: `flyctl auth token`)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. À partir de maintenant, chaque `git push origin main` sera auto-déployé! 🎉

---

## 📚 Documentation Complète

Voir: [docs/FLYIO_DEPLOYMENT.md](FLYIO_DEPLOYMENT.md)

Topics couverts:
- Configuration détaillée
- PostgreSQL sur Fly
- Scaling et auto-scaling
- Monitoring
- Domaine personnalisé
- Troubleshooting

---

## ✨ Résultat

✅ App déployée sur Fly.io  
✅ PostgreSQL automatique  
✅ HTTPS gratuit  
✅ Monitoring inclus  
✅ CI/CD automatique  
✅ Scaling simple  

**C'est tout!** Vous êtes en production! 🚀

---

**Plus de help:** [docs/FLYIO_DEPLOYMENT.md](FLYIO_DEPLOYMENT.md)
