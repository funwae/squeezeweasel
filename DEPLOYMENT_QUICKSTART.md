# Quick Deployment Reference

## One-Click Deploys

### Frontend: Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/funwae/squeezeweasel&root-directory=apps/web)

**After importing:**
- Set **Root Directory** to: `apps/web` ✅
- Add environment variables:
  ```
  NEXT_PUBLIC_DEMO_MODE=true
  NEXT_PUBLIC_API_BASE_URL=https://your-api.onrender.com
  ```

### Backend: Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/docs/deploy-button)

**Or manually:**
1. Go to [render.com](https://render.com) → New → Blueprint
2. Connect repo: `funwae/squeezeweasel`
3. Render auto-detects `render.yaml` ✅
4. Set these environment variables:
   - `DATABASE_URL` (from Supabase - use pooling port 6543)
   - `REDIS_URL` (from Upstash)
   - `WEB_BASE_URL` (your Vercel URL)
   - `API_BASE_URL` (set after Render creates service)

**After deploy, run in Render shell:**
```bash
cd ../..
pnpm --filter api prisma:generate
pnpm --filter api prisma:push
pnpm --filter api seed-demo
```

## Services Needed (All Free Tiers Available)

1. **Supabase** - PostgreSQL database
   - Get connection string: Settings → Database → Connection String (pooling)
   
2. **Upstash** - Redis
   - Get Redis URL from dashboard

3. **Vercel** - Frontend hosting
   - Root: `apps/web`

4. **Render** - API + Worker hosting
   - Auto-configured via `render.yaml`

## Quick Checklist

- [ ] Deploy frontend to Vercel (set root: `apps/web`)
- [ ] Deploy backend to Render (uses `render.yaml`)
- [ ] Set up Supabase, get `DATABASE_URL`
- [ ] Set up Upstash, get `REDIS_URL`
- [ ] Add env vars to Render
- [ ] Run database migrations in Render shell
- [ ] Update Vercel with Render API URL
- [ ] Test demo mode!

See `RENDER_DEPLOY.md` for detailed Render instructions.

