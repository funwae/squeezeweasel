"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth-client";
import Link from "next/link";

interface CandidateData {
  ticker: string;
  squeezeScore: number;
  explanation: string;
  sentiment: number;
  squeezeVibe: number;
  shortInterest: number;
  utilization: number;
  mentions: number;
  components?: {
    sentiment: number;
    squeezeVibe: number;
    shortInterest: number;
    utilization: number;
    normalizedShortInterest: number;
    normalizedUtilization: number;
  };
}

export default function CandidateDetailPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const ticker = params.ticker as string;
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }

    // TODO: Load candidate data from latest run
    // For now, use mock data based on ticker
    const mockData: Record<string, CandidateData> = {
      GME: {
        ticker: "GME",
        squeezeScore: 85.2,
        explanation: "SqueezeScore: 85.2/100 - Strong bullish sentiment (8.5/10), High squeeze-related discussion (8.2/10), Very high short interest (25.5%), Very high utilization (88.2%).",
        sentiment: 8.5,
        squeezeVibe: 8.2,
        shortInterest: 25.5,
        utilization: 88.2,
        mentions: 234,
        components: {
          sentiment: 8.5,
          squeezeVibe: 8.2,
          shortInterest: 25.5,
          utilization: 88.2,
          normalizedShortInterest: 5.1,
          normalizedUtilization: 8.8,
        },
      },
      AMC: {
        ticker: "AMC",
        squeezeScore: 78.4,
        explanation: "SqueezeScore: 78.4/100 - Strong bullish sentiment (7.8/10), High squeeze-related discussion (7.5/10), High short interest (18.3%), Very high utilization (92.1%).",
        sentiment: 7.8,
        squeezeVibe: 7.5,
        shortInterest: 18.3,
        utilization: 92.1,
        mentions: 189,
        components: {
          sentiment: 7.8,
          squeezeVibe: 7.5,
          shortInterest: 18.3,
          utilization: 92.1,
          normalizedShortInterest: 3.7,
          normalizedUtilization: 9.2,
        },
      },
      BBBY: {
        ticker: "BBBY",
        squeezeScore: 72.1,
        explanation: "SqueezeScore: 72.1/100 - Moderate bullish sentiment (7.2/10), Moderate squeeze-related discussion (6.8/10), Very high short interest (32.1%), High utilization (75.8%).",
        sentiment: 7.2,
        squeezeVibe: 6.8,
        shortInterest: 32.1,
        utilization: 75.8,
        mentions: 156,
        components: {
          sentiment: 7.2,
          squeezeVibe: 6.8,
          shortInterest: 32.1,
          utilization: 75.8,
          normalizedShortInterest: 6.4,
          normalizedUtilization: 7.6,
        },
      },
    };

    const data = mockData[ticker.toUpperCase()] || {
      ticker: ticker.toUpperCase(),
      squeezeScore: 65.0,
      explanation: "SqueezeScore: 65.0/100 - Moderate signals detected.",
      sentiment: 6.5,
      squeezeVibe: 6.0,
      shortInterest: 15.0,
      utilization: 60.0,
      mentions: 50,
    };

    setCandidate(data);
    setLoading(false);
  }, [ticker]);

  if (loading || !candidate) {
    return <div className="p-8">Loading candidate details...</div>;
  }

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "Strong";
    if (score >= 70) return "Moderate";
    return "Weak";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-sw-accent-green";
    if (score >= 70) return "text-sw-accent-amber";
    return "text-sw-accent-red";
  };

  const scoreLabel = getScoreLabel(candidate.squeezeScore);
  const scoreColor = getScoreColor(candidate.squeezeScore);

  return (
    <div className="p-8">
        <DemoModeBanner />
        <div className="mb-6">
          <Link
            href={`/agents/${agentId}/overview`}
            className="text-sm text-sw-text-secondary hover:text-sw-accent-green transition-colors"
          >
            ← Back to Radar Overview
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-sw-text-primary mb-2">
                {candidate.ticker} – Today&apos;s Read
              </h1>
              <div className="flex items-center gap-4 mb-2">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${scoreColor}/20 border border-${scoreColor}/30`}>
                  <span className={`text-2xl font-bold ${scoreColor}`}>
                    {candidate.squeezeScore.toFixed(1)}
                  </span>
                  <span className="text-sm text-sw-text-secondary">SqueezeScore</span>
                </div>
                <span className={`text-sm font-semibold ${scoreColor}`}>
                  {scoreLabel} Signal
                </span>
              </div>
              <p className="text-sm text-sw-text-muted mt-2">
                {candidate.explanation}
              </p>
            </div>

            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
                SqueezeScore Breakdown
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-sw-text-secondary">Sentiment Score</span>
                    <span className="text-sm font-medium text-sw-text-primary">
                      {candidate.sentiment.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 bg-sw-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sw-accent-red via-sw-accent-amber to-sw-accent-green"
                      style={{ width: `${(candidate.sentiment / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-sw-text-secondary">Squeeze-Vibe Score</span>
                    <span className="text-sm font-medium text-sw-text-primary">
                      {candidate.squeezeVibe.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 bg-sw-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sw-accent-red via-sw-accent-amber to-sw-accent-green"
                      style={{ width: `${(candidate.squeezeVibe / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-sw-text-secondary">Short Interest</span>
                    <span className="text-sm font-medium text-sw-text-primary">
                      {candidate.shortInterest.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-sw-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sw-accent-red"
                      style={{ width: `${Math.min((candidate.shortInterest / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-sw-text-secondary">Utilization</span>
                    <span className="text-sm font-medium text-sw-text-primary">
                      {candidate.utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-sw-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sw-accent-green"
                      style={{ width: `${candidate.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
                Key Metrics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-sw-text-muted mb-1">Mentions</div>
                  <div className="text-xl font-bold text-sw-text-primary">{candidate.mentions}</div>
                </div>
                <div>
                  <div className="text-xs text-sw-text-muted mb-1">Short Interest</div>
                  <div className="text-xl font-bold text-sw-text-primary">
                    {candidate.shortInterest.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sw-text-muted mb-1">Utilization</div>
                  <div className="text-xl font-bold text-sw-accent-green">
                    {candidate.utilization.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sw-text-muted mb-1">SqueezeScore</div>
                  <div className={`text-xl font-bold ${scoreColor}`}>
                    {candidate.squeezeScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
                Price & Volume
              </h2>
              <div className="h-32 bg-sw-bg rounded-lg flex items-center justify-center text-sw-text-muted text-sm">
                Sparkline chart placeholder
              </div>
            </div>

            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
                Why Weasel Flagged This
              </h2>
              <ul className="space-y-2 text-sm text-sw-text-secondary">
                {candidate.sentiment >= 7 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>
                      Strong bullish sentiment ({candidate.sentiment.toFixed(1)}/10)
                    </span>
                  </li>
                )}
                {candidate.squeezeVibe >= 7 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>
                      High squeeze-related discussion ({candidate.squeezeVibe.toFixed(1)}/10)
                    </span>
                  </li>
                )}
                {candidate.shortInterest >= 20 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>
                      Very high short interest ({candidate.shortInterest.toFixed(1)}%)
                    </span>
                  </li>
                )}
                {candidate.shortInterest >= 15 && candidate.shortInterest < 20 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>
                      High short interest ({candidate.shortInterest.toFixed(1)}%)
                    </span>
                  </li>
                )}
                {candidate.utilization >= 80 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>
                      Very high utilization ({candidate.utilization.toFixed(1)}%)
                    </span>
                  </li>
                )}
                {candidate.mentions >= 100 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>Mention count above threshold ({candidate.mentions} mentions)</span>
                  </li>
                )}
                {candidate.squeezeScore >= 80 && (
                  <li className="flex items-start gap-2">
                    <span className="text-sw-accent-green mt-1">✓</span>
                    <span>SqueezeScore above 80 (strong signal)</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}

