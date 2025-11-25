# SqueezeWeasel Theme & Design Tokens

## Theme Overview

Dark, high-contrast, neon-future:

- Base: **black / near-black**
- Foreground text: **white**
- Primary accent: **neon green**
- Danger/edge accent: **deep red**

The vibe: *midnight trading desk meets sci-fi HUD*.

---

## Color Palette

### Core

- `--sw-bg`: `#050608`           // main background (near-black)
- `--sw-bg-elevated`: `#0b0f14`  // elevated panels
- `--sw-border-subtle`: `#181c22`
- `--sw-border-strong`: `#262b35`

- `--sw-text-primary`: `#ffffff`
- `--sw-text-secondary`: `#b3bfd4`
- `--sw-text-muted`: `#6c7385`

### Accents

- `--sw-accent-green`: `#26f68c` // primary neon green
- `--sw-accent-green-soft`: `#1cae62`
- `--sw-accent-red`: `#ff3355`   // warnings / high-risk
- `--sw-accent-amber`: `#ffc857` // neutral callouts

### States

- `--sw-success`: `#26f68c`
- `--sw-error`: `#ff3355`
- `--sw-warning`: `#ffc857`
- `--sw-info`: `#5ad1ff`

- Hover glows:
  - Green glow: `box-shadow: 0 0 0 1px rgba(38, 246, 140, 0.5), 0 0 32px rgba(38, 246, 140, 0.2);`

---

## Typography

- Base: system UI or clean geometric sans:
  - `font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;`

- Sizes:
  - Hero heading: `clamp(2.8rem, 4vw, 3.6rem)`
  - Section heading: `1.5rem`
  - Body: `0.95rem–1rem`
  - Small meta: `0.8rem`

- Weight usage:
  - Display headings: 700–800
  - Body: 400
  - Highlights: 500–600

---

## Layout & Components (Tailwind + shadcn)

### Tailwind Config

- Extend theme with the custom colors above under `colors.sw.*`
- Use `container` with `max-w-6xl` for main content.

### Buttons

- **Primary (green on black)**
  - Background: `--sw-accent-green`
  - Text: `--sw-bg`
  - Hover: darker green + outer glow
  - Shape: rounded-lg, medium height, medium padding

- **Secondary (outline)**
  - Background: transparent
  - Border: `--sw-accent-green-soft`
  - Text: `--sw-text-primary`
  - Hover: subtle green tint + glow

- **Danger / Edge CTAs**
  - Background: `--sw-accent-red`
  - Limited use (warnings, "I accept the risk" type actions).

### Cards

- Background: `--sw-bg-elevated`
- Border: `--sw-border-subtle`
- Hover: elevate with green edge and soft glow.
- Corners: `rounded-xl` or `rounded-2xl`.

### Data Visuals

- **SqueezeScore bars**:
  - Gradient from `--sw-accent-red` (low score) through `--sw-accent-amber` to `--sw-accent-green` (high score).
- **Sparkline charts**:
  - Thin stroke in green, with red dots for large drawdowns.

---

## Accessibility

- Ensure contrast ratio ≥ 4.5:1 for text on backgrounds.
- Avoid neon green on pure white for text.
- Use red only as accent; pair with icons and labels for colorblind users.

---

## Implementation Notes (shadcn/ui)

- Base shadcn theme:
  - Override `bg-background`, `bg-card`, `text-foreground`, `border-border`, and `primary` colors with SqueezeWeasel tokens.
- Create a `ThemeProvider` that sets class names like `sw-dark` on `<body>` and maps to CSS variables.

---

## Brand "Rules"

- Don't overuse pure neon gradients – keep backgrounds mostly matte black.
- The weasel logo can glow; the rest of the UI is disciplined.
- Any playful copy is surrounded by **serious data** – always pair jokes with charts or numbers.

