# Simple Render Deployment (Step-by-Step)

## What You're Deploying

Render will create **2 services** automatically:
1. **API** - Handles HTTP requests
2. **Worker** - Processes background jobs

Both use the same database and Redis.

## Step 1: Deploy to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub account (if not already)
4. Select repository: **`funwae/squeezeweasel`**
5. Click **"Apply"**

Render will detect `render.yaml` and create both services automatically! ✅

## Step 2: Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier is fine)
3. Go to **Settings** → **Database**
4. Scroll to **Connection String**
5. Copy the **"Connection Pooling"** string (port 6543)
   - It looks like: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

## Step 3: Set Up Upstash (Redis)

1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database (free tier is fine)
3. Copy the **Redis URL** from the dashboard
   - It looks like: `redis://default:[PASSWORD]@[HOST]:[PORT]`

## Step 4: Configure Render Environment Variables

### In the `squeezeweasel-api` service:

1. Go to your Render dashboard
2. Click on **`squeezeweasel-api`** service
3. Go to **"Environment"** tab
4. Add these variables:

```
DATABASE_URL = [paste your Supabase connection string]
REDIS_URL = [paste your Upstash Redis URL]
WEB_BASE_URL = https://your-vercel-app.vercel.app
API_BASE_URL = https://squeezeweasel-api.onrender.com
```

**Note**: Replace `your-vercel-app` with your actual Vercel URL after deploying frontend.

### In the `squeezeweasel-worker` service:

1. Click on **`squeezeweasel-worker`** service
2. Go to **"Environment"** tab
3. Add the **exact same** variables as the API service:

```
DATABASE_URL = [paste same Supabase connection string]
REDIS_URL = [paste same Upstash Redis URL]
```

**Important**: Both services MUST use the same `DATABASE_URL` and `REDIS_URL` values!

**Tip**: After setting them in the API service, copy-paste the values to the worker service.

## Step 5: Initialize Database

Once both services are running:

1. Go to **`squeezeweasel-api`** service
2. Click **"Shell"** tab (opens a terminal)
3. Run these commands one by one:

```bash
cd ../..
pnpm --filter api prisma:generate
pnpm --filter api prisma:push
pnpm --filter api seed-demo
```

Wait for each command to finish before running the next one.

## Step 6: Get Your API URL

1. Go to **`squeezeweasel-api`** service dashboard
2. Copy the service URL (shown at the top)
   - Example: `https://squeezeweasel-api.onrender.com`
3. Update the `API_BASE_URL` environment variable with this exact URL

## Step 7: Deploy Frontend to Vercel

See `VERCEL_DEPLOYMENT.md` for Vercel setup, then:

1. Set `NEXT_PUBLIC_API_BASE_URL` to your Render API URL
2. Set `NEXT_PUBLIC_DEMO_MODE=true`

## That's It! 🎉

Your demo should now be working:
- Frontend: Your Vercel URL
- Backend: Your Render API URL
- Worker: Running automatically in background

## Troubleshooting

**Services won't start?**
- Check environment variables are set correctly
- Check build logs for errors
- Make sure `DATABASE_URL` uses port 6543 (Supabase pooling)

**Database errors?**
- Verify Supabase connection string is correct
- Check Supabase IP allowlist (Render IPs should be allowed)
- Make sure you ran `prisma:push` in the shell

**Worker not processing jobs?**
- Check `REDIS_URL` is set correctly in worker service
- Verify worker service is running (check logs)
- Both services must use the same Redis instance

