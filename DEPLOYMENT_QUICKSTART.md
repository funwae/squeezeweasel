# Quick Deployment Reference

## One-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/docs/deploy-button)

**Or manually:**
1. Go to [render.com](https://render.com) → New → Blueprint
2. Connect repo: `funwae/squeezeweasel`
3. Render auto-detects `render.yaml` ✅
4. Creates 3 services automatically: Web, API, Worker

## What Gets Deployed

Render creates **3 services** from `render.yaml`:

1. **squeezeweasel-web** - Next.js frontend
2. **squeezeweasel-api** - Fastify API backend
3. **squeezeweasel-worker** - Background job processor

## Environment Variables Setup

### Required Services (Free Tiers Available):

1. **Supabase** - PostgreSQL database
   - Get connection string: Settings → Database → Connection String (pooling, port 6543)
   
2. **Upstash** - Redis
   - Get Redis URL from dashboard

### After Deploy, Set These Variables:

**In `squeezeweasel-api` service:**
```
DATABASE_URL = [Supabase connection string]
REDIS_URL = [Upstash Redis URL]
WEB_BASE_URL = [set after web service deploys]
API_BASE_URL = [set after API service deploys]
```

**In `squeezeweasel-web` service:**
```
NEXT_PUBLIC_API_BASE_URL = [set after API service deploys]
```

**In `squeezeweasel-worker` service:**
```
DATABASE_URL = [same as API service]
REDIS_URL = [same as API service]
```

## Database Setup

After services are running, open Render shell for `squeezeweasel-api`:

```bash
cd ../..
pnpm --filter api prisma:generate
pnpm --filter api prisma:push
pnpm --filter api seed-demo
```

## Quick Checklist

- [ ] Deploy to Render (creates all 3 services)
- [ ] Set up Supabase, get `DATABASE_URL`
- [ ] Set up Upstash, get `REDIS_URL`
- [ ] Add env vars to all services
- [ ] Get service URLs and link them together
- [ ] Run database migrations in Render shell
- [ ] Visit your Web service URL!

See `RENDER_SIMPLE.md` for detailed step-by-step instructions.
