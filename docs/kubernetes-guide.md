# Kubernetes Deployment Guide for CuisineEnsemble

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           CuisineEnsemble Namespace                 │  │
│  │                                                     │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │          Application (3 replicas)            │ │  │
│  │  │  ├─ Pod 1 (cuisineensemble-app)             │ │  │
│  │  │  ├─ Pod 2 (cuisineensemble-app)             │ │  │
│  │  │  └─ Pod 3 (cuisineensemble-app)             │ │  │
│  │  │  └─ HPA (scale 3-10 replicas)               │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                          ↓                          │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │      Infrastructure Layer                    │ │  │
│  │  │  ├─ PostgreSQL (StatefulSet)                │ │  │
│  │  │  ├─ Prometheus (Deployment)                 │ │  │
│  │  │  └─ Grafana (Deployment)                    │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                          ↓                          │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │      Persistent Storage (PVCs)               │ │  │
│  │  │  ├─ postgres-pvc (10Gi)                      │ │  │
│  │  │  ├─ prometheus-pvc (20Gi)                    │ │  │
│  │  │  └─ grafana-pvc (5Gi)                        │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Kubernetes cluster (minikube, Docker Desktop, EKS, GKE, AKS, etc.)
- kubectl CLI installed and configured
- At least 4GB RAM allocated to Kubernetes

### 1. Verify Setup
```bash
kubectl version
kubectl get nodes
kubectl config current-context
```

### 2. Update Configuration
**Edit secrets before deploying:**

```bash
# Edit k8s/secrets-rbac.yaml
# - Change supabase-url
# - Change supabase-anon-key
# - Change database-url (PostgreSQL connection string)
# - Change postgres password
# - Change grafana password
```

### 3. Create Storage Directories (Local Only)
```bash
# For local Kubernetes (Docker Desktop, minikube)
mkdir -p /mnt/data/postgres
mkdir -p /mnt/data/prometheus
mkdir -p /mnt/data/grafana

# On Docker Desktop for Mac/Windows:
# Use: /var/lib/docker/volumes/kubernetes.io~local-provisioner/pv-provisioner/
```

### 4. Deploy
```bash
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh install
```

### 5. Check Status
```bash
./scripts/deploy-k8s.sh status
```

### 6. Access Services

#### Option A: Port Forwarding (Development)
```bash
# App
kubectl port-forward -n cuisineensemble svc/cuisineensemble 3000:80

# Grafana
kubectl port-forward -n cuisineensemble svc/grafana 3000:3000

# Prometheus
kubectl port-forward -n cuisineensemble svc/prometheus 9090:9090
```

Then access:
- App: http://localhost:3000
- Grafana: http://localhost:3000 (admin/grafana-secure-password-change-me)
- Prometheus: http://localhost:9090

#### Option B: LoadBalancer Service (Cloud)
```bash
# Edit k8s/app.yaml - change service type to LoadBalancer
kubectl patch service cuisineensemble-nodeport -n cuisineensemble -p '{"spec": {"type": "LoadBalancer"}}'

# Get external IP
kubectl get svc -n cuisineensemble
```

---

## 📁 File Structure

```
k8s/
├── storage.yaml              # PersistentVolumes & Claims
├── configmaps.yaml           # Prometheus config, Grafana provisioning
├── secrets-rbac.yaml         # Secrets & RBAC for Prometheus
├── infrastructure.yaml       # PostgreSQL, Prometheus, Grafana
├── app.yaml                  # CuisineEnsemble App, HPA, NetworkPolicy
└── deployment.yaml           # Original (deprecated)
```

---

## 🔧 Configuration Details

### Storage Configuration
- **StorageClass**: `local-storage` (local-provisioner)
- **PostgreSQL PV**: 10Gi at `/mnt/data/postgres`
- **Prometheus PV**: 20Gi at `/mnt/data/prometheus`
- **Grafana PV**: 5Gi at `/mnt/data/grafana`

**For Cloud Providers:**
```yaml
# Edit storage.yaml - change provisioner:
# AWS EBS: ebs.csi.aws.com
# Azure: disk.csi.azure.com
# GCP: pd.csi.storage.gke.io
```

