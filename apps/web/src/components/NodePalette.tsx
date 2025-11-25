"use client";

import { useCallback } from "react";
import type { NodeType } from "@squeezeweasel/shared-types";

interface NodeCategory {
  name: string;
  icon: string;
  nodes: NodeDefinition[];
}

interface NodeDefinition {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  category: string;
}

const nodeDefinitions: NodeDefinition[] = [
  // Triggers
  {
    type: "trigger.schedule",
    label: "Schedule",
    icon: "⏰",
    description: "Run on a schedule (cron, daily, weekly)",
    category: "Triggers",
  },
  {
    type: "trigger.webhook",
    label: "Webhook",
    icon: "🔗",
    description: "Trigger via HTTP webhook",
    category: "Triggers",
  },
  // LLM
  {
    type: "llm",
    label: "LLM",
    icon: "🤖",
    description: "Call an LLM for classification, extraction, or generation",
    category: "AI",
  },
  // Transforms
  {
    type: "transform",
    label: "Transform",
    icon: "🔄",
    description: "Transform or reshape data",
    category: "Data",
  },
  // Conditions
  {
    type: "condition",
    label: "Condition",
    icon: "❓",
    description: "Branch based on condition",
    category: "Logic",
  },
  {
    type: "loop",
    label: "Loop",
    icon: "🔁",
    description: "Iterate over items",
    category: "Logic",
  },
  // Tools
  {
    type: "tool.http",
    label: "HTTP",
    icon: "🌐",
    description: "Make HTTP request",
    category: "Tools",
  },
  {
    type: "tool.email",
    label: "Email",
    icon: "📧",
    description: "Send email",
    category: "Tools",
  },
  {
    type: "tool.sms",
    label: "SMS",
    icon: "💬",
    description: "Send SMS",
    category: "Tools",
  },
  {
    type: "tool.db",
    label: "Database",
    icon: "🗄️",
    description: "Query database",
    category: "Tools",
  },
  {
    type: "tool.webhook",
    label: "Webhook",
    icon: "🔔",
    description: "Call external webhook",
    category: "Tools",
  },
  {
    type: "tool.reddit",
    label: "Reddit",
    icon: "📱",
    description: "Fetch Reddit posts and comments",
    category: "Tools",
  },
  {
    type: "tool.stock",
    label: "Stock Data",
    icon: "📈",
    description: "Fetch stock market data",
    category: "Tools",
  },
  // Output
  {
    type: "output",
    label: "Output",
    icon: "📤",
    description: "Final output node",
    category: "Output",
  },
];

const categories: NodeCategory[] = [
  {
    name: "Triggers",
    icon: "🚀",
    nodes: nodeDefinitions.filter((n) => n.category === "Triggers"),
  },
  {
    name: "AI",
    icon: "🤖",
    nodes: nodeDefinitions.filter((n) => n.category === "AI"),
  },
  {
    name: "Data",
    icon: "📊",
    nodes: nodeDefinitions.filter((n) => n.category === "Data"),
  },
  {
    name: "Logic",
    icon: "⚙️",
    nodes: nodeDefinitions.filter((n) => n.category === "Logic"),
  },
  {
    name: "Tools",
    icon: "🔧",
    nodes: nodeDefinitions.filter((n) => n.category === "Tools"),
  },
  {
    name: "Output",
    icon: "📤",
    nodes: nodeDefinitions.filter((n) => n.category === "Output"),
  },
];

interface NodePaletteProps {
  onNodeDragStart?: (nodeType: NodeType, event: React.DragEvent) => void;
}

export default function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  const handleDragStart = useCallback(
    (nodeType: NodeType, event: React.DragEvent) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
      if (onNodeDragStart) {
        onNodeDragStart(nodeType, event);
      }
    },
    [onNodeDragStart]
  );

  return (
    <div className="w-64 h-full bg-sw-bg-elevated border-r border-sw-border-subtle overflow-y-auto">
      <div className="p-4 border-b border-sw-border-subtle">
        <h2 className="text-lg font-semibold text-sw-text-primary">Node Palette</h2>
        <p className="text-sm text-sw-text-secondary mt-1">
          Drag nodes to canvas
        </p>
      </div>
      <div className="p-2">
        {categories.map((category) => (
          <div key={category.name} className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <span className="text-sm">{category.icon}</span>
              <h3 className="text-sm font-medium text-sw-text-secondary uppercase tracking-wide">
                {category.name}
              </h3>
            </div>
            <div className="space-y-1">
              {category.nodes.map((node) => (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(e) => handleDragStart(node.type, e)}
                  className="px-3 py-2 bg-sw-bg border border-sw-border-subtle rounded-lg cursor-grab active:cursor-grabbing hover:border-sw-accent-green hover:bg-sw-bg-hover transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{node.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-sw-text-primary group-hover:text-sw-accent-green transition-colors">
                        {node.label}
                      </div>
                      <div className="text-xs text-sw-text-secondary mt-0.5 line-clamp-1">
                        {node.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

