"use client";

/**
 * Demo Mode Banner - displays when demo mode is active
 */
export function DemoModeBanner() {
  // Check if demo mode is enabled via environment variable
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="bg-sw-accent-green/10 border border-sw-accent-green/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-sw-accent-green text-xl">ℹ️</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-sw-accent-green mb-1">
            Demo Mode Active
          </h3>
          <p className="text-sm text-sw-text-secondary">
            Using sample data representing real prior runs. This demo showcases SqueezeWeasel&apos;s
            capabilities with deterministic, repeatable results.
          </p>
        </div>
      </div>
    </div>
  );
}

