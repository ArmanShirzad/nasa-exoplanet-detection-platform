#!/bin/bash
# Quick setup script to deploy nasa.conf to arman-infra
# Run this on your DigitalOcean droplet after the backend is deployed

set -e

echo "🚀 Setting up NASA Backend Nginx Configuration..."

# Copy the config to arman-infra
echo "📋 Copying nasa.conf to arman-infra/sites/"
cp ~/nasa-backend/nasa.conf ~/arman-infra/sites/

# Reload Nginx
echo "♻️  Reloading Nginx..."
cd ~/arman-infra
docker-compose exec nginx nginx -s reload

echo "✅ Done! Backend should now be accessible at https://nasaexoplanet2025.armanshirzad.com"
echo ""
echo "📝 Next steps:"
echo "   1. Test the backend: curl https://nasaexoplanet2025.armanshirzad.com/healthz"
echo "   2. Set up SSL with certbot (optional but recommended)"
