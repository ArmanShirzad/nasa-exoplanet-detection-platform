#!/bin/bash

# Start FastAPI server script
# This script activates the virtual environment and starts the server with correct module path

echo "🚀 Starting NASA Exoplanet Backend Server..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
echo "🔍 Checking dependencies..."
python -c "from src.app.main import app; print('✅ All dependencies loaded successfully')"

# Start the server
echo "🌐 Starting server on http://localhost:8000"
echo "📚 API Documentation available at http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
