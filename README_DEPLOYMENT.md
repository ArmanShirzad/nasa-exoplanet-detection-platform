# 🚀 Quick Deployment Guide

## Backend
(Deployment instructions pending new setup)

## Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variables**: 
     - `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend-url.com`
5. Deploy!

## Environment Variables
- Frontend needs: `NEXT_PUBLIC_BACKEND_URL` pointing to your deployed backend URL
- Backend automatically loads ML models from `ML/Data Pipeline/artifacts/`

## Testing
- Backend health check: `https://your-backend-url.com/healthz`
- Frontend: Your Vercel URL
