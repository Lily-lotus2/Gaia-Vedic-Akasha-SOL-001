# Render Deployment Guide: Ollama + AI Models

**Cost-Effective, Self-Hosted AI Backend for gaia-vedic-akasha-sol-001**

---

## Overview

This guide deploys Ollama with Deepseek-R1, Qwen2.5, and Gemma 2 models on Render, providing:

- ✅ **Zero API costs** - No OpenAI/Claude charges
- ✅ **Full code transparency** - Open-source models only
- ✅ **Lily Code compatible** - Non-Euclidean, organic architecture
- ✅ **Cost-effective** - Render's pay-as-you-go pricing
- ✅ **Persistent storage** - Model caching across deployments
- ✅ **Auto-scaling** - Handle variable load

---

## Prerequisites

1. **Render account** - https://render.com
2. **GitHub repository** - `gaia-vedic-akasha-sol-001`
3. **Docker knowledge** - Basic understanding
4. **Disk space** - 50GB+ recommended for models

---

## Step 1: Prepare Repository

Ensure these files are in your repository:

```
gaia-vedic-akasha-sol-001/
├── Dockerfile
├── render.yaml
├── app/api/ai/
│   ├── reasoning/route.ts
│   └── models/route.ts
└── README.md
```

**Commit and push to GitHub:**

```bash
git add Dockerfile render.yaml app/api/ai/
git commit -m "Add Render deployment with Ollama backend"
git push origin main
```

---

## Step 2: Create Render Service

### Option A: Using render.yaml (Recommended)

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy existing code from a repository"**
4. Choose your GitHub repository
5. Render will auto-detect `render.yaml`
6. Click **"Create Web Service"**

### Option B: Manual Configuration

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `gaia-vedic-ollama`
   - **Runtime:** Docker
   - **Build Command:** (leave empty)
   - **Start Command:** `ollama serve`
   - **Port:** 11434
5. Click **"Create Web Service"**

---

## Step 3: Configure Environment Variables

In Render dashboard, go to **Settings** → **Environment**:

```
OLLAMA_MODELS=/root/.ollama/models
OLLAMA_HOST=0.0.0.0:11434
OLLAMA_NUM_PARALLEL=2
OLLAMA_NUM_THREAD=8
```

---

## Step 4: Add Persistent Disk

In Render dashboard, go to **Disks**:

1. Click **"Add Disk"**
2. **Name:** `ollama-models`
3. **Mount Path:** `/root/.ollama/models`
4. **Size:** 50 GB (minimum for models)
5. Click **"Create"**

---

## Step 5: Deploy

1. Render will automatically build and deploy
2. Monitor logs in **"Logs"** tab
3. Wait for health check to pass (typically 2-5 minutes)
4. Your Ollama endpoint will be: `https://gaia-vedic-ollama.onrender.com`

---

## Step 6: Pull Models

Once deployed, pull models via API:

```bash
# List available models
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

Or use the frontend API:

```bash
POST /api/ai/models
{
  "model": "deepseek-r1:70b",
  "action": "pull"
}
```

---

## Step 7: Configure Frontend

In your Vercel deployment, set environment variable:

```
OLLAMA_API_URL=https://gaia-vedic-ollama.onrender.com
```

Or in `.env.local`:

```
NEXT_PUBLIC_OLLAMA_API=https://gaia-vedic-ollama.onrender.com
```

---

## API Endpoints

### Check Ollama Status

```bash
GET /api/ai/reasoning?action=status
```

**Response:**
```json
{
  "success": true,
  "ollama_status": "online",
  "models_available": ["deepseek-r1:70b", "qwen2.5:72b", "gemma2:27b"],
  "ollama_url": "https://gaia-vedic-ollama.onrender.com"
}
```

### Send Analysis for AI Reasoning

```bash
POST /api/ai/reasoning
{
  "analysis": {
    "entropy_metrics": {...},
    "correlation_metrics": {...},
    "complexity_metrics": {...},
    "bottleneck_analysis": {...}
  },
  "model": "qwen2.5",
  "prompt": "Analyze this information-theoretic analysis..."
}
```

**Response:**
```json
{
  "success": true,
  "model": "qwen2.5",
  "reasoning": {
    "analysis_summary": "...",
    "ai_interpretation": "The system exhibits ordered behavior with...",
    "model_used": "qwen2.5:72b"
  }
}
```

### List Available Models

```bash
GET /api/ai/models?action=list
```

**Response:**
```json
{
  "success": true,
  "models_available": [
    {
      "name": "deepseek-r1:70b",
      "size_mb": "45000.00",
      "modified": "2026-05-26T12:00:00Z",
      "digest": "abc123def456"
    }
  ],
  "recommended_models": ["deepseek-r1:70b", "qwen2.5:72b", "gemma2:27b"]
}
```

---

## Pricing & Cost Optimization

### Render Pricing (as of 2026)

| Plan | CPU | RAM | Price/Month |
|------|-----|-----|------------|
| **Free** | 0.5 | 512 MB | $0 (limited) |
| **Standard** | 1 | 2 GB | $7+ |
| **Pro** | 2 | 4 GB | $25+ |
| **Premium** | 4 | 8 GB | $100+ |

### Cost Optimization

1. **Use Standard tier** - Sufficient for Qwen2.5 (72B)
2. **Enable auto-scaling** - Only pay when in use
3. **Suspend when idle** - Render offers free tier suspension
4. **Model selection:**
   - **Deepseek-R1 (70B):** Best reasoning, highest cost
   - **Qwen2.5 (72B):** Balanced, recommended
   - **Gemma 2 (27B):** Lightweight, lowest cost

### Example Monthly Cost

```
Render Standard: $7/month
+ Disk storage (50GB): ~$5/month
+ Compute overage: ~$10-20/month (variable)
─────────────────────────
Total: ~$22-32/month

