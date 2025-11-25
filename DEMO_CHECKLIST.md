# Demo 0.1 Checklist

This checklist should be run before each client demo to ensure everything works correctly.

## Pre-Demo Setup

- [ ] Environment variables configured:
  - [ ] `DEMO_MODE=true` in `.env`
  - [ ] `DATABASE_URL` points to valid PostgreSQL instance
  - [ ] `REDIS_URL` points to valid Redis instance
  - [ ] At least one LLM API key configured (`OPENAI_API_KEY` or `GEMINI_API_KEY`)
- [ ] Database migrations applied: `pnpm db:migrate`
- [ ] Demo workspace seeded: `pnpm demo:setup`
- [ ] All services running: `pnpm dev`

## Demo Flow Checklist

### 1. Landing Page
- [ ] Navigate to `http://localhost:3000`
- [ ] Landing page loads with SqueezeWeasel branding
- [ ] "Start My Radar" or similar CTA is visible
- [ ] No authentication required (no login screen)

### 2. Radar Overview
- [ ] Navigate to `/radar` or `/agents/[demo-agent-id]/overview`
- [ ] Demo mode banner displays (if `DEMO_MODE=true`)
- [ ] Today's summary card shows:
  - [ ] Candidate count
  - [ ] Posts scanned
  - [ ] Time window
- [ ] Candidates table displays with:
  - [ ] Ticker symbols
  - [ ] SqueezeScores
  - [ ] Mention counts
  - [ ] Short interest percentages
- [ ] Sidebar shows:
  - [ ] SqueezeScore distribution
  - [ ] Signal quality metrics
  - [ ] Run controls

### 3. Trigger a Run
- [ ] Click "Run Now" or "Run Tonight's Hunt"
- [ ] Run is triggered successfully
- [ ] Run appears in run history
- [ ] Run status updates (pending → running → success/failed)

### 4. View Run Trace
- [ ] Navigate to `/agents/[demo-agent-id]/runs`
- [ ] Select a completed run
- [ ] Run trace viewer displays:
  - [ ] Execution timeline
  - [ ] Node-by-node execution status
  - [ ] Node durations
  - [ ] Input/output data (when clicking nodes)
- [ ] Demo mode banner visible in trace viewer

### 5. Candidate Detail
- [ ] Click on a candidate ticker in the overview table
- [ ] Navigate to `/agents/[demo-agent-id]/candidates/[ticker]` or `/radar/candidates/[ticker]`
- [ ] Candidate detail page shows:
  - [ ] SqueezeScore with label (Strong/Moderate/Weak)
  - [ ] Explanation bullet list ("Why Weasel flagged this")
  - [ ] Sentiment breakdown
  - [ ] Short interest metrics
  - [ ] Charts/graphs (if implemented)

### 6. Flow Builder (Read-Only)
- [ ] Navigate to `/agents/[demo-agent-id]/builder`
- [ ] Flow canvas displays Short-Squeeze Radar flow
- [ ] Nodes are visible and labeled:
  - [ ] Schedule trigger
  - [ ] Reddit fetch node
  - [ ] Transform nodes
  - [ ] LLM sentiment node
  - [ ] Stock data node
  - [ ] SqueezeScore calculation node
  - [ ] Condition node
  - [ ] Output node
- [ ] Edges/connections between nodes visible
- [ ] Pan/zoom works
- [ ] Node configuration panel shows read-only config (or editing disabled)
- [ ] Drag-drop creation disabled (or clearly marked as experimental)

### 7. Backtests (Optional)
- [ ] Navigate to `/agents/[demo-agent-id]/backtests` or `/radar/backtests`
- [ ] Backtest view displays (can be sample-based)
- [ ] Historical performance metrics visible

### 8. Settings (Optional)
- [ ] Navigate to `/agents/[demo-agent-id]/settings` or `/radar/settings`
- [ ] Configuration options visible:
  - [ ] Subreddit list
  - [ ] Time window
  - [ ] Risk slider
  - [ ] Minimum SqueezeScore threshold

## Post-Demo Verification

- [ ] No console errors in browser
- [ ] No API errors in server logs
- [ ] Sample data loads correctly (if using sample data)
- [ ] All UI elements render correctly
- [ ] Navigation works smoothly
- [ ] No authentication prompts appear

## Known Limitations (Document for Client)

- NL → Flow generation is hidden or marked as "Labs / Preview"
- Email/SMS connectors not used in demo
- Multi-tenant features not demonstrated
- RBAC enforcement not shown
- MCP integration not part of main demo flow

## Troubleshooting

### If runs don't appear:
- Check worker is running: `pnpm dev:worker`
- Check Redis connection: `redis-cli ping`
- Check database connection: Verify `DATABASE_URL`

### If sample data doesn't load:
- Verify sample data files exist:
  - `apps/worker/src/connectors/reddit/sample-data/reddit-2024-11-15.json`
  - `apps/worker/src/connectors/stock/sample-data/stocks.json`
- Check `DEMO_MODE=true` in environment

### If demo workspace not found:
- Run `pnpm demo:setup` again
- Check database connection
- Verify workspace slug is "demo"

