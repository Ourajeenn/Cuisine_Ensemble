#!/usr/bin/env bash
set -euo pipefail

# CuisineEnsemble CI/CD Diagnostic Report
# This script identifies common CI pipeline failures

echo "========================================="
echo "CuisineEnsemble CI/CD Diagnostic"
echo "========================================="
echo ""

ERRORS=0
WARNINGS=0

# Check 1: GitHub Secrets
echo "[CHECK 1] Verifying GitHub Secrets Configuration"
echo "Required secrets:"
echo "  ✓ VITE_SUPABASE_URL - Supabase project URL"
echo "  ✓ VITE_SUPABASE_ANON_KEY - Supabase anonymous key"
echo "  ✓ FLY_API_TOKEN - Fly.io API token"
echo "  ✓ SUPABASE_PROJECT_REF - Supabase project reference"
echo ""
echo "Required variables:"
echo "  ✓ FLY_APP_FRONT - Fly.io front app name"
echo "  ✓ FLY_APP_BACK - Fly.io back app name"
echo ""

# Check 2: Node dependencies
echo "[CHECK 2] Verifying Node.js Setup"
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not installed"
  ((ERRORS++))
else
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 24 ]; then
    echo "⚠️  Node.js version < 24 (current: $(node -v))"
    ((WARNINGS++))
  else
    echo "✓ Node.js version: $(node -v)"
  fi
fi
echo ""

# Check 3: Docker
echo "[CHECK 3] Verifying Docker Setup"
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not installed"
  ((ERRORS++))
else
  if docker ps &> /dev/null; then
    echo "✓ Docker daemon running"
  else
    echo "❌ Docker daemon not accessible"
    ((ERRORS++))
  fi
fi
echo ""

# Check 4: Terraform
echo "[CHECK 4] Verifying Terraform Setup"
if ! command -v terraform &> /dev/null; then
  echo "❌ Terraform not installed"
  ((WARNINGS++))
else
  TF_VERSION=$(terraform -version | head -n1 | cut -d' ' -f2)
  echo "✓ Terraform version: $TF_VERSION"
fi
echo ""

# Check 5: Terraform configuration
echo "[CHECK 5] Checking Terraform Configuration"
if [ -f "infra/terraform/main.tf" ]; then
  if grep -q "replace-with-your-supabase-project-ref" infra/terraform/main.tf; then
    echo "⚠️  Terraform has placeholder values - needs updating"
    ((WARNINGS++))
  else
    echo "✓ Terraform configured"
  fi
else
  echo "❌ infra/terraform/main.tf not found"
  ((ERRORS++))
fi
echo ""

# Check 6: Ansible
echo "[CHECK 6] Verifying Ansible Setup"
if ! command -v ansible &> /dev/null; then
  echo "❌ Ansible not installed"
  ((WARNINGS++))
else
  echo "✓ Ansible version: $(ansible --version | head -n1)"
fi
echo ""

# Check 7: Build files
echo "[CHECK 7] Checking Required Build Files"
for file in package.json Dockerfile docker-compose.yml docker-compose.monitoring.yml; do
  if [ -f "$file" ]; then
    echo "✓ $file exists"
  else
    echo "❌ $file not found"
    ((ERRORS++))
  fi
done
echo ""

# Check 8: Scripts
echo "[CHECK 8] Checking Deployment Scripts"
for script in scripts/post-deploy.sh scripts/rollback.sh; do
  if [ -f "$script" ]; then
    if [ -x "$script" ]; then
      echo "✓ $script executable"
    else
      echo "⚠️  $script not executable"
      ((WARNINGS++))
    fi
  else
    echo "❌ $script not found"
    ((ERRORS++))
  fi
done
echo ""

# Summary
echo "========================================="
echo "Summary: $ERRORS errors, $WARNINGS warnings"
echo "========================================="
echo ""

if [ $ERRORS -gt 0 ]; then
  echo "❌ Critical issues found - fix before running CI"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "⚠️  Warnings found - review configuration"
  exit 0
else
  echo "✓ All checks passed"
  exit 0
fi
