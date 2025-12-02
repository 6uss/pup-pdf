#!/bin/bash
set -e

echo "🔨 Building image..."
docker build -t pdf-generator:latest .

echo "📦 Deploying to swarm..."
docker stack deploy -c docker-compose.yml pup

echo "⏳ Waiting for service to be ready..."
sleep 5

echo "📊 Service status:"
docker service ps pup_pdf-generator

# echo "📝 Following logs (Ctrl+C to exit):"
# docker service logs -f pup_pdf-generator --tail 50