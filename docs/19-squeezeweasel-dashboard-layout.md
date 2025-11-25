# SqueezeWeasel Agent Dashboard Layout

## High-Level Structure

The app shell is a **dark trading console**:

- **Left sidebar** – navigation + logo
- **Top bar** – environment context, date, account
- **Main content** – per-view panels (Radar, Backtests, Watchlists, Settings)

Route structure under `apps/web/app/agents/[agentId]/`:

- `/overview` – default "Radar Overview"
- `/candidates/[ticker]` – candidate detail view
- `/backtests` – backtest list + viewer
- `/watchlists` – watchlist management
- `/settings` – agent-level configuration

---

## 1. Shell Layout

### Sidebar

Contents (top → bottom):

- SqueezeWeasel logo + wordmark
- Nav items:
  - Radar (Overview)
  - Backtests
  - Watchlists
  - Settings
- Bottom section:
  - "Agent Status" pill (Active / Paused)
  - MCP connection indicator (e.g. "MCP Enabled")

Style:

- Background: `bg-sw-bg-elevated`
- Border-right: `border-sw-border-subtle`
- Width: ~260px
- Nav item active state:
  - Green bar on left
  - Slight green glow on hover

### Top Bar

Contents:

- Left:
  - Current view title (e.g. "Radar Overview")
  - Subtext: "Daily short-squeeze briefing"
- Right:
  - Next run countdown ("Next hunt in 03:21:54")
  - Date and session (e.g. "Pre-market", "After hours")
  - User avatar / account menu

Style:

- Background: `bg-sw-bg`
- Border-bottom: `border-sw-border-subtle`
- Slight blur / translucency optional.

---

## 2. Radar Overview Screen

### Layout

- Two-column responsive layout:
  - Left main column (2/3 width desktop)
  - Right sidebar (1/3 width)

#### Left Column

1. **Today's Summary Card**

   - Top of column, full width.
   - Shows:
     - Number of candidates
     - Number of posts scanned
     - Date/time window
   - Small text: "Configured risk profile: Balanced" etc.

2. **Candidates Table**

   - Sortable table of tickers with columns:
     - Ticker
     - SqueezeScore (with color-coded chip)
     - Mentions (count)
     - Short Interest %
     - Float
     - Quick note ("High chatter, rising borrow cost")
   - Each row clickable → Candidate Detail view.

#### Right Column

1. **SqueezeScore Distribution Card**

   - Small bar chart / histogram.
   - Copy: "Where today's candidates sit on your squeeze scale."

2. **Signal Quality Insight**

   - Text + small chart:
     - "Historical hit rate for this configuration over last N days."

3. **Run Controls**

   - Buttons:
     - "Run Tonight's Hunt"
     - "Run Now" (if allowed)
   - Toggle: "Pause this agent"

---

## 3. Candidate Detail Screen

Route: `/agents/[agentId]/candidates/[ticker]`

### Layout

- Left: Ticker summary and explanation.
- Right: Charts and logs.

#### Left Column

- Heading: `[TICKER] – Today's Read`
- SqueezeScore highlighted, with label:
  - "Strong / Moderate / Weak opportunity based on your profile."
- Bulleted breakdown:
  - Sentiment summary
  - Key phrases from Reddit
  - Short-interest context vs last X days

#### Right Column

- Price + volume sparkline (from integrated data).
- Short-interest trend mini chart.
- "Why Weasel flagged this" card:
  - Bullet list of rule triggers.

---

## 4. Backtests Screen

Route: `/agents/[agentId]/backtests`

### Layout

- Top bar with:
  - Date range picker
  - "Run Backtest" button
- Main:
  - List of past backtests with:
    - Date range
    - Number of candidates
    - Hit rate (based on configured outcome metric)
- Detail panel:
  - When selecting a backtest, show charts:
    - "Alerts vs price move over N days"
    - Table of most notable wins/misses.
- Clear disclaimer text explaining that backtests are hypothetical.

---

## 5. Watchlists Screen

Route: `/agents/[agentId]/watchlists`

### Layout

- "My Watchlists" list on left; `Watchlist Detail` on right.
- Each watchlist:
  - Name
  - Count of tickers
  - Toggle: "Weasel watches this list"

In detail view:

- Grid of tickers with current SqueezeScore and last alert date.
- Button to add/remove tickers.
- Option to subscribe to alerts for that watchlist only.

---

## 6. Settings Screen

Route: `/agents/[agentId]/settings`

Sections:

1. **Hunting Grounds**
   - Subreddit selection
   - Time windows

2. **Data Sources**
   - Connected providers + status
   - Buttons to reconnect, rotate keys

3. **Risk Profile**
   - Slider or presets with text explanation.

4. **Notifications**
   - Channels (email, SMS, Discord, webhook)
   - Quiet hours

5. **MCP Settings**
   - Toggle: "Expose this Agent over MCP"
   - Info:
     - Tool name `squeezeweasel.run_agent`
     - Example call payload snippet.

---

## 7. Interaction Guidelines

- All dangerous actions (pause agent, delete backtest) use **red** destructive variant with confirmation.
- "Hero" actions use **green** primary buttons.
- Tables and charts should remain **clean and uncluttered** – limit each view to:
  - 1 main data visualization
  - 1–2 supporting cards
- Always pair visually loud elements (scores, red warnings) with **plain, legible explanation text**.

