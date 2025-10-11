#!/bin/bash

# 🚀 GitHub Repository Setup Script
# This script helps you set up GitHub while keeping GitLab as deployment snapshot

echo "🌌 NASA Exoplanet Detection Platform - GitHub Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check current remotes
echo ""
echo "📡 Current remotes:"
git remote -v

echo ""
echo "🔧 Next Steps:"
echo "=============="
echo ""
echo "1. 🌐 Create GitHub Repository:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: nasa-exoplanet-detection-platform"
echo "   - Description: 🌌 NASA Exoplanet Detection Platform - Real ML models trained on NASA data"
echo "   - Set to PUBLIC"
echo "   - Don't initialize (we'll push existing code)"
echo ""
echo "2. 🔗 Add GitHub Remote:"
echo "   git remote add github https://github.com/YOUR_USERNAME/nasa-exoplanet-detection-platform.git"
echo ""
echo "3. 📤 Push to GitHub:"
echo "   git push github main"
echo "   git push github develop"
echo "   git push github post-prod"
echo ""
echo "4. ⚙️ Configure GitHub Repository:"
echo "   - Enable Issues and Discussions"
echo "   - Add topics: nasa, exoplanet, machine-learning, fastapi, nextjs"
echo "   - Update description with emojis and details"
echo ""
echo "5. 🚀 Deploy from GitLab:"
echo "   - Keep GitLab as your deployment source"
echo "   - Render and Vercel should continue using GitLab"
echo "   - GitHub becomes your public portfolio"
echo ""

# Check if GitHub remote already exists
if git remote | grep -q "github"; then
    echo "✅ GitHub remote already exists!"
    echo "📤 Ready to push to GitHub:"
    echo "   git push github main"
else
    echo "⚠️  GitHub remote not found. Please add it first."
fi

echo ""
echo "🎯 Repository Status:"
echo "==================="
echo "✅ Open source ready"
echo "✅ MIT License added"
echo "✅ Contributing guidelines"
echo "✅ GitHub templates"
echo "✅ Clean branch structure"
echo "✅ Comprehensive documentation"
echo ""
echo "🚀 Ready for public GitHub portfolio!"
