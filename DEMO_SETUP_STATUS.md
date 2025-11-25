# Demo Setup Status

## ✅ Completed

### 1. Infrastructure
- ✅ Added `DATABASE_URL` to `.env` (postgresql://hayden:hayden123@localhost:5432/squeezeweasel_demo)
- ✅ Added `NEXT_PUBLIC_API_BASE_URL` to `.env`
- ✅ Added `/healthz` endpoint to API
- ✅ Created demo routes (`/demo/agent`, `/demo/runs/latest`, `/demo/run`)
- ✅ Updated API client with demo methods
- ✅ Updated demo-utils to use demo endpoints

### 2. SqueezeScore Implementation
- ✅ Real deterministic SqueezeScore calculation (matches spec)
- ✅ Handles: sentiment, squeezeVibe, shortInterest, borrowFee, mentionCount
- ✅ Returns: score (0-100), band (weak/moderate/strong), explanation
- ✅ Integrated into TransformNodes

### 3. Frontend Updates
- ✅ Updated `/radar` page to use demo endpoints
- ✅ Updated overview page to fetch and display real run data
- ✅ Added "Run Now" button that triggers demo runs
- ✅ Candidates table displays data from actual runs

## 🔧 What You Need To Do

### 1. Start PostgreSQL Database
```bash
# Make sure PostgreSQL is running
sudo systemctl start postgresql  # or your equivalent command

# Create the database
createdb -U hayden squeezeweasel_demo
# OR
psql -U hayden -c "CREATE DATABASE squeezeweasel_demo;"
```

### 2. Run Database Migrations
```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate dev --name init
# OR if migrations already exist:
pnpm prisma:migrate dev
```

### 3. Seed Demo Workspace
```bash
cd apps/api
pnpm seed-demo
```

This will create:
- Demo workspace (slug: "demo")
- SqueezeWeasel Radar agent
- Flow graph with Short-Squeeze pipeline
- Agent version with active flow

### 4. Start Services
```bash
# Terminal 1: API
cd apps/api
DEMO_MODE=true pnpm dev

# Terminal 2: Worker
cd apps/worker
DEMO_MODE=true pnpm dev

# Terminal 3: Web
cd apps/web
NEXT_PUBLIC_DEMO_MODE=true PORT=3002 pnpm dev
```

### 5. Verify API is Running
```bash
curl http://localhost:4000/healthz
# Should return: {"ok":true,"demoMode":true}
```

### 6. Test Demo Flow
1. Navigate to `http://localhost:3002/radar`
2. Should redirect to `/agents/[demo-agent-id]/overview`
3. Click "Run Now" button
4. Wait for run to complete (check worker logs)
5. Refresh page - should see candidates from the run

## 📝 Notes

### Sample Data
- Reddit connector uses sample data when `DEMO_MODE=true` and `useSampleData=true`
- Stock connector uses sample data when `DEMO_MODE=true` and `useSampleData=true`
- Sample data files:
  - `apps/worker/src/connectors/reddit/sample-data/reddit-2024-11-15.json`
  - `apps/worker/src/connectors/stock/sample-data/stocks.json`

### Flow Execution
The demo flow:
1. Fetches Reddit posts (from sample data)
2. Normalizes posts
3. Extracts tickers & sentiment (LLM - can use DeepSeek if configured)
4. Aggregates by ticker
5. Fetches stock data (from sample data)
6. Calculates SqueezeScore (deterministic)
7. Filters high scores
8. Saves results

### Output Format
The output node should receive candidates in this format:
```json
{
  "candidates": [
    {
      "ticker": "GME",
      "squeezeScore": 85,
      "band": "strong",
      "explanation": "high short interest, bullish and squeeze-focused chatter",
      "mentionCount": 234,
      "shortInterest": 18.5,
      "borrowFee": 12.3
    }
  ]
}
```

### DeepSeek Integration
If you want to use DeepSeek for sentiment analysis:
- Set `DEEPSEEK_API_KEY` in `.env`
- Update LLM gateway to support DeepSeek (or use OpenAI with DeepSeek endpoint)
- The LLM node will use it automatically

## 🐛 Troubleshooting

### API not starting
- Check `DATABASE_URL` is correct
- Check PostgreSQL is running
- Check port 4000 is not in use

### No candidates showing
- Check worker logs for errors
- Verify sample data files exist
- Check run status in database: `SELECT * FROM "Run" ORDER BY "createdAt" DESC LIMIT 1;`
- Check run nodes: `SELECT * FROM "RunNode" WHERE "runId" = '<run-id>';`

### Demo agent not found
- Run `pnpm seed-demo` again
- Check database: `SELECT * FROM "Agent" WHERE "slug" = 'squeezeweasel-radar';`

## 🎯 Next Steps After Setup

1. **Create a real run**: Click "Run Now" and watch it execute
2. **Verify candidates appear**: Check the overview page shows real data
3. **Test candidate detail page**: Click on a ticker to see details
4. **Check run trace**: View the execution trace to see node-by-node progress

---

**Status**: Code is ready! Just need database setup and services running. 🚀

