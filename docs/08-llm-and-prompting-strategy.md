# LLM and Prompting Strategy

## Responsibilities of LLMs in SqueezeWeasel

1. **English → Flow Generation**

   - Input: freeform natural language description of desired agent.

   - Output: structured JSON representing:

     - Nodes and edges

     - Config parameters

     - List of required connectors.

2. **Spec Generation**

   - Convert flow JSON into:

     - Human-readable spec

     - Optional formal spec JSON (for comparison/diff).

3. **Agent Step Logic**

   - Within flows, LLMs perform:

     - Classification

     - Extraction

     - Summarization

     - Decision-making based on instructions.

---

## Models

- Initial targets:

  - OpenAI GPT-4/4.1-class models

  - Gemini Pro family

- Abstraction layer for:

  - Model selection per node

  - Fallbacks and retries.

---

## Prompting Patterns

### 1. Flow Generation Prompt Skeleton

- System: "You are an expert AI workflow architect…"

- User content includes:

  - User description

  - Constraints (no actions that require unsupported APIs)

  - Output schema definition:

    - Node list

    - Edge list

    - Configs

    - Required connectors.

Guardrails:

- Refuse to invent integrations that don't exist.

- Prefer generic HTTP nodes with documented assumptions.

### 2. Spec Generation

- System: "You convert JSON workflows into clear English specs…"

- Output sections:

  - Overview

  - Triggers

  - External services used

  - Data flow

  - Risks and assumptions.

### 3. In-Flow Prompts (Example: Short-Squeeze Radar)

- LLM node to evaluate sentiment:

  - System: "You are a financial sentiment classifier. You are not giving financial advice; only labeling sentiment."

  - Instructions:

    - Score 0–10 for:

      - Bullish intensity

      - Short-squeeze tone (mentions of shorts, covering, squeeze)

    - Identify ticker symbols mentioned.

    - Return structured JSON.

---

## Safety & Policy Considerations

- Avoid direct "buy/sell" advice from LLM nodes.

- Always frame outputs as **signals** for the human operator.

- Provide disclaimers in templates for finance-related agents.

---

## Determinism & Debuggability

- For architecture/spec generation:

  - Use lower temperature (e.g. 0–0.2).

- For creative summarization:

  - Slightly higher temperature allowed.

- Store:

  - Model name

  - Parameters

  - Prompt templates (not necessarily all raw data) for debugging and reproducibility.

