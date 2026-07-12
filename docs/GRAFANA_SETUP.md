# Grafana - Guide de Configuration

## 🔧 Réinitialiser le Mot de Passe Grafana

### Docker Compose

```bash
# Réinitialiser le password admin à "admin"
docker compose exec grafana grafana-cli admin reset-admin-password admin

# Vérifier
docker compose logs grafana | tail -20
```

### Kubernetes

```bash
# Trouver le pod Grafana
kubectl get pods -n cuisineensemble -l app=grafana

# Réinitialiser le password
kubectl exec -it -n cuisineensemble grafana-XXXXX -- \
  grafana-cli admin reset-admin-password admin
```

---

## 📱 Accès Initial

### Docker Compose
```
URL: http://localhost:3001
User: admin
Password: admin (ou celui configuré)
```

### Kubernetes (Port Forward)
```bash
kubectl port-forward -n cuisineensemble svc/grafana 3001:3000
```

Puis:
```
URL: http://localhost:3001
User: admin
Password: admin (ou celui configuré)
```

---

## ✅ Configuration Prometheus

1. **Ouvrir Grafana** → http://localhost:3001

2. **Aller à: Settings → Data sources**

3. **Cliquer "Add data source"**

4. **Sélectionner "Prometheus"**

5. **Remplir:**
   - **Name**: Prometheus
   - **URL**: `http://prometheus:9090` (K8s/Docker)
   - **Access**: Proxy
   - **Scrape interval**: 15s

6. **Cliquer "Save & Test"**

7. **Attendre: "datasource is working"** ✅

---

## 📊 Voir les Dashboards

1. **Aller à: Home → Dashboards**

2. **Sélectionner: "CuisineEnsemble - Application Metrics"**

3. **Voir les graphiques:**
   - Request Rate
   - Request Latency
   - Memory Usage
   - Application Errors

---

## 🔑 Changer le Password

1. **Aller à: Profile (coin supérieur droit)**

2. **Cliquer "Change Password"**

3. **Entrer:**
   - Current password
   - New password
   - Confirm password

4. **Cliquer "Change Password"**

---

## 🚨 Troubleshooting Grafana

| Problème | Solution |
|----------|----------|
| "Connexion refusée" | Vérifier que Grafana tourne: `docker compose ps grafana` |
| "Password incorrect" | Réinitialiser: `docker compose exec grafana grafana-cli admin reset-admin-password admin` |
| "No data" | Vérifier Prometheus data source → Save & Test |
| "Blank page" | Attendre 30s, recharger, vérifier les logs |
| "Timeout" | Attendre que l'app démarre, puis recharger |

---

## 📍 Port Forwarding Kubernetes

```bash
# Terminal séparé
kubectl port-forward -n cuisineensemble svc/grafana 3001:3000

# Puis accéder à http://localhost:3001
```

Garder ce terminal ouvert pendant que vous utilisez Grafana.

---

## 🎯 À Faire Après

1. ✅ Connexion à Grafana
2. ✅ Ajouter datasource Prometheus
3. ✅ Voir le dashboard
4. ✅ Consulter les métriques en direct

**Prochaine étape:** Voir `DOCUMENTATION_COMPLETE.md`
