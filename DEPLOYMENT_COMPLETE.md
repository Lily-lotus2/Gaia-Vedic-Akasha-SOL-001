# Complete Deployment Guide: gaia-vedic-akasha-sol-001

**Existon 1.0 with Information-Theoretic Analysis + AI Reasoning**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Domains                             │
│  www.carameldigitalstudio.com                               │
│  www.carameldigital.online                                  │
└────────────────┬────────────────────────────────────────────┘
                 │ DNS (Hostinger)
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              Vercel Frontend Deployment                      │
│  https://gaia-vedic-akasha-sol-001.vercel.app              │
│                                                              │
│  • Next.js 15 React Application                             │
│  • Entropy Dashboard                                         │
│  • Correlation Network Visualization                        │
│  • Bottleneck Analysis Panel                                │
│  • AI Reasoning Interface                                   │
└────────────────┬────────────────────────────────────────────┘
                 │ API Calls
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              Render Backend Deployment                       │
│  https://gaia-vedic-ollama.onrender.com                     │
│                                                              │
│  • Ollama Server (Docker)                                   │
│  • Deepseek-R1 (70B) - Advanced Reasoning                   │
│  • Qwen2.5 (72B) - Real-time Analysis                       │
│  • Gemma 2 (27B) - Lightweight Fallback                     │
│  • Persistent Storage (50GB)                                │
└────────────────┬────────────────────────────────────────────┘
                 │ Model Inference
                 ↓
┌─────────────────────────────────────────────────────────────┐
│        Information-Theoretic Analysis System                 │
│                                                              │
│  • Shannon Entropy Calculation                              │
│  • Mutual Information Analysis                              │
│  • Correlation Length Measurement                           │
│  • Information Bottleneck Detection                         │
│  • Attractor Basin Analysis                                 │
│  • AI-Enhanced Interpretation                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Vercel Frontend Deployment

### Step 1: Prepare Repository

```bash
cd /home/ubuntu/Gaia-Vedic-Akasha-SOL-001
git status
git add .
git commit -m "Phase 9: Complete visualization dashboard and AI integration"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/lily-caramels-projects
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose **`Gaia-Vedic-Akasha-SOL-001`**
5. Configure:
   - **Framework:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Environment Variables:**
     ```
     OLLAMA_API_URL=https://gaia-vedic-ollama.onrender.com
     ```
6. Click **"Deploy"**

### Step 3: Verify Deployment

- Vercel will generate: `https://gaia-vedic-akasha-sol-001.vercel.app`
- Monitor deployment logs
- Test homepage loads correctly

---

## Phase 2: Render Backend Deployment

### Step 1: Deploy Ollama Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Configure:
   - **Name:** `gaia-vedic-ollama`
   - **Runtime:** Docker
   - **Dockerfile:** `./Dockerfile`
   - **Port:** 11434
5. Add **Environment Variables:**
   ```
   OLLAMA_MODELS=/root/.ollama/models
   OLLAMA_HOST=0.0.0.0:11434
   OLLAMA_NUM_PARALLEL=2
   OLLAMA_NUM_THREAD=8
   ```
6. Add **Persistent Disk:**
   - Name: `ollama-models`
   - Mount Path: `/root/.ollama/models`
   - Size: 50 GB
7. Click **"Create Web Service"**

### Step 2: Pull Models

Once deployed, pull models:

```bash
# Check status
curl https://gaia-vedic-ollama.onrender.com/api/tags

# Pull Deepseek-R1
curl -X POST https://gaia-vedic-ollama.onrender.com/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "deepseek-r1:70b"}'

# Pull Qwen2.5
curl -X POST https://gaia-vedic-ollama.onrender.com/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "qwen2.5:72b"}'

# Pull Gemma 2
curl -X POST https://gaia-vedic-ollama.onrender.com/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "gemma2:27b"}'
```

### Step 3: Verify Backend

```bash
# Check Ollama health
curl https://gaia-vedic-ollama.onrender.com/api/tags

# Test AI reasoning
curl -X POST https://gaia-vedic-ollama.onrender.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5:72b",
    "prompt": "Hello, test response",
    "stream": false
  }'
```

---

## Phase 3: Domain Configuration (Hostinger)

### Step 1: Link www.carameldigitalstudio.com

1. Go to Hostinger DNS Management
2. Find your domain: `carameldigitalstudio.com`
3. Add DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
4. Add Vercel verification:
   ```
   Type: TXT
   Name: _vercel
   Value: (provided by Vercel)
   ```

### Step 2: Link www.carameldigital.online

Repeat the same process for `carameldigital.online`

### Step 3: Configure in Vercel

1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Add domains:
   - `www.carameldigitalstudio.com`
   - `www.carameldigital.online`
3. Verify DNS propagation (can take 24-48 hours)

---

## Phase 4: System Testing

### Test Information-Theoretic Analysis

