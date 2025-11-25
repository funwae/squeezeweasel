"use client";

import { useState, useEffect } from "react";
import type { Node } from "@xyflow/react";
import type { NodeType } from "@squeezeweasel/shared-types";

interface NodeConfigPanelProps {
  selectedNode: Node | null;
  onConfigChange?: (nodeId: string, config: Record<string, unknown>) => void;
}

export default function NodeConfigPanel({
  selectedNode,
  onConfigChange,
}: NodeConfigPanelProps) {
  const [config, setConfig] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (selectedNode) {
      setConfig((selectedNode.data?.config as Record<string, unknown>) || {});
    } else {
      setConfig({});
    }
  }, [selectedNode]);

  const handleConfigUpdate = (key: string, value: unknown) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (selectedNode && onConfigChange) {
      onConfigChange(selectedNode.id, newConfig);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-sw-bg-elevated border-l border-sw-border-subtle flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">⚙️</div>
          <p className="text-sw-text-secondary">
            Select a node to configure
          </p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.type as NodeType;

  return (
    <div className="w-80 h-full bg-sw-bg-elevated border-l border-sw-border-subtle overflow-y-auto">
      <div className="p-4 border-b border-sw-border-subtle">
        <h2 className="text-lg font-semibold text-sw-text-primary">
          Node Configuration
        </h2>
        <p className="text-sm text-sw-text-secondary mt-1">
          {(selectedNode.data?.label as string) || nodeType}
        </p>
      </div>
      <div className="p-4 space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-sw-text-primary mb-1">
            Label
          </label>
          <input
            type="text"
            value={(selectedNode.data?.label as string) || ""}
            onChange={(e) => {
              if (onConfigChange) {
                onConfigChange(selectedNode.id, {
                  ...config,
                  label: e.target.value,
                });
              }
            }}
            className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent"
            placeholder="Node label"
          />
        </div>

        {/* Type-specific configuration */}
        {nodeType === "trigger.schedule" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                Schedule Type
              </label>
              <select
                value={(config.scheduleType as string) || "daily"}
                onChange={(e) => handleConfigUpdate("scheduleType", e.target.value)}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="cron">Cron Expression</option>
              </select>
            </div>
            {(config.scheduleType as string) === "cron" ? (
              <div>
                <label className="block text-sm font-medium text-sw-text-primary mb-1">
                  Cron Expression
                </label>
                <input
                  type="text"
                  value={(config.cron as string) || ""}
                  onChange={(e) => handleConfigUpdate("cron", e.target.value)}
                  className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-sm"
                  placeholder="0 9 * * *"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-sw-text-primary mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={(config.time as string) || "09:00"}
                  onChange={(e) => handleConfigUpdate("time", e.target.value)}
                  className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {nodeType === "trigger.webhook" && (
          <div>
            <label className="block text-sm font-medium text-sw-text-primary mb-1">
              Webhook Path
            </label>
            <input
              type="text"
              value={(config.path as string) || ""}
              onChange={(e) => handleConfigUpdate("path", e.target.value)}
              className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-sm"
              placeholder="/webhook/my-agent"
            />
            <p className="text-xs text-sw-text-secondary mt-1">
              Auto-generated webhook URL will be shown after save
            </p>
          </div>
        )}

        {nodeType === "llm" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                Provider
              </label>
              <select
                value={(config.provider as string) || "openai"}
                onChange={(e) => handleConfigUpdate("provider", e.target.value)}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent"
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                Model
              </label>
              <select
                value={(config.model as string) || "gpt-4"}
                onChange={(e) => handleConfigUpdate("model", e.target.value)}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                System Prompt
              </label>
              <textarea
                value={(config.systemPrompt as string) || ""}
                onChange={(e) => handleConfigUpdate("systemPrompt", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-sm"
                placeholder="You are a helpful assistant..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                User Prompt Template
              </label>
              <textarea
                value={(config.userPrompt as string) || ""}
                onChange={(e) => handleConfigUpdate("userPrompt", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-sm"
                placeholder="Analyze: {{input}}"
              />
            </div>
          </div>
        )}

        {nodeType === "tool.http" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                Method
              </label>
              <select
                value={(config.method as string) || "GET"}
                onChange={(e) => handleConfigUpdate("method", e.target.value)}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                URL
              </label>
              <input
                type="text"
                value={(config.url as string) || ""}
                onChange={(e) => handleConfigUpdate("url", e.target.value)}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-sm"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sw-text-primary mb-1">
                Headers (JSON)
              </label>
              <textarea
                value={JSON.stringify(config.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleConfigUpdate("headers", parsed);
                  } catch {
                    // Invalid JSON, keep as is
                  }
                }}
                rows={4}
                className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-xs"
                placeholder='{"Authorization": "Bearer ..."}'
              />
            </div>
          </div>
        )}

        {nodeType === "condition" && (
          <div>
            <label className="block text-sm font-medium text-sw-text-primary mb-1">
              Condition Expression
            </label>
            <textarea
              value={(config.expression as string) || ""}
              onChange={(e) => handleConfigUpdate("expression", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-sm"
              placeholder="input.value > 100"
            />
            <p className="text-xs text-sw-text-secondary mt-1">
              JavaScript expression that evaluates to true/false
            </p>
          </div>
        )}

        {/* Generic config editor for other node types */}
        {!["trigger.schedule", "trigger.webhook", "llm", "tool.http", "condition"].includes(
          nodeType
        ) && (
          <div>
            <label className="block text-sm font-medium text-sw-text-primary mb-1">
              Configuration (JSON)
            </label>
            <textarea
              value={JSON.stringify(config, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setConfig(parsed);
                  if (onConfigChange) {
                    onConfigChange(selectedNode.id, parsed);
                  }
                } catch {
                  // Invalid JSON, keep as is
                }
              }}
              rows={8}
              className="w-full px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary focus:outline-none focus:ring-2 focus:ring-sw-accent-green focus:border-transparent font-mono text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}

