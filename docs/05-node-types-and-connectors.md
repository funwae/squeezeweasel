# Node Types and Connectors

## Core Node Types (v1)

1. **Trigger Nodes**

   - `ScheduleTrigger`

     - Cron-like expression or simplified schedule (e.g. daily at 09:00).

   - `WebhookTrigger`

     - URL endpoint

     - Secret token verification.

   - (Later) `EmailTrigger`, `MessageTrigger` (Slack/Discord).

2. **LLM Node**

   - Config:

     - Model (e.g., `gpt-4.1`, `gemini-1.5-pro`)

     - System prompt

     - User/content template

     - Input bindings (fields from context)

   - Outputs:

     - Raw text

     - Optional structured JSON (with schema hints).

3. **Transform Node**

   - Configurable transforms:

     - JSONPath selection

     - Mapping fields, renaming keys

     - Simple expressions (concat, arithmetic).

   - Might embed a small DSL (or use JSONata-like expression language).

4. **Condition Node**

   - Branch based on:

     - Value comparisons (`>`, `<`, `==`)

     - String/regex match

     - Boolean flag

   - Output edges labelled `true` / `false` or `case` values.

5. **Loop / Map Node**

   - Iterate over a list and apply a subgraph.

   - Implementation:

     - Each element enqueues a sub-run or sub-task with context.

6. **Tool Nodes**

   - `HTTPRequestNode`

     - Method, URL, headers, body template

     - Auth options (API key, OAuth).

   - `EmailSendNode` (Gmail/MS)

   - `SMSSendNode` (Twilio-like provider)

   - `DBQueryNode` (SQL)

   - `WebhookPostNode` (to send results elsewhere).

7. **Output Node**

   - Marks the end of a flow branch.

   - Saves final result to run metadata.

---

## Connectors (v1 Priorities)

### Must-Haves

- **HTTP Generic**

  - Enables "bring your own API".

- **Email**

  - Gmail via OAuth

  - Microsoft 365 via OAuth.

- **SMS**

  - Twilio-style provider.

- **Slack or Discord**

  - For notifications and simple chatops style interactions.

- **Postgres**

  - Insert, update, query.

### "Hero Use Case" Specific

For short-squeeze:

- `RedditFetchNode` (phase 2)

  - Initially implemented via HTTP + helper function.

- `StockDataNode`

  - Abstraction over Fintel-like APIs.

  - Configurable provider + endpoints.

---

## Extensibility Model

- Node type registry:

  - Each node type declared with:

    - Unique `type`

    - UI metadata (label, icon, config schema)

    - Execution handler (backend).

- Future third-party nodes:

  - Packaging as plugins (TBD) that register new node types.

