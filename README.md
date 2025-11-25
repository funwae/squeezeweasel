# SqueezeWeasel

> **No-code/low-code AI agent studio that turns plain-English instructions into production-grade, multi-step automations.**
> Built for serious workflows – not toys.

---

## What Is SqueezeWeasel?

SqueezeWeasel is a **spec-first AI automation platform**:

- You **describe** what you want an agent to do in natural language.

- The system turns that description into a **visual flow** of nodes and connections.

- You refine the flow in a **drag-and-drop builder**, wire up real services (email, APIs, databases, SMS).

- You **deploy**, monitor, and iterate like a real production system.

Think of it as:

> **Zapier + Flowise + LangChain + "English → architecture"**
> wrapped into one opinionated, production-focused tool.

---

## Why This Exists

Most "AI agent builders" today fall into two traps:

1. **Prompt playgrounds**
   Fun demos with no real orchestration, retries, or observability.

2. **Flow toys**
   Node graphs that look cool but are hard to debug, brittle, and rarely make it into production.

SqueezeWeasel starts from a different premise:

- **Specs first, visuals second.**
  The spec (in clear language + JSON) is the source of truth. The canvas is a *view* of that spec.

- **Agents are mini backends, not chatbots.**
  Each agent is a focused, opinionated worker:
  "Scan this," "triage that," "summarize these," "notify them."

- **Serious workflows only.**
  Schedules, retries, logs, secrets, and access control are first-class, not afterthoughts.

---

## Hero Use Case – Short-Squeeze Radar

SqueezeWeasel's "origin story" use case is for a real trader:

> **Short-Squeeze Radar** – an agent that scans Reddit + stock-data APIs to surface potential short-squeeze candidates daily.

What it does (conceptually):

1. Pull recent posts + comments from target subreddits (e.g. `r/shortsqueeze`, `r/wallstreetbets`).

2. Use LLMs to:
   - Extract ticker mentions
   - Score sentiment + "squeeze vibes"

3. Fetch short-interest / float data for the most-mentioned tickers.

4. Combine signals into a **SqueezeScore**.

5. Send a ranked list (with context and disclaimers) via email/SMS/Discord.

> ⚠️ **Disclaimer:** SqueezeWeasel and its templates do *not* provide financial advice.
> They surface signals and summaries. You are responsible for your own trading decisions.

This template doubles as:

- A real tool for traders.

- A showcase of what SqueezeWeasel can do end-to-end (APIs, LLMs, aggregation, scoring, notifications).

---

## Core Concepts

### Workspace

A workspace is your org's sandbox.
It contains:

- Users and roles
- Agents
- Templates
- Secrets and connectors

### Agent

An **Agent** is a named automation:

- "Short-Squeeze Radar"

- "Daily Email Summarizer with Sales Alert"

- "CRM Lead Enricher"

Each agent has:

- A **spec** (English + JSON)

- A **flow graph** (nodes + edges)

- A **version history** (drafts vs active)

- A **run history** (executions + logs)

### Node Graph

Agents run as **DAGs** (directed acyclic graphs) of nodes.

Core node types:

- **Triggers** – when to start (schedule, webhook, etc.)

- **LLM** – classification, extraction, summarization

- **Transforms** – JSON shaping, field mapping, small expressions

- **Conditions** – branching logic

- **Tools / Connectors** – HTTP calls, email, SMS, DB access, etc.

- **Outputs** – final result for the run

### Templates

Templates are reusable agent blueprints:

- "Short-Squeeze Radar"

- "Daily Inbox Triage"

- "HubSpot Lead Enricher"

They can be installed per workspace and parameterized with each user's secrets and configuration.

---

## High-Level Architecture

SqueezeWeasel is designed as a **Turborepo monorepo**:

- **`apps/web`** – Next.js UI
  - Dashboard, agent list, visual builder, run logs, template library.
  - Dark, neon-future theme optimized for trading workflows.

- **`apps/api`** – Fastify API + scheduler
  - Auth, agent CRUD, flow management, run queries, template install.
  - Schedules recurring runs and enqueues jobs onto a queue.

- **`apps/worker`** – Execution engine
  - Consumes jobs from the queue.
  - Interprets flow graphs node-by-node.
  - Calls connectors (HTTP, email, SMS, DB, MCP servers, etc.).
  - Logs run/step status and outputs.

- **`packages/shared-types`**
  - Shared TypeScript types: Agent, FlowGraph, Node, Run, etc.

- **`packages/agent-spec`**
  - Logic for:
    - Converting natural language → flow JSON
    - Converting flow JSON → human-readable specs
    - Validating specs and flows.

- **`packages/mcp-server`**
  - MCP server exposing SqueezeWeasel as an MCP-compatible service.
  - Allows AI assistants (Claude, ChatGPT) to control agents and view runs.

- **`packages/ui`**
  - Shared UI components & SqueezeWeasel theme tokens.

- **`docs/`**
  - Deep-dive product and architecture specs (see below).

The system uses:

- **Postgres** for persistence (Prisma schema under `apps/api`).

- A **queue** (Redis + BullMQ) between API and workers.

