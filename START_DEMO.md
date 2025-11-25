# 🚀 Start the Demo - Quick Guide

## ✅ Database is Ready!

PostgreSQL is running in Docker and seeded with demo data.

## Start All Services

Open **3 separate terminals** and run:

### Terminal 1 - API Server
```bash
cd /home/hayden/Desktop/squeezeweasel
DEMO_MODE=true pnpm --filter api dev
```

### Terminal 2 - Worker
```bash
cd /home/hayden/Desktop/squeezeweasel
DEMO_MODE=true pnpm --filter worker dev
```

### Terminal 3 - Web App
```bash
cd /home/hayden/Desktop/squeezeweasel
NEXT_PUBLIC_DEMO_MODE=true PORT=3002 pnpm --filter web dev
```

## Test It!

1. **Open browser**: http://localhost:3002/radar
2. **Click "Run Now"** button
3. **Wait** for the run to complete (check worker terminal for progress)
4. **Refresh** the page - you should see candidates!

## Verify Everything Works

- ✅ API health: `curl http://localhost:4000/healthz` → `{"ok":true,"demoMode":true}`
- ✅ Database: PostgreSQL running in Docker
- ✅ Demo data: Seeded with workspace, agent, and flow graph

## Troubleshooting

**API not starting?**
- Check `apps/api/.env` has `DATABASE_URL`
- Check PostgreSQL is running: `docker ps | grep postgres`

**Worker not processing runs?**
- Check `apps/worker/.env` has `DATABASE_URL`
- Check Redis is running (if needed)

**No candidates showing?**
- Check worker logs for errors
- Verify sample data files exist:
  - `apps/worker/src/connectors/reddit/sample-data/reddit-2024-11-15.json`
  - `apps/worker/src/connectors/stock/sample-data/stocks.json`

---

**You're all set!** 🎉

