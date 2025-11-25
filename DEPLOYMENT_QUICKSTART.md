# Quick Deployment Reference

## Vercel Frontend Setup

**Root Directory**: `apps/web` ✅ **SET THIS IN VERCEL PROJECT SETTINGS**

### Required Environment Variables:
```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## API Deployment (Railway/Render)

**Root Directory**: `apps/api` ✅ **SET THIS**

### Required Environment Variables:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
REDIS_URL=redis://default:[PASSWORD]@[HOST]:[PORT]
JWT_SECRET=generate-random-string-here
DEMO_MODE=true
WEB_BASE_URL=https://your-vercel-app.vercel.app
API_BASE_URL=https://your-api-domain.railway.app
PORT=4000
NODE_ENV=production
```

### After First Deploy:
Run in API service shell:
```bash
pnpm prisma:generate
pnpm prisma:push
pnpm seed-demo
```

## Services Needed

1. **Supabase** - PostgreSQL database (free tier available)
2. **Upstash** - Redis (free tier available)
3. **Vercel** - Frontend hosting (free tier available)
4. **Railway/Render** - API hosting (free tier available)

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

