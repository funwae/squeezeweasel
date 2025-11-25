"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isDemoMode } from "@/lib/demo-utils";

interface AgentLayoutProps {
  children: React.ReactNode;
  agentId: string;
  agentName?: string;
}

export function AgentLayout({ children, agentId, agentName }: AgentLayoutProps) {
  const pathname = usePathname();
  const demoMode = isDemoMode();

  const navItems = demoMode
    ? [
        { href: `/agents/${agentId}/overview`, label: "Radar Overview", icon: "📊" },
        { href: `/agents/${agentId}/backtests`, label: "Backtests", icon: "📈" },
        { href: `/agents/${agentId}/settings`, label: "Settings", icon: "⚙️" },
        { href: `/agents/${agentId}/builder`, label: "Flow Builder", icon: "🔧", badge: "Read-only" },
      ]
    : [
        { href: `/agents/${agentId}/overview`, label: "Radar", icon: "📊" },
        { href: `/agents/${agentId}/backtests`, label: "Backtests", icon: "📈" },
        { href: `/agents/${agentId}/watchlists`, label: "Watchlists", icon: "👁️" },
        { href: `/agents/${agentId}/settings`, label: "Settings", icon: "⚙️" },
        { href: `/agents/${agentId}/builder`, label: "Flow Builder", icon: "🔧" },
      ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="flex h-screen bg-sw-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sw-border-subtle bg-sw-bg-elevated flex flex-col">
        <div className="p-6 border-b border-sw-border-subtle">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-sw-accent-green">SqueezeWeasel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-sw-accent-green/10 text-sw-accent-green border-l-2 border-sw-accent-green"
                  : "text-sw-text-secondary hover:bg-sw-bg hover:text-sw-text-primary"
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {(item as any).badge && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded bg-sw-border-subtle text-sw-text-muted">
                  {(item as any).badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sw-border-subtle space-y-2">
          <div className="px-4 py-2 rounded-lg bg-sw-bg">
            <div className="text-xs text-sw-text-muted mb-1">Agent Status</div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sw-accent-green" />
              <span className="text-sm font-medium text-sw-text-primary">Active</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-sw-bg">
            <div className="text-xs text-sw-text-muted mb-1">MCP</div>
            <div className="text-sm font-medium text-sw-accent-green">Enabled</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="border-b border-sw-border-subtle bg-sw-bg px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-sw-text-primary">
                {agentName || "Radar Overview"}
              </h1>
              <p className="text-sm text-sw-text-muted">Daily short-squeeze briefing</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-sw-text-muted">Next hunt in</div>
                <div className="text-sm font-mono text-sw-accent-green">03:21:54</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-sw-text-muted">Session</div>
                <div className="text-sm text-sw-text-primary">Pre-market</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