- An **LLM gateway** to talk to OpenAI, Gemini, etc.

- A small **scheduler** service to trigger scheduled agents.

- **MCP (Model Context Protocol)** for:
  - Exposing SqueezeWeasel as an MCP server (AI assistant integration)
  - Consuming external MCP servers as connectors (Postgres, GitHub, Slack, etc.)

---

## Documentation

The `docs/` folder is the product brain:

- `00-product-vision.md` – why this exists, end-state vision

- `01-user-personas-and-use-cases.md` – who we're building for

- `02-core-product-spec.md` – features, entities, workflows

- `03-architecture-overview.md` – services, data flows

- `04-data-model.md` – tables and relationships

- `05-node-types-and-connectors.md` – node taxonomy and connectors

- `06-ux-and-ui-spec.md` – major screens and UX principles

- `07-security-and-compliance.md` – security posture and roadmap

- `08-llm-and-prompting-strategy.md` – how we use models (and how we don't)

- `09-short-squeeze-agent-spec.md` – hero agent spec

- `10-api-design.md` – first-pass endpoint design

- `11-mcp-integration.md` – MCP server and client integration

- `11-testing-and-quality.md` – testing strategy

- `12-roadmap-and-phasing.md` – development phases

- `13-squeezeweasel-overview.md` – SqueezeWeasel product overview

- `14-squeezeweasel-branding-and-copy.md` – brand voice and copy guide

- `15-squeezeweasel-landing-page-spec.md` – landing page specification

- `16-squeezeweasel-theme-tokens.md` – design tokens and theme system

- `17-squeezeweasel-onboarding-and-emails.md` – onboarding and email templates

These are the reference documents for any future development (human or AI-driven).
**All code changes should flow from these specs, not the other way around.**

---

## Getting Started (Dev)

> This is a starter layout. Many pieces are stubs by design.
> The goal is to provide a clean, spec-backed skeleton to iterate on.

### Prerequisites

- Node.js 20+

- pnpm 9+

- Postgres (local or Docker)

- Redis (local or Docker)

- A recent LLM API key (OpenAI or Gemini)

### 1. Clone and install

```bash
git clone <repo-url>
cd squeezeweasel
pnpm install
```

### 2. Environment

Create `.env` from the example:

```bash
cp .env.example .env
```

Fill in:

* `DATABASE_URL`
* `REDIS_URL`
* `OPENAI_API_KEY` and/or `GEMINI_API_KEY`
* Any email/SMS credentials you want to test with.

### 3. Database

From the repo root:

```bash
pnpm db:generate
pnpm db:migrate
```

(Under the hood: runs Prisma migrations in `apps/api` against your Postgres instance.)

### 4. Run everything

```bash
pnpm dev
```

This will:

* Start `apps/web` (Next.js) on `http://localhost:3000`
* Start `apps/api` on `http://localhost:4000`
* Start `apps/worker` consuming jobs from the queue (implementation TBD).

### 5. First Run – Fake Flow

Initial dev plan:

1. Implement a **simple demo flow** in the worker:
   * Trigger → LLM summarization → log output.

2. Add a minimal UI in `apps/web` to:
   * Create a simple agent
   * Trigger a manual run
   * View the run output.

Once this is stable, move on to the **Short-Squeeze Radar** template and the **NL → flow** feature.

---

## Project Status

This repository is currently:

* **Greenfield** – skeleton and specs in place.

* **Architecture-driven** – we flesh out the docs before filling in code.

* **Serious-business-oriented** – features are evaluated by:

  * Does this survive real usage?

  * Would a trader/SMB trust this in their workflow?

If you're browsing this as a collaborator:

* Start by reading `docs/00-product-vision.md` and `docs/02-core-product-spec.md`.

* Then open `apps/` and `packages/` to see where your changes should live.

---

## Security & Responsibility Notes

* Financial templates like **Short-Squeeze Radar** are **signal generators**, not advisors.

* You are responsible for:

  * How you host and secure your deployment.

  * Which LLM providers and connectors you use.

  * How you act on the outputs of any agent.

SqueezeWeasel aims to provide solid tooling – not guarantees.

---

## MCP Integration

SqueezeWeasel is **MCP-native**, meaning:

- **Exposes itself as an MCP server** – AI assistants can list agents, trigger runs, and view traces
- **Consumes external MCP servers** – Use Postgres, GitHub, Slack MCP servers as connectors
- **November 2025-grade** – Built on the official MCP TypeScript SDK

See `MCP_INTEGRATION.md` for setup and usage guide.

## Roadmap (High Level)

See `docs/12-roadmap-and-phasing.md` for the detailed breakdown.

In short:

1. ✅ Engine & skeleton
2. ✅ MCP integration (server + client)
3. Short-Squeeze Radar agent
4. Natural-language → flow builder
5. Template library (sales, ops, trading)
6. Hardening (security, team features, monitoring)
7. Monetization / B2B pilots

---

## License

TBD – likely a business-friendly license with clarity around hosted/SaaS usage.

For now, treat this as "all rights reserved" until a license is explicitly added.

