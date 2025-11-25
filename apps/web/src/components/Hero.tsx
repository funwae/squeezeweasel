"use client";

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
            <button className="px-6 py-3 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover">
              Start My Radar
            </button>
            <button className="px-6 py-3 border border-sw-accent-green-soft text-sw-text-primary rounded-lg font-semibold hover:bg-sw-bg-elevated sw-glow-hover">
              See a Sample Briefing
            </button>
          </div>
          <p className="text-xs text-sw-text-muted">
            No hype, no financial advice. Just signals and receipts.
          </p>
        </div>

        <div className="mt-8 w-full max-w-md md:mt-0">
          {/* Dashboard mock */}
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

