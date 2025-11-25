# Testing and Quality Strategy

## Levels of Testing

1. **Unit Tests**

   - Node handlers (HTTP, LLM, Transform, Condition, etc.)

   - Scheduler and queue interactions.

   - LLM gateway stubbed with deterministic responses.

2. **Integration Tests**

   - Full flow execution with:

     - Fake connectors (mock HTTP servers)

     - Real DB

   - Ensure:

     - Correct order of execution

     - Context propagation.

3. **End-to-End Tests**

   - Browser automation (Playwright/Cypress) for:

     - Creating agent from template

     - Editing flow

     - Running test

     - Viewing logs.

4. **Load and Stress Tests**

   - Many small agents vs few large agents.

   - Observation:

     - Queue throughput

     - Worker performance.

---

## QA for "Non-Toy" Assurance

- **Golden flows**:

  - Maintain a suite of canonical flow JSONs.

  - Automatically re-run them on staging on every deploy.

- **Synthetic failure scenarios**:

  - API timeouts

  - LLM failures

  - Misconfigured secrets.

- **Regression suite**:

  - Every bug that affects execution becomes a test case.

---

## Observability

- Metrics:

  - Runs per agent/time

  - Failure rates per node type

  - LLM token usage.

- Alerts:

  - High failure rate for a specific agent

  - Worker queue backlog.

---

## Release Strategy

- Use feature flags for:

  - New node types

  - New connectors.

- Canary deployments for execution engine.

---

## Manual QA (Critical for Finance Use Cases)

- Before public release of Short-Squeeze Radar:

  - Dry runs on historical data.

  - Comparison with manual analysis from your collaborator.

  - Documented limitations and false-positive/false-negative behavior.

