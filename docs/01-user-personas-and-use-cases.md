# User Personas and Use Cases

## Persona 1 – "The Short-Squeeze Trader" (Origin Persona)

- **Profile**: Actively trades short squeezes and momentum stocks; spends hours scanning Reddit + Fintel.

- **Goal**: Automate discovery of **high-probability short squeeze candidates**.

- **Pain**:

  - Manual scanning is time-consuming

  - Fear of missing overnight/weekend setups

  - Existing tools too generic, not tuned to Reddit-style sentiment

### Key Use Case – Short-Squeeze Radar

1. Trader logs into SqueezeWeasel.

2. Starts from a "Short-Squeeze Radar" template.

3. Configures:

   - Target subreddits (e.g. r/shortsqueeze, r/wallstreetbets)

   - Thresholds (min mentions, sentiment score)

   - Data provider credentials (Fintel, etc.)

   - Alert channel (SMS, email, Discord)

4. Runs backfill to test on previous week.

5. Schedules daily at market close + premarket.

6. Receives alerts and uses them to inform trades.

Success metric: **Improved hit rate and time saved vs manual scanning.**

---

## Persona 2 – "The Overloaded Marketing Director"

- **Profile**: Mid-size B2B marketing lead; needs to coordinate campaigns, follow-ups, reporting.

- **Goal**: Replace "intern-level" tasks (triaging inbound, sending basic follow-ups, summarizing metrics).

- **Pain**:

  - Too many inbound emails and lead forms

  - Manual reporting

  - Can't justify another headcount yet

### Use Case – Daily Sales & Marketing Inbox Triage

1. Connect inbox (Google/Microsoft).

2. Describe: "Every day at 5pm, summarize my inbox and highlight any emails that are sales leads or event-related."

3. SqueezeWeasel auto-generates:

   - Schedule node (daily 5pm)

   - Gmail fetch node

   - Transform node (extract thread metadata)

   - LLM classification node (sales lead, vendor, spam, etc.)

   - Notification node (Slack/Email with summary)

4. User tweaks thresholds + categories.

5. Deploys and reviews results.

---

## Persona 3 – "The Solo Consultant / Agency Operator"

- **Profile**: Sells automation / AI consulting projects to clients.

- **Goal**: Have a platform to **quickly spin up client-specific automations**.

- **Pain**:

  - Writing custom code for each client is slow and hard to maintain.

  - Needs repeatable patterns and templates.

### Use Case – Client Template Library

1. Consultant designs a "Client Onboarding Agent" template.

2. Uses SqueezeWeasel's visual builder and NL spec entry.

3. Parameterizes:

   - Client branding fields

   - CRM API keys

   - Form URLs, etc.

4. Saves as a template.

5. For each new client, they:

   - Duplicate template

   - Plug in client secrets and endpoints

   - Deploy.

Success metric: **Reduced time-to-launch per client** and more recurring revenue via managed agents.

---

## Persona 4 – "Internal Platform/IT Owner"

- **Profile**: Technical-ish person at an SMB responsible for tooling and security.

- **Goal**: Allow non-technical teams to create automations **without compromising security**.

- **Pain**:

  - Shadow IT from Zapier/IFTTT scripts

  - Credentials scattered across tools

  - No centralized audit trail

### Use Case – Managed Agent Workspace

1. IT sets up SqueezeWeasel workspace.

2. Configures:

   - Identity provider (SSO)

   - Role-based access (admin, builder, operator, viewer)

   - Shared secrets vault (OAuth connections, API keys)

3. Teams build their own flows inside guardrails.

4. IT retains visibility:

   - Which agents are running

   - What APIs they call

   - Usage and cost metrics.

Success metric: **Controlled automation explosion** instead of chaos.

