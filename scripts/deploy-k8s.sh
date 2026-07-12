#!/bin/bash
set -euo pipefail

# Kubernetes Deployment Script for CuisineEnsemble
# Usage: ./deploy-k8s.sh [install|update|delete|status]

ACTION="${1:-status}"
NAMESPACE="cuisineensemble"
KUBE_CONTEXT="${KUBE_CONTEXT:-docker-desktop}"

echo "=========================================="
echo "CuisineEnsemble Kubernetes Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check kubectl
if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}❌ kubectl not installed${NC}"
  exit 1
fi

# Check context
CURRENT_CONTEXT=$(kubectl config current-context 2>/dev/null || echo "none")
if [ "$CURRENT_CONTEXT" != "$KUBE_CONTEXT" ]; then
  echo -e "${YELLOW}⚠️  Current context: $CURRENT_CONTEXT (expected: $KUBE_CONTEXT)${NC}"
  echo "   Run: kubectl config use-context $KUBE_CONTEXT"
fi

case "$ACTION" in
  install)
    echo -e "${GREEN}[INSTALL] Deploying CuisineEnsemble to Kubernetes${NC}"
    echo ""
    
    # 1. Create namespace
    echo "1. Creating namespace..."
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # 2. Create storage paths (for local storage)
    echo "2. Creating storage directories (if local)..."
    for dir in postgres prometheus grafana; do
      mkdir -p "/mnt/data/$dir" 2>/dev/null || true
    done
    
    # 3. Apply secrets and RBAC
    echo "3. Applying secrets and RBAC..."
    kubectl apply -f k8s/secrets-rbac.yaml
    
    # 4. Apply storage
    echo "4. Applying storage configuration..."
    kubectl apply -f k8s/storage.yaml
    
    # 5. Apply ConfigMaps
    echo "5. Applying ConfigMaps..."
    kubectl apply -f k8s/configmaps.yaml
    
    # 6. Apply infrastructure
    echo "6. Deploying infrastructure (PostgreSQL, Prometheus, Grafana)..."
    kubectl apply -f k8s/infrastructure.yaml
    
    # 7. Wait for infrastructure to be ready
    echo "7. Waiting for infrastructure to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s || true
    kubectl wait --for=condition=ready pod -l app=prometheus -n $NAMESPACE --timeout=300s || true
    kubectl wait --for=condition=ready pod -l app=grafana -n $NAMESPACE --timeout=300s || true
    
    # 8. Apply app
    echo "8. Deploying application..."
    kubectl apply -f k8s/app.yaml
    
    # 9. Wait for app to be ready
    echo "9. Waiting for application to be ready..."
    kubectl wait --for=condition=ready pod -l app=cuisineensemble -n $NAMESPACE --timeout=300s || true
    
    echo ""
    echo -e "${GREEN}✓ Deployment complete!${NC}"
    echo ""
    echo "Access your services:"
    echo "  - App: http://localhost:30080"
    echo "  - Grafana: http://localhost:3000 (port-forward: kubectl port-forward -n $NAMESPACE svc/grafana 3000:3000)"
    echo "  - Prometheus: http://localhost:9090 (port-forward: kubectl port-forward -n $NAMESPACE svc/prometheus 9090:9090)"
    echo ""
    
    ;;
  
  update)
    echo -e "${GREEN}[UPDATE] Updating CuisineEnsemble deployment${NC}"
    echo ""
    
    # Update only app deployment
    echo "Updating app deployment..."
    kubectl rollout restart deployment/cuisineensemble-app -n $NAMESPACE
    kubectl wait --for=condition=ready pod -l app=cuisineensemble -n $NAMESPACE --timeout=300s || true
    
    echo -e "${GREEN}✓ Update complete!${NC}"
    ;;
  
  delete)
    echo -e "${YELLOW}[DELETE] Removing CuisineEnsemble from Kubernetes${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "Deleting namespace and all resources..."
      kubectl delete namespace $NAMESPACE --ignore-not-found=true
      echo -e "${GREEN}✓ Deletion complete!${NC}"
    else
      echo "Cancelled."
    fi
    ;;
  
  status)
    echo -e "${GREEN}[STATUS] CuisineEnsemble Kubernetes status${NC}"
    echo ""
    
    # Check namespace
    if kubectl get namespace $NAMESPACE &>/dev/null; then
      echo -e "${GREEN}✓ Namespace: $NAMESPACE exists${NC}"
    else
      echo -e "${RED}✗ Namespace: $NAMESPACE not found${NC}"
      exit 1
    fi
    
    echo ""
    echo "Deployments:"
    kubectl get deployments -n $NAMESPACE -o wide
    
    echo ""
    echo "StatefulSets:"
    kubectl get statefulsets -n $NAMESPACE -o wide
    
    echo ""
    echo "Pods:"
    kubectl get pods -n $NAMESPACE -o wide
    
    echo ""
    echo "Services:"
    kubectl get services -n $NAMESPACE -o wide
    
    echo ""
    echo "PersistentVolumeClaims:"
    kubectl get pvc -n $NAMESPACE
    
    echo ""
    echo "Port forwards (if needed):"
    echo "  kubectl port-forward -n $NAMESPACE svc/grafana 3000:3000"
    echo "  kubectl port-forward -n $NAMESPACE svc/prometheus 9090:9090"
    echo "  kubectl port-forward -n $NAMESPACE svc/postgres 5432:5432"
    ;;
  
  logs)
    SERVICE="${2:-app}"
    echo -e "${GREEN}[LOGS] Showing logs for $SERVICE${NC}"
    echo ""
    
    case "$SERVICE" in
      app)
        kubectl logs -n $NAMESPACE -l app=cuisineensemble --tail=100 -f
        ;;
      prometheus)
        kubectl logs -n $NAMESPACE -l app=prometheus --tail=100 -f
        ;;
      grafana)
        kubectl logs -n $NAMESPACE -l app=grafana --tail=100 -f
        ;;
      postgres)
        kubectl logs -n $NAMESPACE -l app=postgres --tail=100 -f
        ;;
      *)
        echo "Unknown service: $SERVICE"
        echo "Available: app, prometheus, grafana, postgres"
        ;;
    esac
    ;;
  
  shell)
    POD="${2:-app}"
    echo -e "${GREEN}[SHELL] Opening shell in $POD${NC}"
    echo ""
    
    case "$POD" in
      app)
        LABEL="app=cuisineensemble"
        ;;
      prometheus)
        LABEL="app=prometheus"
        ;;
      grafana)
        LABEL="app=grafana"
        ;;
      postgres)
        LABEL="app=postgres"
        ;;
      *)
        echo "Unknown pod: $POD"
        echo "Available: app, prometheus, grafana, postgres"
        exit 1
        ;;
    esac
    
    POD_NAME=$(kubectl get pod -n $NAMESPACE -l $LABEL -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    if [ -z "$POD_NAME" ]; then
      echo -e "${RED}No pods found for $POD${NC}"
      exit 1
    fi
    
    kubectl exec -it -n $NAMESPACE "$POD_NAME" -- /bin/sh
    ;;
  
  *)
    echo "Usage: $0 [install|update|delete|status|logs|shell]"
    echo ""
    echo "Commands:"
    echo "  install    - Deploy all resources"
    echo "  update     - Update app deployment"
    echo "  delete     - Remove all resources"
    echo "  status     - Show deployment status"
    echo "  logs       - Show logs (usage: $0 logs [app|prometheus|grafana|postgres])"
    echo "  shell      - Open shell (usage: $0 shell [app|prometheus|grafana|postgres])"
    exit 1
    ;;
esac
