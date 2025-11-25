# Short-Squeeze Radar Agent Specification

## Overview

The Short-Squeeze Radar is a **production-grade agent** that:

- Scans Reddit discussions (target subs) for stock mentions.

- Aggregates sentiment and short-squeeze-related language.

- Combines this with external short-interest/float data.

- Produces a **daily ranked list of candidate tickers**.

- Sends alerts via email/SMS/Discord.

It serves as:

- A real tool for your trader collaborator.

- A showcase template demonstrating SqueezeWeasel's capabilities.

---

## Data Sources

1. **Reddit**

   - Subreddits: configurable (e.g., `r/Shortsqueeze`, `r/wallstreetbets`).

   - Time window: last 24 hours (configurable).

   - Data fields:

     - Post title, body

     - Comments (optional)

     - Upvotes, comment counts.

2. **Short-Interest Data Provider (Fintel or similar)**

   - Inputs:

     - Tickers from Reddit scan.

   - Outputs:

     - Short interest %

     - Float

     - Borrow fee / utilization if available.

   - Access via HTTP API node.

---

## Processing Pipeline (Conceptual Nodes)

1. `ScheduleTrigger` – Daily at configurable times (e.g., premarket).

2. `RedditFetchNode` – Fetch posts & comments.

3. `TransformNode` – Normalize content into a list of records.

4. `LLMSentimentNode` – For each record:

   - Extract tickers.

   - Score bullish sentiment (0–10).

   - Score squeeze-related tone (0–10).

5. `LoopNode` – Aggregate by ticker:

   - Sum/average scores.

   - Count mentions.

6. `StockDataNode` – For top N tickers by mention count:

   - Fetch short-interest metrics.

7. `LLMScoringNode` – Combine:

   - Sentiment

   - Squeeze tone

   - Short-interest metrics

   - Into a final **SqueezeScore (0–100)**.

8. `ConditionNode` – Filter tickers above threshold.

9. `NotificationNode` – Send:

   - Ranked table of tickers

   - Basic commentary and disclaimers.

---

## Configuration Options

- Subreddit list

- Time window

- Minimum mention count per ticker

- Minimum SqueezeScore to include

- Max list length (e.g., top 5 or top 10)

- Notification channels:

  - Email

  - SMS

  - Discord/Slack

---

## Limitations & Disclaimers

- This is **not trading advice**.

- Data sources can be noisy and incomplete.

- LLM sentiment is probabilistic and may misinterpret sarcasm or manipulation.

- User must verify data before trading.

---

## Metrics & Telemetry

Track:

- Run frequency and success rate.

- Number of tickers evaluated per run.

- Average SqueezeScore distribution.

- Latency per data source.

These metrics demonstrate that the platform can handle **non-trivial, multi-step, data-heavy workflows**.

