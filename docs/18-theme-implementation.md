# SqueezeWeasel Theme Implementation (Tailwind + shadcn/ui)

This doc shows **concrete code** to wire the SqueezeWeasel dark theme into:

- `tailwind.config`
- `globals.css` (CSS vars)
- shadcn/ui config (button, card, input, etc.)
- A simple `ThemeProvider` pattern

---

## 1. Tailwind Config

File: `apps/web/tailwind.config.mts` (or `.cjs` depending on setup)

```ts
import type { Config } from "tailwindcss";

import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sw: {
          bg: "#050608",
          "bg-elevated": "#0b0f14",
          "border-subtle": "#181c22",
          "border-strong": "#262b35",
          text: {
            primary: "#ffffff",
            secondary: "#b3bfd4",
            muted: "#6c7385",
          },
          accent: {
            green: "#26f68c",
            "green-soft": "#1cae62",
            red: "#ff3355",
            amber: "#ffc857",
          },
          state: {
            success: "#26f68c",
            error: "#ff3355",
            warning: "#ffc857",
            info: "#5ad1ff",
          },
        },
      },
      boxShadow: {
        "sw-glow-green":
          "0 0 0 1px rgba(38, 246, 140, 0.5), 0 0 32px rgba(38, 246, 140, 0.2)",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          ...fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 2. CSS Variables & Base Styles

File: `apps/web/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Light theme (fallback) – not primary focus, but keep sane defaults */
  --background: #ffffff;
  --foreground: #02050a;

  --card: #f5f7fb;
  --card-foreground: #02050a;

  --popover: #ffffff;
  --popover-foreground: #02050a;

  --primary: #111827;
  --primary-foreground: #f9fafb;

  --secondary: #e5e7eb;
  --secondary-foreground: #111827;

  --muted: #e5e7eb;
  --muted-foreground: #4b5563;

  --accent: #10b981;
  --accent-foreground: #022c22;

  --destructive: #ef4444;
  --destructive-foreground: #f9fafb;

  --border: #d1d5db;
  --input: #d1d5db;
  --ring: #111827;

  --radius: 0.9rem;
}

.sw-dark {
  color-scheme: dark;

  --background: #050608;
  --foreground: #ffffff;

  --card: #0b0f14;
  --card-foreground: #ffffff;

  --popover: #050608;
  --popover-foreground: #ffffff;

  --primary: #26f68c;
  --primary-foreground: #050608;

  --secondary: #181c22;
  --secondary-foreground: #ffffff;

  --muted: #181c22;
  --muted-foreground: #b3bfd4;

  --accent: #26f68c;
  --accent-foreground: #050608;

  --destructive: #ff3355;
  --destructive-foreground: #050608;

  --border: #181c22;
  --input: #262b35;
  --ring: #26f68c;

  --chart-1: #26f68c;
  --chart-2: #ffc857;
  --chart-3: #ff3355;
  --chart-4: #5ad1ff;
  --chart-5: #a855f7;

  --radius: 0.9rem;
}

body.sw-dark {
  @apply bg-sw-bg text-sw-text-primary antialiased;
}

/* Simple hero grid / scan-line treatment */

.sw-hero-bg {
  background: radial-gradient(circle at top, #10151f 0, #050608 55%);
  position: relative;
}

.sw-hero-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image: linear-gradient(
      rgba(38, 246, 140, 0.2) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(38, 246, 140, 0.12) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
```

---

## 3. ThemeProvider

File: `apps/web/app/ThemeProvider.tsx`

```tsx
"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.classList.add("sw-dark");
    return () => {
      document.body.classList.remove("sw-dark");
    };
  }, []);

  return <>{children}</>;
}
```

Use in `app/layout.tsx`:

```tsx
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 4. shadcn/ui Theme Hookup

In `packages/ui/src/components/button.tsx` (or wherever shadcn lives), use the CSS vars:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary)_80%,#16a15e_20%)] hover:shadow-sw-glow-green",
        outline:
          "border border-[color-mix(in_srgb,var(--primary)_70%,#1cae62_30%)] text-foreground hover:bg-[rgba(38,246,140,0.06)] hover:shadow-sw-glow-green",
        ghost:
          "text-muted-foreground hover:bg-[rgba(38,246,140,0.06)] hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[color-mix(in_srgb,var(--destructive)_80%,#c81e45_20%)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
```

Cards & inputs follow the same pattern, relying on `bg-card`, `border-border`, and `text-foreground`.

---

## 5. Example Hero Layout

Simple hero section using the theme:

```tsx
// apps/web/components/Hero.tsx
import { Button } from "@squeezeweasel/ui/button";

export function Hero() {
  return (
    <section className="sw-hero-bg border-b border-sw-border-subtle">
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div className="max-w-xl space-y-6">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sw-text-muted">
            <span className="h-1 w-6 rounded-full bg-sw-accent-green" />
            Short-Squeeze Radar
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-sw-text-primary md:text-5xl">
            Let the Weasel Hunt the Squeezes.
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-sw-text-secondary">
            SqueezeWeasel scans Reddit sentiment and short-interest data to
            surface clean, explainable short-squeeze signals — before the crowd
            sees them.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Start My Radar</Button>
            <Button variant="outline" size="lg">
              See a Sample Briefing
            </Button>
          </div>
          <p className="text-xs text-sw-text-muted">
            No hype, no financial advice. Just signals and receipts.
          </p>
        </div>

        <div className="mt-8 w-full max-w-md md:mt-0">
          {/* Placeholder for the dashboard mock */}
          <div className="relative overflow-hidden rounded-2xl border border-sw-border-subtle bg-sw-bg-elevated p-4 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            <div className="mb-3 flex items-center justify-between text-xs text-sw-text-muted">
              <span>Today&apos;s Squeeze Radar</span>
              <span className="inline-flex items-center gap-1 text-[0.65rem]">
                <span className="h-1.5 w-1.5 rounded-full bg-sw-accent-green" />
                Live Scan
              </span>
            </div>
            {/* Fake list */}
            <div className="space-y-2 text-xs">
              {["GME", "AMC", "BBBYQ", "TSLA", "PLTR"].map((ticker, i) => (
                <div
                  key={ticker}
                  className="flex items-center justify-between rounded-lg bg-[#0f141c] px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-sw-text-primary">
                      {ticker}
                    </span>
                    <span className="text-[0.7rem] text-sw-text-muted">
                      SqueezeScore: {78 + i * 3}
                    </span>
                  </div>
                  <div className="ml-4 h-2 w-32 overflow-hidden rounded-full bg-sw-border-subtle">
                    <div
                      className="h-full bg-gradient-to-r from-sw-accent-red via-sw-accent-amber to-sw-accent-green"
                      style={{ width: `${65 + i * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

That's the theme layer wired.

Next: the dashboard layout itself.

