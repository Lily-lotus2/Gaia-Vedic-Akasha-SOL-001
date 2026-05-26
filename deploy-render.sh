#!/bin/bash

# Render Deployment Script for gaia-vedic-akasha-sol-001
# 
# Usage: ./deploy-render.sh <RENDER_API_TOKEN> <GITHUB_TOKEN>
# 
# This script deploys the Ollama backend to Render with all configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: RENDER_API_TOKEN required${NC}"
    echo "Usage: ./deploy-render.sh <RENDER_API_TOKEN> [GITHUB_TOKEN]"
    exit 1
fi

RENDER_API_TOKEN="$1"
GITHUB_TOKEN="${2:-}"
REPO="https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001"
BRANCH="main"
SERVICE_NAME="gaia-vedic-ollama"
ACCOUNT_EMAIL="carameldigitalcontent@gmail.com"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Render Deployment: gaia-vedic-akasha-sol-001${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Step 1: Get owner ID
echo -e "\n${YELLOW}Step 1: Retrieving account information...${NC}"
OWNER_RESPONSE=$(curl -s https://api.render.com/v1/owners \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json")

OWNER_ID=$(echo "$OWNER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$OWNER_ID" ]; then
    echo -e "${RED}Error: Could not retrieve owner ID. Check your API token.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Owner ID: $OWNER_ID${NC}"
echo -e "${GREEN}✓ Account: $ACCOUNT_EMAIL${NC}"

# Step 2: Check if service already exists
echo -e "\n${YELLOW}Step 2: Checking for existing service...${NC}"
EXISTING=$(curl -s https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" | grep -c "$SERVICE_NAME" || true)

if [ "$EXISTING" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Service '$SERVICE_NAME' already exists${NC}"
    echo -e "${YELLOW}Skipping creation. Use Render dashboard to manage.${NC}"
else
    echo -e "${GREEN}✓ Service does not exist. Ready to create.${NC}"
fi

# Step 3: Display deployment instructions
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}DEPLOYMENT INSTRUCTIONS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

cat << 'EOF'

Since Render API requires complex service details, please deploy manually:

1. Go to: https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repository: https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001
4. Configure:
   - Name: gaia-vedic-ollama
   - Runtime: Docker
   - Dockerfile: ./Dockerfile
   - Build Command: (leave empty)
   - Start Command: ollama serve
   - Plan: Standard ($7/month)

5. Add Environment Variables:
   - OLLAMA_HOST=0.0.0.0:11434
   - OLLAMA_NUM_PARALLEL=2
   - OLLAMA_NUM_THREAD=8

6. Add Persistent Disk:
   - Name: ollama-models
   - Mount Path: /root/.ollama/models
   - Size: 50 GB

7. Click "Create Web Service"

8. Once deployed, pull models:

   curl -X POST https://gaia-vedic-ollama.onrender.com/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "deepseek-r1:70b"}'

   curl -X POST https://gaia-vedic-ollama.onrender.com/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "qwen2.5:72b"}'

   curl -X POST https://gaia-vedic-ollama.onrender.com/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "gemma2:27b"}'

EOF

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deployment guide ready${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Step 4: Provide quick reference
echo -e "\n${YELLOW}Quick Reference:${NC}"
echo -e "Repository: ${BLUE}$REPO${NC}"
echo -e "Branch: ${BLUE}$BRANCH${NC}"
echo -e "Service Name: ${BLUE}$SERVICE_NAME${NC}"
echo -e "Account: ${BLUE}$ACCOUNT_EMAIL${NC}"
echo -e "Owner ID: ${BLUE}$OWNER_ID${NC}"

echo -e "\n${GREEN}Ready to deploy! Follow the instructions above.${NC}"
