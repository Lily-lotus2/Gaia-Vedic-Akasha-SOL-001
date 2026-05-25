# Deployment Guide: gaia-vedic-akasha-sol-001

**Vercel Deployment for Existon 1.0 System**

---

## Prerequisites

- GitHub account with access to `Lily-lotus2/Gaia-Vedic-Akasha-SOL-001`
- Vercel account (free tier supported)
- Google Drive API credentials (for SILO C integration)

---

## Quick Deployment (Vercel Dashboard)

### Step 1: Connect Repository

1. Log in to [Vercel](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Search for `Gaia-Vedic-Akasha-SOL-001`
5. Click **"Import"**

### Step 2: Configure Project

**Project Name:** `gaia-vedic-akasha-sol-001`

**Framework Preset:** Next.js

**Root Directory:** `.` (default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

### Step 3: Set Environment Variables

In the **"Environment Variables"** section, add:

```
GOOGLE_DRIVE_API_KEY = YOUR_GOOGLE_DRIVE_API_KEY
GOOGLE_DRIVE_FOLDER_ID = YOUR_GOOGLE_DRIVE_FOLDER_ID
SILO_C_SYNC_INTERVAL_MS = 100
EXISTON_UPDATE_FREQUENCY_HZ = 10
```

### Step 4: Deploy

Click **"Deploy"**. Vercel automatically builds and deploys from the `main` branch.

---

## CLI Deployment (Vercel CLI)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Authenticate

```bash
vercel login
```

### Step 3: Deploy

```bash
cd /home/ubuntu/Gaia-Vedic-Akasha-SOL-001
vercel
```

Follow the prompts:
- **Project name:** `gaia-vedic-akasha-sol-001`
- **Directory:** `.`
- **Build command:** `npm run build`
- **Output directory:** `.next`

### Step 4: Add Environment Variables

```bash
vercel env add GOOGLE_DRIVE_API_KEY
vercel env add GOOGLE_DRIVE_FOLDER_ID
vercel env add SILO_C_SYNC_INTERVAL_MS
vercel env add EXISTON_UPDATE_FREQUENCY_HZ
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Environment Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GOOGLE_DRIVE_API_KEY` | String | Required | Google Drive API key for SILO C |
| `GOOGLE_DRIVE_FOLDER_ID` | String | Required | Google Drive folder ID for SILO-C-EXISTON-LOG |
| `SILO_C_SYNC_INTERVAL_MS` | Number | 100 | SILO C sync interval (milliseconds) |
| `EXISTON_UPDATE_FREQUENCY_HZ` | Number | 10 | Existon update frequency (Hz) |
| `NODE_ENV` | String | production | Node environment |

---

## Vercel Configuration

The `vercel.json` file contains:

- **projectName:** `gaia-vedic-akasha-sol-001`
- **framework:** Next.js
- **nodeVersion:** 20.x
- **buildCommand:** `npm run build`
- **outputDirectory:** `.next`
- **regions:** `iad1` (US East)
- **deploymentEnabled:** Auto-deploy on `main` branch push

---

## Post-Deployment Verification

### 1. Check Deployment Status

```bash
vercel status
```

### 2. Test API Endpoints

```bash
# Get deployment URL from Vercel dashboard
DEPLOY_URL="https://gaia-vedic-akasha-sol-001.vercel.app"

# Test batch API
curl -X POST $DEPLOY_URL/api/batch \
  -H "Content-Type: application/json" \
  -d '{"steps": 10, "agent": "system"}'

# Test system state
curl $DEPLOY_URL/api/system-state?agent=system

# Test drift detection
curl $DEPLOY_URL/api/agent/drift-detection
```

### 3. Verify Logs

```bash
vercel logs gaia-vedic-akasha-sol-001
```

---

## SILO C Integration Setup

### Step 1: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named `SILO-C-EXISTON-LOG`
3. Copy the folder ID from the URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

### Step 2: Set Up Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google Drive API**
4. Create a **Service Account**
5. Generate a **JSON key**
6. Share the `SILO-C-EXISTON-LOG` folder with the service account email

### Step 3: Configure Vercel

1. Copy the API key from the JSON file
2. Add to Vercel environment variables:
   - `GOOGLE_DRIVE_API_KEY` = (contents of JSON key)
   - `GOOGLE_DRIVE_FOLDER_ID` = (folder ID from Step 1)

### Step 4: Redeploy

```bash
vercel --prod
```

---

## Custom Domain

### Add Custom Domain

1. In Vercel dashboard, go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-15 minutes)

### Example

```
gaia-vedic-akasha-sol-001.com → gaia-vedic-akasha-sol-001.vercel.app
```

---

## Monitoring & Logs

### Real-Time Logs

```bash
vercel logs gaia-vedic-akasha-sol-001 --follow
```

### Function Logs

```bash
vercel logs gaia-vedic-akasha-sol-001 --function /api/batch
```

### Analytics

- **Vercel Dashboard** → **"Analytics"** tab
- View request counts, response times, and error rates

---

## Troubleshooting

### Build Fails

```bash
# Check build logs
vercel logs gaia-vedic-akasha-sol-001 --follow

# Rebuild locally
npm run build

# Check for TypeScript errors
npm run type-check
```

### Environment Variables Not Loading

```bash
# Verify variables are set
vercel env list

# Redeploy after adding variables
vercel --prod
```

### API Endpoints Return 404

```bash
# Check that API routes exist
ls -la app/api/

# Verify Next.js build output
ls -la .next/
```

### SILO C Sync Not Working

1. Verify `GOOGLE_DRIVE_API_KEY` is set correctly
2. Verify `GOOGLE_DRIVE_FOLDER_ID` is correct
3. Check that service account has folder access
4. Review logs: `vercel logs gaia-vedic-akasha-sol-001 --follow`

---

## Rollback

### Revert to Previous Deployment

```bash
vercel rollback
```

### View Deployment History

```bash
vercel list
```

---

## Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For API routes:

```typescript
// In app/api/batch/route.ts
export const revalidate = 60; // Cache for 60 seconds
```

### Monitor Performance

- **Vercel Dashboard** → **"Analytics"**
- Track TTFB (Time to First Byte)
- Monitor function duration

---

## Security

### Environment Variables Best Practices

1. **Never commit secrets** to GitHub
2. **Use `.env.local`** for local development
3. **Use Vercel dashboard** for production secrets
4. **Rotate API keys** regularly
5. **Restrict API key permissions** in Google Cloud Console

### API Security

- Implement rate limiting for `/api/batch`
- Validate agent identities
- Log all API access to SILO C

---

## Support

For deployment issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check logs: `vercel logs gaia-vedic-akasha-sol-001`
4. Refer to [MOTHER_SEED.md](./MOTHER_SEED.md) for system specification

---

**Status:** Deployment-ready

**Last Updated:** 2026-05-26

**Authoritative Repository:** [Lily-lotus2/Gaia-Vedic-Akasha-SOL-001](https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001)
