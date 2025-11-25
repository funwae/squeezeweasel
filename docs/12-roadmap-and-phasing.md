# Roadmap and Phasing

## Phase 0 – Spike & Validation

- Deliverables:

  - Minimal flow execution engine (CLI or simple API).

  - Single flow hard-coded for Short-Squeeze Radar, without full UI.

- Goal:

  - Prove execution and data integration are feasible and stable.

---

## Phase 1 – Core Platform Skeleton

- Implement:

  - Backend services (API, DB, workers, scheduler, queue).

  - Basic frontend:

    - Login

    - Workspace/agent list

    - Simple flow editor (even if limited).

  - LLM gateway abstraction.

- Feature cut:

  - No templates library yet.

  - Only essential node types.

Outcome: First internal version where **you** and collaborator can configure and run flows.

---

## Phase 2 – Short-Squeeze Radar Template

- Build full pipeline as described in `09-short-squeeze-agent-spec.md`.

- Add:

  - Template mechanics

  - Minimal onboarding for this template.

- Do:

  - Backtest on historical Reddit + stock data.

  - Tune thresholds with your collaborator.

Outcome: **High-signal hero template** that shows real value.

---

## Phase 3 – NL → Flow Creation & Spec View

- Integrate LLM capabilities to:

  - Generate flow from description.

  - Generate human-readable specs.

- Add:

  - Spec tab and code/JSON tab in UI.

- Ensure:

  - Round-trip safety: editing flow doesn't corrupt spec and vice versa.

Outcome: This is where you differentiate vs generic node editors.

---

## Phase 4 – Template Library & SMB Use Cases

- Add:

  - Daily Email Summarizer template.

  - CRM Lead Enricher template.

- Build:

  - Template browser UI.

  - "Install and configure" flows.

Outcome: Now feels like a platform, not just a one-off.

---

## Phase 5 – Hardening, Security, and Team Features

- Harden:

  - Secrets management

  - Audit logging

  - Role-based access.

- Improve:

  - Monitoring dashboard

  - Cost/usage metrics.

- Prepare:

  - Documentation for external users / small teams.

Outcome: Credible for early B2B pilots.

---

## Phase 6 – Commercialization Path (Optional)

- SaaS pricing tiers (based on runs/LLM usage).

- Partner program:

  - Consultants/agency partners building templates.

- Exploration:

  - Acquisition targets (small b2b SaaS, devtool companies).

