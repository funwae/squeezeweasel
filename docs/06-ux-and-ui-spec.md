# UX and UI Specification

## Overall UX Principles

- **Spec-first**: Users always see a concise, readable spec for what their agent does.

- **Explainable flows**: Node graphs never feel like spaghetti.

- **Clear state**: At any point users know:

  - Is the agent active?

  - When did it last run?

  - Did it succeed?

- **Non-intimidating**: Business users can understand what's happening.

---

## Primary Screens

### 1. Dashboard

- Sections:

  - "My Agents"

  - "Templates"

  - "Recent Runs"

- For each agent:

  - Name, status (Active / Draft / Paused)

  - Next run time (if scheduled)

  - Last run status (success/fail, timestamp)

  - Quick actions: Run now / Edit / View logs.

### 2. Create Agent (NL First)

- Panel with:

  - Title input

  - Description text area:

    - Prompt: "Describe what this agent should do as if you're explaining it to a colleague."

  - Optional "Choose from example prompts" list.

- Button: "Generate Flow".

- After generation:

  - Show two tabs:

    1. **Flow** – Node canvas

    2. **Spec** – English summary + structured JSON preview

  - Checklist:

    - "You need to connect: Gmail, SMS Provider."

### 3. Builder – Flow Editor

- Central canvas with draggable nodes and connectors.

- Left sidebar: Node palette (Input, LLM, Tool, Condition, Output…).

- Right sidebar: Node configuration panel.

- Top bar:

  - `Builder | Spec | Code (JSON) | Runs`

  - Save / Run Test / Deploy buttons.

**Node UX details**

- Node box shows:

  - Icon + type

  - Short description (editable label)

  - Status indicator during live execution preview (optional advanced mode).

- Edge hover:

  - Shows condition / label.

### 4. Spec View

- Readable, auto-generated description:

  - "This agent runs daily at 8am. It fetches emails from [Inbox], identifies sales leads, and sends a Slack summary."

- Editable annotations (user can add notes).

- Button: "Regenerate Spec from Flow" and "Regenerate Flow from Spec" (two-way, with guardrails).

### 5. Run History and Logs

- Table:

  - Time

  - Trigger type

  - Status

  - Duration

  - "View Trace" link.

- Trace view:

  - Timeline of nodes with statuses.

  - Click node → see input/output JSON (with sensitive fields redacted).

### 6. Templates Library

- Cards for each template:

  - Name, category, short description, complexity.

  - "Install" button.

- Filtering:

  - Category (Trading, Sales, Ops)

  - Difficulty (Starter, Intermediate, Advanced).

---

## Onboarding

- First-time user:

  - Guided tour overlay:

    - Step 1: "Describe your first agent."

    - Step 2: "Connect a service."

    - Step 3: "Run a test and view the trace."

- Optional "Start from Short-Squeeze Radar" CTA.

---

## Visual Style

- Professional, not playful.

- Subtle animations; no AI glitter.

- Clear contrast and accessibility focus.

