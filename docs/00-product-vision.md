# SqueezeWeasel – Product Vision

## One-Sentence Summary

SqueezeWeasel is a **no-code/low-code AI automation studio** that turns **plain-English instructions** into **secure, multi-step, production-grade agents** using a visual node builder – with the first "hero template" focused on **short-squeeze stock discovery**.

---

## Core Idea

Take what your collaborator sketched in Google AI Studio and build the **real thing**:

- A **browser-based platform** where a user can:

  1. Describe what they want in English

  2. See an auto-generated agent flow (nodes/edges)

  3. Refine it visually

  4. Connect to real services (APIs, databases, webhooks)

  5. Deploy, monitor, and iterate – without writing code

This is **Zapier + Flowise + LangChain + "NL-to-architecture"** in one product, tuned for:

- **SMBs and teams** that want internal automations

- **Power users** like your friend (short-squeeze trader) who want serious workflows

---

## Non-Toy Principle

This is **explicitly not**:

- A playground for random prompts

- A toy "let's pretend to automate" demo

- A fixed-template chatbot builder

This **is**:

- **Production-grade orchestration**:

  - Robust scheduling

  - Safe credentials (secrets, OAuth)

  - Idempotent tasks and retries

  - Versioned flows and rollbacks

- **Debuggable**:

  - Node-level logs

  - Run traces

  - Input/output inspection

- **Upgradeable**:

  - New node types

  - New LLM backends

  - New connectors

---

## Hero Use Case: Short-Squeeze Agent

To stay faithful to his origin story, v1 launches with:

> "Short-Squeeze Radar" – an agent that scans Reddit sentiment + Fintel (or similar data sources) to surface **daily short-squeeze candidates** and send alerts.

Key aspects:

- 24/7 or scheduled runs

- Scrapes or ingests:

  - Reddit comments/posts in target subs

  - Short interest / float data (Fintel or equivalent)

- Uses LLMs to:

  - Cluster mentions

  - Gauge sentiment intensity

  - Filter pump-and-dump trash vs genuine momentum

- Outputs:

  - Daily ranked list of tickers

  - Risk/quality commentary

  - Notifications (email/SMS/Discord/etc.)

---

## Market Positioning (First Cut)

- **Who it serves**

  - Indie traders + small funds who want quant-style tools without quant-size budgets

  - SMBs that want email/report/workflow agents without engineering teams

  - Fractional CTOs/consultants who build automations for clients

- **Why it's different**

  - Starts with **English → Architecture** (spec-first).

  - Treats flows as **first-class artifacts**:

    - Versioned, portable, template-able

  - Focuses on **high-leverage "agent per job"** patterns instead of one mega-agent.

---

## Product Goals (v1)

1. **End-to-end usable platform**:

   - A user can log in, describe an agent, refine its flow, connect data sources, and deploy it.

2. **Showcase hero template**:

   - Short-Squeeze Radar built in SqueezeWeasel itself, sharable as a template.

3. **Template Library**:

   - At least 3 starter templates:

     - Short-Squeeze Radar

     - Daily Email Summarizer + Sales Lead Alert

     - CRM Lead Enricher (enrich leads with LLM + external APIs)

4. **Credible infra story**:

   - Secure secrets

   - Reasonable scaling model

   - Observability (logs/metrics) that doesn't feel like smoke and mirrors.

---

## Longer-Term Vision (Post-v1)

- **Template marketplace** for agents (creators build, others deploy).

- **Multi-LLM backend** (OpenAI, Gemini, DeepSeek, local).

- **Policy & guardrails**:

  - Per-agent safety rules, rate limits, cost caps.

- **Team features**:

  - Roles, permissions

  - Shared libraries of nodes and flows.

