"use client";

import { useParams } from "next/navigation";

export default function SettingsPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  return (
    <div className="p-8">
        <h1 className="text-2xl font-semibold text-sw-text-primary mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Hunting Grounds */}
          <section className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
              Hunting Grounds
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sw-text-secondary mb-2">
                  Subreddits
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary"
                  placeholder="r/shortsqueeze, r/wallstreetbets"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sw-text-secondary mb-2">
                  Time Window
                </label>
                <select className="w-full px-4 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary">
                  <option>Last 12 hours</option>
                  <option>Last 24 hours</option>
                  <option>Last 48 hours</option>
                </select>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
              Data Sources
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-sw-bg border border-sw-border-subtle">
                <div>
                  <div className="font-medium text-sw-text-primary">Reddit API</div>
                  <div className="text-xs text-sw-text-muted">Connected</div>
                </div>
                <button className="text-xs text-sw-accent-green hover:underline">
                  Reconnect
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-sw-bg border border-sw-border-subtle">
                <div>
                  <div className="font-medium text-sw-text-primary">Fintel API</div>
                  <div className="text-xs text-sw-text-muted">Not connected</div>
                </div>
                <button className="text-xs text-sw-accent-green hover:underline">
                  Connect
                </button>
              </div>
            </div>
          </section>

          {/* Risk Profile */}
          <section className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
              Risk Profile
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                {["Conservative", "Balanced", "Aggressive"].map((profile) => (
                  <button
                    key={profile}
                    className="flex-1 px-4 py-2 border border-sw-border-subtle rounded-lg text-sm font-medium text-sw-text-primary hover:bg-sw-bg hover:border-sw-accent-green-soft"
                  >
                    {profile}
                  </button>
                ))}
              </div>
              <p className="text-xs text-sw-text-muted">
                Balanced profile: SqueezeScore threshold 70+, max 10 candidates per day
              </p>
            </div>
          </section>

          {/* MCP Settings */}
          <section className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
              MCP Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sw-text-primary">
                    Expose this Agent over MCP
                  </div>
                  <div className="text-xs text-sw-text-muted">
                    Allow AI assistants to trigger this agent via MCP
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sw-accent-green transition-colors">
                  <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-sw-bg transition" />
                </button>
              </div>
              <div className="p-3 rounded-lg bg-sw-bg border border-sw-border-subtle">
                <div className="text-xs text-sw-text-muted mb-1">Tool name:</div>
                <code className="text-xs text-sw-accent-green">squeezeweasel.run_agent</code>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}

