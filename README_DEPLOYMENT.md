# 🚀 Quick Deployment Guide

## Backend (Render.com)
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `armana-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn src.app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Deploy!

## Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variables**: 
     - `NEXT_PUBLIC_BACKEND_URL` = `https://your-render-app.onrender.com`
5. Deploy!

## Environment Variables
- Frontend needs: `NEXT_PUBLIC_BACKEND_URL` pointing to your Render backend URL
- Backend automatically loads ML models from `ML/Data Pipeline/artifacts/`

## Testing
- Backend health check: `https://your-backend.onrender.com/healthz`
- Frontend: Your Vercel URL
