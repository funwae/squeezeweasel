# API Design (First Pass)

> Note: This assumes a REST-style API. Could be adapted to GraphQL.

## Authentication

- JWT-based auth:

  - `POST /api/auth/login`

  - `POST /api/auth/logout`

- Tokens attached via `Authorization: Bearer <token>`.

---

## Core Endpoints

### Agents

- `GET /api/workspaces/:wsId/agents`

  - List agents.

- `POST /api/workspaces/:wsId/agents`

  - Create agent (basic metadata).

- `GET /api/agents/:agentId`

  - Get agent details + active version.

- `PATCH /api/agents/:agentId`

  - Update name/description/status.

- `DELETE /api/agents/:agentId`

### Agent Versions

- `POST /api/agents/:agentId/versions`

  - Create new version with spec + flow graph.

- `GET /api/agents/:agentId/versions`

  - List versions.

- `GET /api/agent-versions/:versionId`

- `POST /api/agents/:agentId/versions/:versionId/activate`

  - Set as active.

### Flows

- `GET /api/flows/:flowId`

- `PATCH /api/flows/:flowId`

  - Update graph JSON.

(Alternatively flows are embedded in agent version endpoints.)

### NL → Flow Generation

- `POST /api/workspaces/:wsId/agents/generate-from-description`

  - Body:

    - `description`

  - Response:

    - Proposed spec JSON

    - Flow graph JSON

    - Required connectors list.

### Runs

- `POST /api/agents/:agentId/run`

  - Trigger manual run (optional payload).

- `GET /api/agents/:agentId/runs`

  - List runs with filters.

- `GET /api/runs/:runId`

  - Get run details.

- `GET /api/runs/:runId/nodes`

  - Node-level logs.

### Templates

- `GET /api/templates`

  - List public templates.

- `GET /api/templates/:templateId`

- `POST /api/workspaces/:wsId/templates/:templateId/install`

  - Creates a new agent based on template.

### Connectors & Secrets

- `GET /api/workspaces/:wsId/connectors`

- `POST /api/workspaces/:wsId/connectors`

  - Create connector (metadata + secret reference).

- `POST /api/workspaces/:wsId/secrets`

  - Create secret (encrypted server-side).

### Webhooks

- `POST /api/webhooks/:workspaceSlug/:agentSlug`

  - Trigger webhook-based flows.

  - Secured via secret token in header or query param.

---

## Error Handling

- Use robust error format:

  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Missing required field: name",
      "details": { ... }
    }
  }
  ```

---

## Rate Limiting

* Per-user and per-workspace rate limits.

* Special treatment for:

  * NL → Flow generation endpoints

  * LLM-heavy endpoints.

