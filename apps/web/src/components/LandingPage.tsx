"use client";

import Link from "next/link";
import Image from "next/image";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-sw-bg">
      {/* Hero Section */}
      <section className="sw-hero-bg border-b border-sw-border-subtle relative overflow-hidden">
        <div className="container mx-auto flex flex-col items-center gap-10 px-6 py-16 md:flex-row md:justify-between relative z-10">
          <div className="max-w-xl space-y-6">
            <div className="mb-4">
              <Image
                src="/squeezeweasel.svg"
                alt="SqueezeWeasel"
                width={200}
                height={60}
                className="max-w-[200px] h-auto"
                priority
              />
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-sw-text-primary md:text-5xl">
              Let the Weasel Hunt the Squeezes.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-sw-text-secondary">
              SqueezeWeasel scans Reddit sentiment and short-interest data to
              surface clean, explainable short-squeeze signals — before the crowd
              sees them.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/agents/new"
                className="px-6 py-3 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover"
              >
                Start My Radar
              </Link>
              <Link
                href="/agents"
                className="px-6 py-3 border border-sw-accent-green-soft text-sw-text-primary rounded-lg font-semibold hover:bg-sw-bg-elevated sw-glow-hover"
              >
                See a Sample Briefing
              </Link>
            </div>
            <p className="text-xs text-sw-text-muted">
              No hype, no financial advice. Just signals and receipts.
            </p>
          </div>

          <div className="mt-8 w-full max-w-md md:mt-0">
            <div className="relative overflow-hidden rounded-2xl border border-sw-border-subtle bg-sw-bg-elevated p-4 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
              <div className="mb-3 flex items-center justify-between text-xs text-sw-text-muted">
                <span>Today&apos;s Squeeze Radar</span>
                <span className="inline-flex items-center gap-1 text-[0.65rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-sw-accent-green animate-pulse" />
                  Live Scan
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {["GME", "AMC", "BBBYQ", "TSLA", "PLTR", "NVDA", "AAPL"].map((ticker, i) => (
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

      {/* Why This Exists */}
      <section className="py-16 border-b border-sw-border-subtle">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-sw-text-primary mb-2">
                Too many posts
              </h3>
              <p className="text-sm text-sw-text-secondary">
                Reddit, X, discords — millions of messages. You&apos;ll miss things.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔊</div>
              <h3 className="text-lg font-semibold text-sw-text-primary mb-2">
                Too much noise
              </h3>
              <p className="text-sm text-sw-text-secondary">
                Everything looks like a squeeze… until it doesn&apos;t.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-sw-text-primary mb-2">
                Too expensive tools
              </h3>
              <p className="text-sm text-sw-text-secondary">
                Big-name scanners cost more per month than some accounts.
              </p>
            </div>
          </div>
          <p className="text-center text-sw-text-secondary max-w-2xl mx-auto">
            SqueezeWeasel is a focused radar: one job, done well.
          </p>
        </div>
      </section>

      {/* How SqueezeWeasel Hunts */}
      <section className="py-16 border-b border-sw-border-subtle bg-sw-bg-elevated">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-sw-text-primary">
            How SqueezeWeasel Hunts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Scan the chatter",
                description:
                  "Weasel pulls posts and comments from your chosen subs, focused on tickers.",
              },
              {
                step: "2",
                title: "Score the vibes",
                description:
                  "LLMs classify sentiment and squeeze language — not just mentions.",
              },
              {
                step: "3",
                title: "Check the numbers",
                description:
                  "Short interest, float, and borrow stats for the most-talked-about tickers.",
              },
              {
                step: "4",
                title: "Rank and brief",
                description:
                  "You wake up to a ranked watchlist and an at-a-glance brief.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-sw-accent-green flex items-center justify-center mb-4 bg-sw-bg">
                    <span className="text-2xl font-bold text-sw-accent-green">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-sw-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-sw-text-secondary">{item.description}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-sw-accent-green/30 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Actually Get */}
      <section className="py-16 border-b border-sw-border-subtle">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-sw-text-primary">
            What You Actually Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Daily Squeeze Briefing",
                description:
                  "Your browser or inbox gets a single clean summary: the tickers, the scores, the reasons.",
              },
              {
                title: "Backtests & Receipts",
                description:
                  "Run SqueezeWeasel on last month&apos;s data. See how early it would have flagged the movers.",
              },
              {
                title: "Watchlist Mode",
                description:
                  "Focus the Weasel on your tickers. Get pinged when the pressure changes.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-sw-accent-green-soft bg-sw-bg-elevated p-6 hover:border-sw-accent-green sw-glow-hover transition-all"
              >
                <h3 className="text-xl font-semibold text-sw-text-primary mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-sw-text-secondary">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 border-b border-sw-border-subtle bg-sw-bg-elevated">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-sw-text-primary">
            Compared to the Other Guys
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-sw-border-subtle">
                  <th className="text-left p-4 text-sw-text-primary font-semibold"></th>
                  <th className="text-center p-4 text-sw-text-primary font-semibold">
                    Manual Scanning
                  </th>
                  <th className="text-center p-4 text-sw-text-primary font-semibold">
                    Legacy Scanners
                  </th>
                  <th className="text-center p-4 text-sw-accent-green font-semibold">
                    SqueezeWeasel
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Setup time",
                    manual: "Hours per day",
                    legacy: "Days to weeks",
                    weasel: "5 minutes",
                  },
                  {
                    feature: "Monthly cost",
                    manual: "Your time",
                    legacy: "$500+",
                    weasel: "Founding member pricing",
                  },
                  {
                    feature: "Explainability",
                    manual: "✖",
                    legacy: "✖",
                    weasel: "✓",
                  },
                  {
                    feature: "Customizability",
                    manual: "Limited",
                    legacy: "✖",
                    weasel: "✓",
                  },
                  {
                    feature: "MCP/AI Integration",
                    manual: "✖",
                    legacy: "✖",
                    weasel: "✓",
                  },
                ].map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-sw-border-subtle hover:bg-sw-bg transition-colors"
                  >
                    <td className="p-4 text-sw-text-primary font-medium">
                      {row.feature}
                    </td>
                    <td className="p-4 text-center text-sw-text-secondary">
                      {row.manual}
                    </td>
                    <td className="p-4 text-center text-sw-text-secondary">
                      {row.legacy}
                    </td>
                    <td className="p-4 text-center text-sw-accent-green font-medium">
                      {row.weasel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 border-b border-sw-border-subtle">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-8 text-center">
            <p className="text-lg text-sw-text-secondary mb-4">
              SqueezeWeasel is priced like a serious tool, not a luxury terminal.
              <br />
              Early users get founding-member pricing and direct input on features.
            </p>
            <Link
              href="/agents/new"
              className="inline-block px-6 py-3 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover"
            >
              Get on the Early Access List
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ + Disclaimer */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-sw-text-primary">FAQ</h2>
          <div className="space-y-6 mb-12">
            {[
              {
                q: "What data sources does SqueezeWeasel use?",
                a: "SqueezeWeasel pulls from Reddit (via API or HTTP) and short-interest data providers like Fintel. You configure which subreddits and time windows to scan.",
              },
              {
                q: "How often does it run?",
                a: "You can schedule daily runs (e.g., pre-market, market close) or trigger manual runs. The agent runs on your schedule, not ours.",
              },
              {
                q: "Can I backtest my configuration?",
                a: "Yes. Run SqueezeWeasel on historical data to see how your risk profile and thresholds would have performed. All backtests are clearly marked as hypothetical.",
              },
              {
                q: "Is this financial advice?",
                a: "No. SqueezeWeasel surfaces signals and summaries based on your configuration. You are responsible for your trading decisions.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-sw-border-subtle pb-4">
                <h3 className="text-lg font-semibold text-sw-text-primary mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-sw-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-sw-accent-red/50 pt-6">
            <p className="text-xs text-sw-text-muted leading-relaxed">
              <strong className="text-sw-accent-red">Disclaimer:</strong> Nothing on
              this site or in this product is financial advice. SqueezeWeasel surfaces
              signals, not instructions. Trade at your own risk.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

