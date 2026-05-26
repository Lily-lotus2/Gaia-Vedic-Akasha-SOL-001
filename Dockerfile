# Dockerfile for Ollama + Open-Source AI Models
# 
# Deploys Deepseek-R1, Qwen2.5, and Gemma 2 on Render
# Zero API costs, full code transparency, Lily Code compatible

FROM ollama/ollama:latest

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Create models directory
RUN mkdir -p /root/.ollama/models

# Expose Ollama API port
EXPOSE 11434

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:11434/api/tags || exit 1

# Start Ollama server
CMD ["ollama", "serve"]
