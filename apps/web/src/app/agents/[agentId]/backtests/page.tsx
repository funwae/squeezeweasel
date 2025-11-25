"use client";

import { useParams } from "next/navigation";

export default function BacktestsPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  return (
    <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-sw-text-primary">Backtests</h1>
            <p className="text-sm text-sw-text-muted mt-1">
              Run SqueezeWeasel on historical data to see how it would have performed
            </p>
          </div>
          <button className="px-4 py-2 bg-sw-accent-green text-sw-bg rounded-lg font-medium hover:bg-sw-accent-green-soft sw-glow-hover">
            Run Backtest
          </button>
        </div>

        <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
          <p className="text-sm text-sw-text-muted">
            No backtests yet. Run your first backtest to see historical performance.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-sw-accent-red/30 bg-sw-bg-elevated p-4">
          <p className="text-xs text-sw-text-muted">
            <strong className="text-sw-accent-red">Disclaimer:</strong> Backtests are
            hypothetical and do not guarantee future results. Past performance is not
            indicative of future returns.
          </p>
        </div>
      </div>
  );
}

