"use client";

import { useParams } from "next/navigation";

export default function WatchlistsPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  return (
    <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-sw-text-primary">Watchlists</h1>
          <p className="text-sm text-sw-text-muted mt-1">
            Focus the Weasel on specific tickers you care about
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
              My Watchlists
            </h2>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-sw-bg border border-sw-border-subtle">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sw-text-primary">High Priority</div>
                    <div className="text-xs text-sw-text-muted">12 tickers</div>
                  </div>
                  <button className="text-xs text-sw-accent-green">View</button>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 border border-sw-border-subtle text-sw-text-primary rounded-lg font-medium hover:bg-sw-bg">
              Create Watchlist
            </button>
          </div>

          <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
              Watchlist Detail
            </h2>
            <p className="text-sm text-sw-text-muted">
              Select a watchlist to view details
            </p>
          </div>
        </div>
      </div>
  );
}

