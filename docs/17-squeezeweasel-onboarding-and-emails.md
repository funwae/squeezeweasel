# SqueezeWeasel Onboarding & Email Spec

## In-App Onboarding Flow

### Step 1 – "Meet the Weasel"

Modal or side panel when user first arrives:

- Title: "Let the Weasel Hunt for You"
- Short text:
  - "We'll set up your first radar in under 5 minutes."
- Button: "Start Setup"

### Step 2 – Choose Hunting Grounds

- UI:
  - Select subreddits (multi-select with suggestions).
  - Time window controls (last 12/24/48 hours).
- Copy:
  - "Tell SqueezeWeasel where to listen."

### Step 3 – Connect Data & Alerts

- Connect:
  - Reddit API / HTTP key
  - Short-interest provider
  - Notification channel (email/SMS/Discord)
- Copy:
  - "Plug in a couple of keys so the Weasel can fetch the data."

### Step 4 – Choose Risk Profile

- Simple slider or presets:
  - "Conservative, Balanced, Aggressive"
- Explains how it affects:
  - SqueezeScore threshold
  - Maximum number of candidates per day.

### Step 5 – Preview First Run

- Show:
  - Skeleton of daily briefing
  - Explanation: "Here's what you'll see every session."
- CTA:
  - "Run Tonight's Hunt" (schedules run for next cycle).

---

## Email Templates

### 1. Welcome Email

**Subject**: "Your Weasel is awake."

**Body (plain + HTML):**

- Greeting with dark-theme styling.
- Key points:
  - Link to dashboard
  - Short explanation of what will happen next (first run, data hookup)
  - Reminder that no financial advice is provided.

### 2. Daily Briefing Email

**Subject examples**:

- "SqueezeWeasel Radar • 3 candidates for [DATE]"
- "No credible squeezes today (and why that's good)."

**Sections**:

1. **Summary Line**
   - "Weasel scanned [N] posts and [M] tickers in the last [window] hours."
2. **Top Candidates Table**
   - Columns: Ticker, SqueezeScore, Mentions, Short Int %, Quick Note.
3. **Notes & Warnings**
   - Plain text explanation for each candidate (1–2 sentences).
4. **Footer Disclaimer**
   - Strongly worded, red accent line above.

### 3. "Backtest Ready" Email

**Trigger**: User finishes first backtest.

**Subject**: "Here's how your Weasel would have done last month."

Body:

- Short narrative:
  - "Your configuration would have flagged [N] moves above your threshold."
- CTA:
  - "See full backtest in the dashboard."

---

## Notification Copy (SMS / Push)

Short, high-impact:

- "Weasel found 4 squeezes that match your settings. Check your radar before the bell."
- "No strong squeezes today. The best trade might be no trade."

Always append:
- "No financial advice. Review data before acting."

