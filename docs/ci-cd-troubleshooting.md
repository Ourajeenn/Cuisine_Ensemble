# CuisineEnsemble CI/CD Pipeline - Troubleshooting Guide

## 🔴 Common Failure Points

### 1. **Stage 1: Validate - Lint Failures**
**Problem:** ESLint or Prettier failures
**Fix:**
```bash
npm install
npm run lint -- --fix
npm run format
```

### 2. **Stage 1: Validate - Unit Tests Failing**
**Problem:** Vitest failures
**Fix:**
```bash
npm run test:unit -- --run
npm run test:coverage -- --run
```

### 3. **Stage 1: Validate - Build Fails**
**Problem:** `npm run build` fails with missing environment variables
**Fix:** Ensure these GitHub secrets are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**GitHub UI:**
1. Go to: Settings → Secrets and variables → Actions
2. Add:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_PROJECT_REF=your-project-ref
   FLY_API_TOKEN=your-fly-token
   ```

### 4. **Stage 1: Validate - Docker Build Fails**
**Problem:** Dockerfile build issues
**Fix:**
```bash
# Test locally first
docker build -t test-image -f Dockerfile .
```

Common Dockerfile issues:
- Missing `src/lib/metrics.ts` (we created this)
- Multi-stage build errors
- Base image not available

### 5. **Stage 1: Validate - Prometheus Rule Syntax Error**
**Problem:** Alert rules invalid
**Fix:**
```bash
# Test locally
docker run --rm -v "$PWD/monitoring:/mnt" prom/prometheus:v2.54.1 promtool check rules /mnt/alerting-rules.yml
```

### 6. **Stage 2: Terraform Plan Fails**
**Problem:** Variables not set or Terraform init issues
**Fix:**
```bash
# Verify variables are passed
terraform -chdir=infra/terraform validate

# Check for hardcoded placeholder values
grep -r "replace-with-your" infra/terraform/
```

**Solution:** Update `infra/terraform/main.tf` locals with real values

### 7. **Stage 4: Configure VMs - Ansible Fails**
**Problem:** Ansible playbook errors on VMs
**Fix:**
```bash
# Syntax check locally
ansible-playbook --syntax-check infra/ansible/site.yml

# Lint check
ansible-lint infra/ansible/
```

Common issues:
- Missing SSH keys
- Hosts unreachable (IP config issue)
- Ansible roles not fully implemented

### 8. **Stage 5: Deploy TEST - docker-compose Up Fails**
**Problem:** docker compose cannot start services
**Fix:**
```bash
# Test compose locally
docker compose -f docker-compose.CuisineEnsemble.yml config
docker compose -f docker-compose.CuisineEnsemble.yml ps

# Check logs
docker compose -f docker-compose.CuisineEnsemble.yml logs -f
```

Common issues:
- Port conflicts (3000, 3001, 5432, 9090 already in use)
- Missing environment variables
- Database not initializing

### 9. **Stage 6: Verify TEST - E2E Tests Fail**
**Problem:** Playwright tests timeout or fail
**Fix:**
```bash
# Run e2e tests locally
npm run test:e2e

# Or specific test
npm run test:e2e -- --headed  # See the browser
```

Common issues:
- App not fully started before tests run
- Missing NODE_ENV=test setup
- Network connectivity issues

### 10. **Stage 7/8: Deploy PROD - requires main branch**
**Problem:** Deploy PROD stage skipped
**Fix:**
- Ensure commit is on `main` branch
- Not a pull request (use workflow_dispatch if testing)
- All verify-test stage passed

---

## ✅ Setup Checklist

### Before First CI Run:

1. **GitHub Secrets** (Settings → Secrets and variables → Actions)
   - [ ] `VITE_SUPABASE_URL`
   - [ ] `VITE_SUPABASE_ANON_KEY`
   - [ ] `SUPABASE_PROJECT_REF`
   - [ ] `FLY_API_TOKEN`

2. **GitHub Variables** (Settings → Secrets and variables → Variables)
   - [ ] `FLY_APP_FRONT` (e.g., `cuisineensemble-front`)
   - [ ] `FLY_APP_BACK` (e.g., `cuisineensemble-back`)

3. **Terraform Configuration**
   - [ ] Update `infra/terraform/main.tf` Supabase values
   - [ ] Or pass them as variables in CI

4. **Ansible Configuration**
   - [ ] Update `infra/ansible/inventory.ini` with actual IPs/hostnames
   - [ ] Ensure SSH access to VMs

5. **Local Verification**
   ```bash
   # Test everything locally first
   npm ci
   npm run lint
   npm run test:unit -- --run
   npm run build
   docker build -t test-image -f Dockerfile .
   ```

---

## 🚀 Testing the Pipeline

### Trigger manually:
```bash
# Via GitHub CLI
gh workflow run ci.yml -f rollback=false
```

### Or:
1. Go to Actions tab
2. Select "CuisineEnsemble CI/CD"
3. Click "Run workflow"

---

## 📊 Monitor Pipeline Execution

1. Go to **Actions** tab
2. Select the latest workflow run
3. Expand job that failed
4. Scroll to failed step for logs

---

## 🔧 Fix Specific Issues

### Issue: "npm ERR! code EAUTH"
```bash
# Clear npm cache and retry
npm cache clean --force
```

### Issue: "Docker rate limit exceeded"
```bash
# Use local image instead
docker pull prom/prometheus:v2.54.1 --quiet
```

### Issue: "Timeout waiting for port 3000"
```bash
# Increase timeout in verify-test step
timeout 120 bash -c 'until curl -f http://localhost:3000; do sleep 2; done'
```

### Issue: "Terraform backend locked"
```bash
# Clear local terraform lock
rm infra/terraform/.terraform.lock.hcl
rm -rf infra/terraform/.terraform
```

---

## 📝 Adding New Environment Variables

1. Add to `ci.yml` env section
2. Set in GitHub Secrets/Variables
3. Reference with `${{ secrets.VARIABLE_NAME }}`

Example:
```yaml
env:
  MY_NEW_VAR: ${{ secrets.MY_NEW_SECRET }}
```

---

## 🆘 Emergency Debug

Enable verbose logging:

```yaml
# Add to any failing step
env:
  DEBUG: "true"
  VERBOSE: "1"
```

For Docker:
```yaml
- name: Debug Docker
  run: |
    docker ps -a
    docker logs <container-name>
    docker system df
```

For Terraform:
```yaml
env:
  TF_LOG: DEBUG
  TF_LOG_PATH: terraform.log
```

---

## 📚 Quick References

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Terraform Variables](https://www.terraform.io/language/values/variables)
- [Ansible Inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html)
- [Fly.io Deployment](https://fly.io/docs/)
