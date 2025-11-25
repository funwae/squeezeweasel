# 🚀 Zero-Friction Demo - One Command!

## Start Everything

Just run:

```bash
./start-demo.sh
```

That's it! The script will:
- ✅ Start PostgreSQL (if needed)
- ✅ Seed the database (if needed)
- ✅ Start API, Worker, and Web services
- ✅ Open your browser to the demo
- ✅ Pre-populate with sample candidates (no clicking needed!)

## What You'll See

When you open http://localhost:3002/radar, you'll immediately see:
- **4 pre-populated candidates** (GME, AMC, BBBY, SPRT)
- **Real SqueezeScores** (85, 78, 72, 68)
- **Complete run history** ready to view

## No Setup Required!

- ✅ Database auto-creates
- ✅ Sample data pre-loaded
- ✅ Completed run ready to view
- ✅ Zero configuration

## Stop Everything

```bash
pkill -f 'pnpm.*dev'
docker-compose -f docker-compose.demo.yml down
```

## View Logs

```bash
# API logs
tail -f /tmp/squeezeweasel-api.log

# Worker logs
tail -f /tmp/squeezeweasel-worker.log

# Web logs
tail -f /tmp/squeezeweasel-web.log
```

---

**That's it!** Just `./start-demo.sh` and you're demoing. 🎉

