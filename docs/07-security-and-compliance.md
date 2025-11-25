# Security and Compliance Specification

## Principles

1. **Least privilege** – Only necessary access is granted to agents.

2. **Central control** – Secrets and connectors are centrally managed per workspace.

3. **Auditability** – Key actions are logged and reviewable.

4. **Transparency** – Users can see what an agent can access and what it did.

---

## Authentication & Authorization

- **Auth**

  - Email + password with 2FA

  - Or SSO (Google, Microsoft) for team workspaces.

- **Authorization**

  - Role-based access control:

    - Owner: full control over workspace.

    - Admin: manage users, billing, all agents.

    - Builder: create/edit agents and templates.

    - Operator: run agents and view logs.

    - Viewer: read-only.

---

## Secrets Management

- Secrets stored encrypted at rest:

  - AES-256 with KMS-managed keys (cloud provider).

- Secrets accessed by workers only when:

  - Running an agent that explicitly references them.

- Secrets never sent to frontend.

---

## OAuth Integrations

- For providers like Google, Microsoft:

  - Standard OAuth2 flows.

  - Token storage as secrets with refresh handling.

  - Scopes minimized (e.g., read-only email where possible).

---

## Data Handling and Privacy

- Run logs:

  - Truncated responses where feasible.

  - Configurable retention (default 30–90 days).

  - Option: "Sensitive mode" to reduce logging content.

- Data residency:

  - Initially: single region.

  - Future: region selection for enterprise.

---

## Audit Logging

- Recorded events:

  - User login

  - Agent create/update/delete

  - Secret create/update/delete

  - Role changes

  - Manual run / manual cancel

- Stored with timestamps, user id, workspace id.

---

## Compliance Roadmap

- v1: Best-effort security practices; clear documentation of architecture.

- Later:

  - SOC 2 readiness

  - Penetration testing

  - DPA and standard contractual clauses.

