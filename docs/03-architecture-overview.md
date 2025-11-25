# Architecture Overview

## High-Level Diagram (Textual)

- **Frontend**

  - SPA (Next.js/React)

  - Node editor canvas

  - Spec editor (rich text/markdown + JSON view)

  - Agent management dashboards

- **Backend API**

  - GraphQL or REST (tbd) gateway

  - Handles:

    - Auth & sessions

    - Agent CRUD

    - Flow graph CRUD

    - Trigger scheduling configuration

    - Logs & metrics queries

- **Execution Engine**

  - Worker service(s) consuming jobs from a queue.

  - Responsible for:

    - Interpreting flow graphs

    - Calling node implementations

    - Managing context and state per run

    - Writing logs and run results

- **Scheduler**

  - Cron-like service that:

    - Reads schedules from DB

    - Enqueues executions.

- **Queue**

  - Message queue (Redis, SQS, etc.)

  - Decouples API from workers.

- **Database**

  - Relational (Postgres):

    - Users, workspaces

    - Agents & versions

    - Flow graphs

    - Run records

    - Audit logs.

- **Secrets Vault**

  - Could start with encrypted table in Postgres.

  - Abstracted so it can be migrated to managed vault later (e.g., AWS Secrets Manager).

- **LLM Gateway**

  - Service that unifies calls to:

    - OpenAI

    - Gemini

    - Others.

  - Handles:

    - Rate limiting

    - Cost tracking

    - Model selection per node.

- **Connector Services**

  - Set of node implementations for:

    - HTTP

    - Email

    - SMS

    - DB

    - Reddit, etc. (mostly via HTTP).

---

## Key Architectural Decisions

1. **Flow Representation**

   - Store flows as **JSON DAGs**:

     - `nodes`: { id, type, config }

     - `edges`: { from, to, condition? }

   - Execution engine interprets DAG.

2. **Stateless Workers with External State**

   - Workers pull jobs, execute node by node.

   - Run context stored in DB/Redis to survive restarts.

   - This makes scale-out simpler.

3. **Front/Back Separation**

   - Clean API boundary allows:

     - Alternative frontends in future

     - SaaS + maybe later self-host.

4. **Multi-Tenancy**

   - Single shared DB with workspace-level isolation.

   - Row-level access control.

5. **Versioning**

   - Agents are immutable per version.

   - A "live" pointer indicates the active version.

   - Old runs reference the version they used.

---

## Critique / Risk Notes

- Risk: becoming "just another Flowwise clone".

  - Mitigation:

    - Lean hard into **English → architecture** feature.

    - Make spec view first-class (AgentSpec markdown/JSON).

- Risk: execution reliability (LLMs can time out, APIs can fail).

  - Mitigation:

    - Built-in retries, dead-letter queue, observability.

- Risk: compliance/security concerns for enterprises.

  - Mitigation:

    - Clear published security model

    - Option for private deployments later.

