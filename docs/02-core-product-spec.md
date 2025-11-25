# Core Product Specification

## High-Level Capabilities

1. **Natural-Language Agent Creation**

   - Text box: "What do you want this agent to do?"

   - LLM converts description into:

     - Node graph (nodes + edges)

     - Initial configuration (schedules, triggers)

     - Spec summary (English + structured JSON)

2. **Visual Node-Based Builder**

   - Canvas showing nodes:

     - Input

     - LLM

     - Conditions

     - Tools (APIs, email, DB, webhooks)

     - Loops

     - Outputs/notifications

   - Drag & drop, connect edges, change parameters.

3. **Execution Engine**

   - Executes flows as **directed graphs** with:

     - Schedules

     - External triggers (webhooks)

     - Retries and backoff

     - Parallel branches where allowed.

4. **Connectors & Tools**

   - Email (Gmail, Outlook)

   - HTTP/Webhook

   - Databases (initial: Postgres + generic SQL)

   - Message channels (Slack, Discord, SMS provider)

   - Data APIs (Fintel-equivalent via HTTP connector; future: prebuilt financial connectors)

   - LLM backends (OpenAI, Gemini; others via plugin abstraction)

5. **Security & Secrets**

   - Centralized secret management

   - OAuth integrations (Google, Microsoft)

   - Scoped API keys per workspace

   - RBAC & audit logs

6. **Monitoring & Observability**

   - Run history for each agent

   - Node-level logs (inputs/outputs, truncated for privacy)

   - Status dashboard (success/fail, latency, cost where applicable)

   - Manual rerun of failed steps.

---

## Core Entities

- **Workspace**

  - Organization-level container.

  - Contains users, agents, secrets, templates.

- **Agent**

  - Named automation configuration.

  - Contains:

    - Spec metadata

    - Flow graph (nodes, edges)

    - Runtime settings (schedule, triggers)

    - Version history.

- **Node**

  - Fundamental execution step.

  - Types:

    - Trigger (schedule/webhook/message)

    - LLM

    - Tool (HTTP, email, DB, SMS, etc.)

    - Transform (e.g., JSON mapping, string formatting)

    - Condition (branching)

    - Loop/map

    - Output.

- **Run / Execution**

  - One instance of an agent being executed.

  - Stores:

    - Context (inputs, environment)

    - Node-by-node results

    - Status.

- **Template**

  - Parameterized agent.

  - Includes:

    - Description, use-case

    - Required environment variables/secrets

    - Install/usage instructions.

---

## Key Workflows

### 1. Create an Agent from English

1. User clicks **"Create Agent"**.

2. Types: "Scan Reddit and Fintel for daily short-squeeze candidates and send me the top 5 by SMS."

3. LLM produces:

   - Proposed flow JSON (nodes, edges)

   - Summary spec

   - List of required integrations (Reddit API/HTTP, Fintel API/HTTP, SMS service).

4. UI shows:

   - Flow preview on canvas

   - "Checklist" of missing connections (e.g., SMS provider not configured).

5. User completes connectors, tweaks logic, saves as Agent v0.

### 2. Edit and Run an Agent

1. User selects agent.

2. Enters **Builder** tab:

   - Edits nodes/edges

   - Adjusts prompts, thresholds, schedule.

3. Clicks **"Test run"**:

   - Runs flow on limited data sample.

   - Shows run trace in sidebar.

4. Clicks **"Deploy"**:

   - Marks version as "Active".

   - Schedules or enables triggers.

### 3. Template Installation

1. User browses **Template Library**.

2. Chooses "Short-Squeeze Radar".

3. Clicks "Install".

4. Fills out:

   - Data provider keys

   - Subreddit list

   - Alert preferences.

5. Runs and monitors results.

---

## Non-Functional Requirements (NFRs)

- **Reliability**

  - Target 99.5% availability for flow execution.

  - Node-level retries with exponential backoff.

- **Scalability**

  - Horizontal scaling for worker nodes.

  - Queue-based execution (e.g., Redis/Cloud queue).

- **Security**

  - All secrets encrypted at rest.

  - HTTPS everywhere.

  - Audit trail of key actions (create, edit, delete agent; modify secrets).

- **Performance**

  - Canvas and builder load under 2s for typical flows (<50 nodes).

  - Execution trace view paginated for large runs.

- **Cost Control**

  - Per-agent usage stats:

    - Number of runs

    - LLM token estimates

    - API call counts.