### Resource Limits
| Component | CPU (req/limit) | Memory (req/limit) |
|-----------|-----------------|-------------------|
| App       | 250m/500m       | 256Mi/512Mi       |
| PostgreSQL| 100m/500m       | 256Mi/512Mi       |
| Prometheus| 250m/500m       | 512Mi/1Gi         |
| Grafana   | 100m/250m       | 256Mi/512Mi       |

**Adjust for your cluster size** in manifest files.

### Auto-Scaling (HPA)
- **Min replicas**: 3
- **Max replicas**: 10
- **CPU threshold**: 70%
- **Memory threshold**: 80%

---

## 🔒 Security

### Network Policies
- App can receive traffic from Prometheus (for metrics)
- App can access PostgreSQL on port 5432
- App can access external APIs on port 443
- DNS enabled (port 53)

### RBAC
- Prometheus has ClusterRole for discovering resources
- Service accounts scoped to namespace

### Secrets
- Base64 encoded (not encrypted by default)
- **For production:** Use `sealed-secrets` or `external-secrets`

---

## 📊 Monitoring

### Prometheus
- Automatically discovers Kubernetes resources
- Scrapes app metrics from `/metrics` endpoint
- Alert rules for high error rate, latency, pod crashes

### Grafana
- Auto-provisioned Prometheus datasource
- Dashboard directories scanned at `/var/lib/grafana/dashboards`

---

## 🚨 Troubleshooting

### Check Deployment Status
```bash
./scripts/deploy-k8s.sh status
```

### View Logs
```bash
./scripts/deploy-k8s.sh logs app
./scripts/deploy-k8s.sh logs prometheus
./scripts/deploy-k8s.sh logs grafana
./scripts/deploy-k8s.sh logs postgres
```

### Common Issues

#### 1. Pods Stuck in Pending
```bash
# Check PVC binding
kubectl get pvc -n cuisineensemble

# Check PV availability
kubectl get pv

# Check node affinity
kubectl describe pvc -n cuisineensemble <pvc-name>
```

**Fix**: Update node hostname in storage.yaml
```bash
kubectl get nodes
# Copy the hostname, update in storage.yaml
```

#### 2. App Can't Connect to Database
```bash
# Check PostgreSQL is running
./scripts/deploy-k8s.sh shell postgres

# Inside postgres pod:
psql -U cuisineensemble -d cuisineensemble
```

#### 3. Grafana/Prometheus Not Ready
```bash
# Check for config errors
kubectl logs -n cuisineensemble -l app=grafana
kubectl logs -n cuisineensemble -l app=prometheus
```

#### 4. Out of Disk Space
```bash
# Check PV usage
kubectl exec -it -n cuisineensemble postgres-0 -- df -h /var/lib/postgresql/data
```

---

## 🔄 Update & Rollback

### Update App
```bash
# Build new image
docker build -t cuisineensemble:v2 -f Dockerfile .

# Update deployment
kubectl set image deployment/cuisineensemble-app \
  -n cuisineensemble \
  cuisineensemble=cuisineensemble:v2

# Check rollout status
kubectl rollout status deployment/cuisineensemble-app -n cuisineensemble
```

### Rollback
```bash
kubectl rollout undo deployment/cuisineensemble-app -n cuisineensemble
```

---

## 🗑️ Cleanup

### Delete All Resources
```bash
./scripts/deploy-k8s.sh delete
```

### Delete Specific Resource
```bash
kubectl delete deployment/cuisineensemble-app -n cuisineensemble
kubectl delete service/grafana -n cuisineensemble
```

---

## 📚 Advanced Topics

### Ingress (For Public Access)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cuisineensemble
  namespace: cuisineensemble
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: cuisineensemble
                port:
                  number: 80
```

### TLS/SSL Certificates
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Add to Ingress for automatic HTTPS
```

### Persistent Storage for Production

#### AWS S3 (for monitoring data)
```yaml
volumeMounts:
  - name: prometheus-s3
    mountPath: /prometheus-remote
```

#### Multi-Zone Replication
```yaml
replicaSet:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - topologyKey: topology.kubernetes.io/zone
```

---

## 📖 References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [PostgreSQL Helm Chart](https://github.com/bitnami/charts/tree/main/bitnami/postgresql)
- [Prometheus on Kubernetes](https://prometheus.io/docs/prometheus/latest/installation/#kubernetes)
- [Grafana on Kubernetes](https://grafana.com/docs/grafana/latest/setup-grafana/installation/kubernetes/)
