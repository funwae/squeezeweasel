# Simple Demo Setup - EASIEST WAY

## Option 1: Docker (Recommended - Zero Config)

If you have Docker installed:

```bash
# Start PostgreSQL in Docker (no password prompts!)
docker-compose -f docker-compose.demo.yml up -d

# Wait 5 seconds for DB to start, then run migrations
cd apps/api
pnpm prisma:generate
pnpm prisma:push
pnpm seed-demo
```

That's it! The database is running.

## Option 2: Fix PostgreSQL User (If no Docker)

Run these commands **one at a time** in your terminal:

```bash
# 1. Connect to PostgreSQL as postgres user (you'll need sudo password)
sudo -u postgres psql

# 2. Once you're in psql (you'll see postgres=#), run these SQL commands:
CREATE USER hayden WITH PASSWORD 'hayden123' CREATEDB;
CREATE DATABASE squeezeweasel_demo OWNER hayden;
\q

# 3. Now test the connection
psql -U hayden -d squeezeweasel_demo -c "SELECT version();"
# Enter password: hayden123
```

## After Database Setup

```bash
# Generate Prisma client
cd apps/api
pnpm prisma:generate

# Create tables
pnpm prisma:push

# Seed demo data
pnpm seed-demo

# Start services (in separate terminals)
# Terminal 1:
DEMO_MODE=true pnpm --filter api dev

# Terminal 2:
DEMO_MODE=true pnpm --filter worker dev

# Terminal 3:
NEXT_PUBLIC_DEMO_MODE=true PORT=3002 pnpm --filter web dev
```

## Test It

1. Open http://localhost:3002/radar
2. Click "Run Now"
3. Wait for run to complete
4. See candidates appear!

---

**TL;DR**: Use Docker if you have it. One command: `docker-compose -f docker-compose.demo.yml up -d`

