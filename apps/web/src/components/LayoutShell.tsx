"use client";

import Link from "next/link";

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-sw-bg-elevated border-b border-sw-border-subtle p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-sw-accent-green">
            SqueezeWeasel
          </Link>
          <div className="space-x-4">
            <Link
              href="/agents"
              className="text-sw-text-secondary hover:text-sw-text-primary transition-colors"
            >
              Agents
            </Link>
            <Link
              href="/templates"
              className="text-sw-text-secondary hover:text-sw-text-primary transition-colors"
            >
              Templates
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="bg-sw-bg-elevated border-t border-sw-border-subtle p-4 text-center">
        <p className="text-sw-text-muted text-sm">
          &copy; 2024 SqueezeWeasel. Not financial advice.
        </p>
      </footer>
    </div>
  );
}

