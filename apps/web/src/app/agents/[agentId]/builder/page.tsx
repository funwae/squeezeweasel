"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AgentCanvas from "@/components/AgentCanvas";
import NodePalette from "@/components/NodePalette";
import NodeConfigPanel from "@/components/NodeConfigPanel";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth-client";
import { isDemoMode } from "@/lib/demo-utils";
import type { Node, Edge } from "@xyflow/react";

export default function AgentBuilderPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const readOnly = isDemoMode();

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }

    // TODO: Load agent flow graph
    // For now, load empty flow
    setLoading(false);
  }, [agentId]);

  const handleFlowChange = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
  };

  const handleConfigChange = (nodeId: string, config: Record<string, unknown>) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            config,
            label: (config.label as string) || node.data?.label,
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(updatedNodes.find((n) => n.id === nodeId) || null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert ReactFlow nodes/edges to FlowGraph format
      const flowGraph = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: (node.data?.type as string) || "output",
          label: (node.data?.label as string) || node.id,
          config: (node.data?.config as Record<string, unknown>) || {},
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          from: edge.source,
          to: edge.target,
          condition: edge.label as string | undefined,
        })),
      };

      // TODO: Save to API
      // await apiClient.agents.updateFlow(agentId, flowGraph);
      console.log("Saving flow:", flowGraph);

      // Temporary success feedback
      alert("Flow saved successfully!");
    } catch (error) {
      console.error("Failed to save flow:", error);
      alert("Failed to save flow. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-sw-text-secondary">Loading builder...</div>
      </div>
    );
  }

  return (
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Node Palette (hidden in read-only mode) */}
        {!readOnly && <NodePalette />}

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-sw-border-subtle bg-sw-bg-elevated">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-sw-text-primary">Flow Builder</h1>
                {readOnly && (
                  <p className="text-sm text-sw-text-muted mt-1">
                    Read-only view • Editing disabled in demo mode
                  </p>
                )}
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Flow"}
                  </button>
                </div>
              )}
            </div>
          </div>
          {readOnly && (
            <div className="p-4 border-b border-sw-border-subtle">
              <DemoModeBanner />
            </div>
          )}
          <div className="flex-1 relative">
            <AgentCanvas
              initialNodes={nodes}
              initialEdges={edges}
              onFlowChange={handleFlowChange}
              onNodeSelect={handleNodeSelect}
              selectedNodeId={selectedNode?.id || null}
              readOnly={readOnly}
            />
          </div>
        </div>

        {/* Right Sidebar - Node Config Panel */}
        <NodeConfigPanel
          selectedNode={selectedNode}
          onConfigChange={handleConfigChange}
        />
      </div>
  );
}


