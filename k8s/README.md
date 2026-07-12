# CuisineEnsemble on Kubernetes

Déployement complet de CuisineEnsemble sur Kubernetes avec volumes persistants, monitoring et auto-scaling.

## 📋 Fichiers Créés

| Fichier | Purpose |
|---------|---------|
| `k8s/storage.yaml` | PersistentVolumes & PersistentVolumeClaims |
| `k8s/configmaps.yaml` | Prometheus, Grafana configuration |
| `k8s/secrets-rbac.yaml` | Secrets, ServiceAccounts, RBAC |
| `k8s/infrastructure.yaml` | PostgreSQL, Prometheus, Grafana |
| `k8s/app.yaml` | CuisineEnsemble App, HPA, NetworkPolicy |
| `k8s/kustomization.yaml` | Kustomize overlay management |
| `scripts/deploy-k8s.sh` | Déploiement et gestion du cluster |
| `docs/kubernetes-guide.md` | Guide complet |
| `.env.k8s.example` | Template variables d'environnement |

## 🚀 Déploiement Rapide

### 1. Vérifier Kubernetes
```bash
kubectl version
kubectl get nodes
```

### 2. Configurer Secrets
```bash
cp .env.k8s.example .env.k8s
# Éditer .env.k8s avec vos valeurs
```

### 3. Mettre à Jour k8s/secrets-rbac.yaml
```yaml
# Éditer les valeurs dans la section `data:`
supabase-url: "https://your-project.supabase.co"
supabase-anon-key: "your-key"
database-url: "postgresql://..."
```

### 4. Déployer
```bash
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh install
```

### 5. Vérifier le Statut
```bash
./scripts/deploy-k8s.sh status
```

## 🎯 Services Déployés

```
Namespace: cuisineensemble

Deployments:
  - cuisineensemble-app (3+ replicas avec HPA)
  - prometheus
  - grafana

StatefulSets:
  - postgres

Services:
  - cuisineensemble (ClusterIP)
  - cuisineensemble-nodeport (NodePort :30080)
  - postgres (Headless)
  - prometheus
  - grafana

Volumes Persistants:
  - postgres-pvc (10Gi)
  - prometheus-pvc (20Gi)
  - grafana-pvc (5Gi)
```

## 📊 Accéder aux Services

### Port Forwarding (Dev)
```bash
# App
kubectl port-forward -n cuisineensemble svc/cuisineensemble 3000:80

# Grafana
kubectl port-forward -n cuisineensemble svc/grafana 3000:3000

# Prometheus  
kubectl port-forward -n cuisineensemble svc/prometheus 9090:9090
```

### NodePort (si disponible)
- App: http://localhost:30080

## 🔧 Commandes Utiles

```bash
# Statut
./scripts/deploy-k8s.sh status

# Logs
./scripts/deploy-k8s.sh logs app
./scripts/deploy-k8s.sh logs prometheus

# Shell
./scripts/deploy-k8s.sh shell postgres
./scripts/deploy-k8s.sh shell app

# Mise à jour app
./scripts/deploy-k8s.sh update

# Suppression
./scripts/deploy-k8s.sh delete
```

## 🔒 Configuration de Sécurité

- Network Policies activées
- RBAC configuré pour Prometheus
- Secrets pour les données sensibles
- Resource limits sur tous les pods

## 🎯 Auto-Scaling (HPA)

L'app automatiquement scale entre 3-10 replicas selon:
- CPU > 70%
- Memory > 80%

## 📖 Documentation Complète

Voir `docs/kubernetes-guide.md` pour:
- Architecture détaillée
- Troubleshooting
- Configuration avancée
- Production setup
- Migration depuis Docker Compose

## ⚠️ Notes Importantes

1. **Stockage Local**: Par défaut utilise local-provisioner
   - Pour cloud (AWS/Azure/GCP): modifier `storage.yaml`

2. **Secrets**: Base64 encodés, pas chiffrés
   - Pour production: utiliser `sealed-secrets` ou `external-secrets`

3. **Image**: Update `k8s/app.yaml` avec votre registry
   ```yaml
   image: gcr.io/your-project/cuisineensemble:latest
   ```

4. **Ressources**: Ajuster limits selon votre cluster
   - k8s/infrastructure.yaml
   - k8s/app.yaml

## 🚨 Troubleshooting

```bash
# Vérifier PVCs
kubectl get pvc -n cuisineensemble

# Vérifier Pods
kubectl get pods -n cuisineensemble -w

# Logs détaillés
kubectl logs -n cuisineensemble -l app=cuisineensemble --tail=100

# Décrire Pod
kubectl describe pod -n cuisineensemble <pod-name>

# Events du cluster
kubectl get events -n cuisineensemble
```

## 📚 Références

- [Kubernetes Docs](https://kubernetes.io/)
- [Kustomize](https://kustomize.io/)
- [Helm Alternative](https://helm.sh/)