vs. OpenAI API: $100-500+/month
Savings: 85-95%
```

---

## Monitoring & Troubleshooting

### Check Service Health

```bash
curl https://gaia-vedic-ollama.onrender.com/api/tags
```

### View Logs

In Render dashboard → **Logs** tab:

```
[2026-05-26T12:00:00Z] Starting Ollama server...
[2026-05-26T12:00:05Z] Listening on 0.0.0.0:11434
[2026-05-26T12:00:10Z] Health check passed
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **503 Service Unavailable** | Ollama still starting, wait 2-5 minutes |
| **Out of Memory** | Upgrade to Pro tier or reduce model size |
| **Disk full** | Increase persistent disk size |
| **Slow responses** | Use Gemma 2 instead of Deepseek-R1 |

---

## Integration with gaia-vedic-akasha-sol-001

### Frontend Component Example

```typescript
// app/components/AIReasoningPanel.tsx
import { useState } from 'react';

export function AIReasoningPanel({ analysis }) {
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          model: 'qwen2.5',
          prompt: 'Provide doctoral-level insights on this analysis',
        }),
      });

      const data = await response.json();
      setReasoning(data.reasoning.ai_interpretation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Get AI Insights'}
      </button>
      {reasoning && <p>{reasoning}</p>}
    </div>
  );
}
```

---

## Advanced Configuration

### Custom Model Selection

Edit `app/api/ai/reasoning/route.ts`:

```typescript
const model = searchParams.get('model') || 'qwen2.5';

// Validate model
const validModels = ['deepseek-r1', 'qwen2.5', 'gemma2'];
if (!validModels.includes(model)) {
  return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
}
```

### Caching Responses

Add Redis caching layer:

```typescript
// Cache AI responses to reduce compute
const cacheKey = `ai:${JSON.stringify(analysis)}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;

// ... call Ollama ...

await redis.set(cacheKey, result, 'EX', 3600); // 1 hour TTL
```

---

## Deployment Checklist

- [ ] `Dockerfile` created and tested locally
- [ ] `render.yaml` configured with correct settings
- [ ] Environment variables set in Render dashboard
- [ ] Persistent disk (50GB) created
- [ ] Models pulled successfully
- [ ] Frontend environment variable set
- [ ] API endpoints tested
- [ ] Logs monitored for errors
- [ ] Cost monitoring enabled

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Ollama Docs:** https://ollama.ai
- **Model Cards:**
  - Deepseek-R1: https://huggingface.co/deepseek-ai/deepseek-r1
  - Qwen2.5: https://huggingface.co/Qwen/Qwen2.5-72B
  - Gemma 2: https://huggingface.co/google/gemma-2-27b

---

**Status:** Production-ready Render deployment

**Version:** 1.0 (Phase 8)

**Last Updated:** 2026-05-26

**Authoritative Repository:** [Lily-lotus2/Gaia-Vedic-Akasha-SOL-001](https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001)
