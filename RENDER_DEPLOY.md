# One-Click Render Deployment

## Quick Deploy Button

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/docs/deploy-button)

Or manually:

1. Go to [render.com](https://render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repo: `funwae/squeezeweasel`
4. Render will auto-detect `render.yaml` ✅

## What Gets Deployed

Render will create **2 services** from `render.yaml`:

1. **squeezeweasel-api** (Web Service) - Your Fastify API
2. **squeezeweasel-worker** (Background Worker) - Processes jobs from Redis queue

## Environment Variables Setup

After clicking deploy, Render will ask you to set these variables:

### Required Variables (set these first):

1. **DATABASE_URL**
   - Get from Supabase: Settings → Database → Connection String
   - Use **Connection Pooling** (port 6543): 
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

2. **REDIS_URL**
   - Get from Upstash: Dashboard → Your Redis DB → REST API → Redis URL
   - Format: `redis://default:[PASSWORD]@[HOST]:[PORT]`

3. **WEB_BASE_URL**
   - Set this to your Vercel URL after deploying frontend
   - Example: `https://squeezeweasel.vercel.app`

4. **API_BASE_URL**
   - Set this AFTER Render creates your API service
   - Copy the URL from Render dashboard (e.g., `https://squeezeweasel-api.onrender.com`)

### Optional Variables:

- `OPENAI_API_KEY` - For LLM features (optional for demo)
- `GEMINI_API_KEY` - Alternative LLM (optional for demo)

### Auto-Generated:

- `JWT_SECRET` - Render will auto-generate this ✅
- `DEMO_MODE` - Set to `true` automatically ✅
- `NODE_ENV` - Set to `production` automatically ✅

## After Deployment

### Step 1: Initialize Database

Once the API service is running, open the Render shell:

1. Go to your `squeezeweasel-api` service
2. Click "Shell" tab
3. Run these commands:

```bash
cd ../..
pnpm --filter api prisma:generate
pnpm --filter api prisma:push
pnpm --filter api seed-demo
```

### Step 2: Get Your API URL

1. Go to your `squeezeweasel-api` service dashboard
2. Copy the service URL (e.g., `https://squeezeweasel-api.onrender.com`)
3. Update `API_BASE_URL` environment variable with this URL

### Step 3: Update Vercel

In your Vercel project, set:
```
NEXT_PUBLIC_API_BASE_URL=https://squeezeweasel-api.onrender.com
```

## How It Works

- **API Service**: Handles HTTP requests, creates jobs, manages database
- **Worker Service**: Listens to Redis queue, executes agent runs
- Both services share the same database and Redis connection
- Worker automatically processes jobs created by the API

## Troubleshooting

### Worker Not Processing Jobs
- Check that `REDIS_URL` is set correctly
- Verify worker service is running (check logs)
- Ensure both services are using the same Redis instance

### Database Connection Errors
- Verify `DATABASE_URL` uses port 6543 (Supabase pooling)
- Check Supabase IP allowlist (Render IPs should be allowed)
- Ensure `pgbouncer=true` in connection string

### Build Failures
- Check Render logs for specific errors
- Ensure `rootDir` is set correctly (`apps/api` and `apps/worker`)
- Verify pnpm is installing dependencies correctly

## Free Tier Limits

Render free tier:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading for production use

Upstash free tier:
- 10,000 commands/day
- Perfect for demo mode

Supabase free tier:
- 500MB database
- Perfect for demo mode