```bash
# Test entropy analysis
curl -X POST https://gaia-vedic-akasha-sol-001.vercel.app/api/analysis/entropy \
  -H "Content-Type: application/json" \
  -d '{
    "stateVector": [0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0],
    "agent": "test"
  }'

# Test correlation analysis
curl -X POST https://gaia-vedic-akasha-sol-001.vercel.app/api/analysis/correlation \
  -H "Content-Type: application/json" \
  -d '{
    "stateVector": [0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0],
    "agent": "test"
  }'

# Test bottleneck analysis
curl -X POST https://gaia-vedic-akasha-sol-001.vercel.app/api/analysis/bottleneck \
  -H "Content-Type: application/json" \
  -d '{
    "stateVector": [0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0, 1, -1, 0],
    "systemOutcome": 1,
    "agent": "test"
  }'

# Test AI reasoning
curl -X POST https://gaia-vedic-akasha-sol-001.vercel.app/api/ai/reasoning \
  -H "Content-Type: application/json" \
  -d '{
    "analysis": {
      "entropy_metrics": {"state_entropy": 22.5, "normalized_entropy": 0.51},
      "correlation_metrics": {"correlation_length": 4.2},
      "complexity_metrics": {"complexity_metric": 0.42},
      "bottleneck_analysis": {}
    },
    "model": "qwen2.5"
  }'
```

### Test Dashboard

1. Navigate to: `https://gaia-vedic-akasha-sol-001.vercel.app/dashboard`
2. Verify all tabs load:
   - Entropy Analysis
   - Network Correlation
   - Bottleneck Analysis
   - AI Reasoning
3. Test real-time updates

---

## Deployment Checklist

### Vercel Frontend
- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Build succeeds
- [ ] Homepage accessible
- [ ] Dashboard page loads
- [ ] Environment variables set
- [ ] Custom domains configured

### Render Backend
- [ ] Docker image builds
- [ ] Service deployed
- [ ] Health checks passing
- [ ] Persistent disk attached
- [ ] Models pulled successfully
- [ ] API endpoints responding
- [ ] Ollama status: online

### Domain Configuration
- [ ] DNS records added (Hostinger)
- [ ] Vercel domains verified
- [ ] www.carameldigitalstudio.com resolves
- [ ] www.carameldigital.online resolves
- [ ] SSL certificates issued

### System Integration
- [ ] Frontend → Backend communication working
- [ ] Entropy analysis API functional
- [ ] Correlation analysis API functional
- [ ] Bottleneck analysis API functional
- [ ] AI reasoning API functional
- [ ] Dashboard displays real-time data

---

## Cost Summary

| Service | Cost/Month | Notes |
|---------|-----------|-------|
| **Vercel** | Free-$20 | Free tier sufficient for static site |
| **Render** | $22-32 | Standard tier + disk storage |
| **Hostinger DNS** | $0 | Included with domain |
| **Total** | **$22-52** | Minimal cost, zero API charges |

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check Vercel deployment
curl https://gaia-vedic-akasha-sol-001.vercel.app/api/analysis/entropy?action=status

# Check Render backend
curl https://gaia-vedic-ollama.onrender.com/api/tags

# Monitor model availability
curl https://gaia-vedic-akasha-sol-001.vercel.app/api/ai/models?action=list
```

### Weekly Tasks

1. Review Vercel analytics
2. Check Render logs for errors
3. Verify model performance
4. Update dependencies if needed

### Monthly Tasks

1. Review cost usage
2. Optimize model selection
3. Update documentation
4. Backup analysis data

---

## Troubleshooting

### Vercel Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` locally |
| Environment variables not set | Verify in Vercel Settings → Environment |
| Domain not resolving | Wait 24-48 hours for DNS propagation |
| 503 errors | Check Render backend status |

### Render Issues

| Issue | Solution |
|-------|----------|
| Service won't start | Check logs, verify Dockerfile |
| Out of memory | Upgrade to Pro tier or reduce model size |
| Disk full | Increase persistent disk size |
| Models not pulling | Check internet connection, Ollama registry |

### Integration Issues

| Issue | Solution |
|-------|----------|
| API calls failing | Check OLLAMA_API_URL environment variable |
| AI reasoning unavailable | Verify Render backend is online |
| Dashboard not updating | Check browser console for errors |

---

## Next Steps

1. **Monitor Performance** - Track analytics and response times
2. **Optimize Models** - Test different model combinations
3. **Scale Infrastructure** - Upgrade Render tier if needed
4. **Add Features** - Extend analysis capabilities
5. **Document Insights** - Record system behavior patterns

---

## Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Ollama Docs:** https://ollama.ai
- **GitHub Repository:** https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001
- **Information Theory Guide:** `INFORMATION_THEORY.md`
- **Render Deployment Guide:** `RENDER_DEPLOYMENT.md`

---

**Status:** Production-ready deployment

**Version:** 1.0 (Phase 9 Complete)

**Last Updated:** 2026-05-26

**Authoritative Repository:** [Lily-lotus2/Gaia-Vedic-Akasha-SOL-001](https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001)

**Live Endpoints:**
- Frontend: `https://gaia-vedic-akasha-sol-001.vercel.app`
- Backend: `https://gaia-vedic-ollama.onrender.com`
- Custom Domains: `www.carameldigitalstudio.com`, `www.carameldigital.online`
