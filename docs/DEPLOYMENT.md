# NOVA STORE — Production Deployment Guide

## Architecture Overview
- **Frontend**: Vercel / Netlify (Static SPA with client-side routing)
- **Backend**: Render / Railway / AWS ECS (FastAPI Uvicorn container)
- **Database**: MongoDB Atlas (M0 Free Tier or Dedicated Cluster)

---

## 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and configure IP Access List (e.g. `0.0.0.0/0` for cloud deployment).
3. Copy connection string:
   ```
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=nova_store_db
   ```

---

## 2. Backend Deployment (Render or Railway)
1. Set Root Directory to `backend`
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Configure Environment Variables:
   - `MONGODB_URL`
   - `MONGODB_DB_NAME`
   - `SECRET_KEY`
   - `ADMIN_DEFAULT_PASSWORD`
   - `CUSTOMER_DEFAULT_PASSWORD`
   - `FRONTEND_URL`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `GEMINI_API_KEY`

---

## 3. Frontend Deployment (Vercel)
1. Set Root Directory to `frontend`
2. Framework Preset: `Vite`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api/v1`
   - `VITE_RAZORPAY_KEY_ID=rzp_test_...`
6. Add `vercel.json` rewrites for SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
