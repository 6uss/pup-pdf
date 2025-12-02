#!/bin/bash
set -e

echo "🔨 Building image..."
docker build -t pup-pdf:latest .

echo "📦 Deploying to swarm..."
docker stack deploy -c docker-compose.yml bun

echo "⏳ Waiting for service to be ready..."
sleep 5

echo "📊 Service status:"
docker service ps bun_pup-pdf

echo "📝 Following logs (Ctrl+C to exit):"
docker service logs -f bun_pup-pdf --tail 50