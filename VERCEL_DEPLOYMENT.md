# Vercel Deployment Guide

## Overview

This guide covers deploying SqueezeWeasel to Vercel with demo mode enabled. The deployment uses:
- **Vercel** for the Next.js frontend
- **Supabase** for PostgreSQL database
- **Upstash** (or Vercel KV) for Redis
- **Separate API deployment** (Railway/Render) or Vercel serverless functions

## Architecture

For the simplest demo deployment:

1. **Frontend (Vercel)**: Next.js app in `apps/web`
2. **API (Separate service)**: Fastify API can be deployed to Railway, Render, or Fly.io
3. **Worker (Optional for demo)**: Can run as Vercel cron jobs or separate service

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your connection string from Settings → Database → Connection String
3. Use the **Connection pooling** string (port 6543) for better performance
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

## Step 2: Set Up Redis (Upstash)

1. Go to [upstash.com](https://upstash.com) and create a Redis database
2. Get your Redis URL from the dashboard
3. Format: `redis://default:[PASSWORD]@[HOST]:[PORT]`

## Step 3: Deploy Frontend to Vercel

### Root Directory
Set the **Root Directory** in Vercel project settings to: `apps/web`

### Environment Variables

Add these environment variables in Vercel:

#### Required for Demo Mode:
```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

#### Optional (if using serverless functions):
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
REDIS_URL=redis://default:[PASSWORD]@[HOST]:[PORT]
JWT_SECRET=your-random-secret-key-here
DEMO_MODE=true
```

### Build Settings

Vercel should auto-detect Next.js, but verify:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm turbo build --filter=web`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

## Step 4: Deploy API (Separate Service)

The API needs to run as a separate service. Options:

### Option A: Railway (Recommended for simplicity)

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repo (`funwae/squeezeweasel`)
3. Add a new service → Select your repo
4. **Set root directory to**: `apps/api` ✅ **IMPORTANT**
5. Railway will auto-detect Node.js
6. Add environment variables in Railway dashboard:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
   REDIS_URL=redis://default:[PASSWORD]@[HOST]:[PORT]
   JWT_SECRET=your-random-secret-key-here
   DEMO_MODE=true
   WEB_BASE_URL=https://your-vercel-app.vercel.app
   API_BASE_URL=https://your-api-domain.railway.app
   PORT=4000
   NODE_ENV=production
   ```
7. After first deploy, open Railway shell and run:
   ```bash
   pnpm prisma:generate
   pnpm prisma:push
   pnpm seed-demo
   ```
8. Railway will auto-generate a public URL (e.g., `https://squeezeweasel-api-production.up.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repo
3. **Set root directory to**: `apps/api` ✅ **IMPORTANT**
4. Build command: `pnpm install && pnpm prisma:generate && pnpm build`
5. Start command: `pnpm start`
6. Add same environment variables as Railway (see above)
7. After deploy, use Render shell to run: `pnpm prisma:push && pnpm seed-demo`

### Option C: Fly.io

1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Run `fly launch` in `apps/api`
3. Add environment variables via `fly secrets set`

## Step 5: Initialize Database

After deploying the API, run:

```bash
# Generate Prisma client
pnpm --filter api prisma:generate

# Push schema to database
pnpm --filter api prisma:push

# Seed demo data
pnpm --filter api seed-demo
```

You can do this by:
- SSHing into your API deployment
- Or using a one-time script/command in Railway/Render

## Step 6: Update Frontend API URL

Update `NEXT_PUBLIC_API_BASE_URL` in Vercel to point to your deployed API URL.

## Environment Variables Summary

### Vercel (Frontend)
- `NEXT_PUBLIC_DEMO_MODE=true` ✅ Required
- `NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com` ✅ Required

### API Service (Railway/Render/Fly.io)
- `DATABASE_URL` ✅ Required (Supabase connection string)
- `REDIS_URL` ✅ Required (Upstash connection string)
- `JWT_SECRET` ✅ Required (random secret)
- `DEMO_MODE=true` ✅ Required
- `WEB_BASE_URL` ✅ Required (your Vercel URL)
- `API_BASE_URL` ✅ Required (your API URL)
- `PORT=4000` ✅ Required
- `NODE_ENV=production` ✅ Required
- `OPENAI_API_KEY` ⚠️ Optional (for LLM features)
- `GEMINI_API_KEY` ⚠️ Optional (for LLM features)

## Testing the Deployment

1. Visit your Vercel URL
2. Should auto-redirect to `/radar` in demo mode
3. Should see demo candidates if database was seeded
4. Click "Run Now" to trigger a demo run

## Troubleshooting

### Database Connection Issues
- Verify Supabase connection string uses port 6543 (pooling)
- Check IP allowlist in Supabase settings
- Ensure `pgbouncer=true` in connection string

### API Not Responding
- Check CORS settings in API (should allow Vercel domain)
- Verify `WEB_BASE_URL` matches your Vercel URL exactly
- Check API logs for errors

### Demo Data Not Showing
- Ensure `seed-demo` script ran successfully
- Check database for demo workspace and agent
- Verify `DEMO_MODE=true` in API environment

## Alternative: All-in-One Vercel Deployment

If you want everything on Vercel, you can:
1. Convert API routes to Next.js API routes (`apps/web/src/app/api/`)
2. Use Vercel Postgres instead of Supabase
3. Use Vercel KV instead of Upstash
4. Deploy worker as Vercel cron jobs

This requires more code changes but simplifies deployment.

