# Quick Start Guide

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (running locally or via Docker)
- Redis (running locally or via Docker)

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database, Redis, and API keys
   ```

3. **Set up database:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

4. **Set up demo mode (optional):**
   ```bash
   # Enable demo mode in .env
   DEMO_MODE=true

   # Seed demo workspace and agent
   pnpm demo:setup
   ```

5. **Start all services:**
   ```bash
   pnpm dev
   ```

   Or use the convenience script:
   ```bash
   ./scripts/dev-all.sh
   ```

## Services

- **Web UI**: http://localhost:3000
- **API**: http://localhost:4000
- **Worker**: Runs in background, processes jobs from queue

## First Steps

1. Register a new user at http://localhost:3000
2. Create a workspace (or use default)
3. Create your first agent using natural language
4. View and edit the generated flow
5. Deploy and run the agent

## Development

- API routes are in `apps/api/src/routes/`
- Worker node handlers are in `apps/worker/src/nodes/`
- Frontend pages are in `apps/web/src/app/`
- Shared types are in `packages/shared-types/`

## Troubleshooting

- **Database connection errors**: Check DATABASE_URL in .env
- **Redis connection errors**: Check REDIS_URL in .env
- **LLM errors**: Ensure at least one LLM API key is set
- **Port conflicts**: Change ports in .env or package.json scripts

