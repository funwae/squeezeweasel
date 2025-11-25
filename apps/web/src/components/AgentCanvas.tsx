"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { NodeType } from "@squeezeweasel/shared-types";

interface AgentCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onFlowChange?: (nodes: Node[], edges: Edge[]) => void;
  onNodeSelect?: (node: Node | null) => void;
  selectedNodeId?: string | null;
  readOnly?: boolean;
}

// Default node component
function DefaultNode({ data }: { data: { label?: string; type?: string } }) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md bg-sw-bg-elevated border border-sw-border-subtle min-w-[120px]">
      <div className="flex items-center gap-2">
        <div className="text-xs text-sw-text-secondary uppercase">
          {data.type || "node"}
        </div>
      </div>
      {data.label && (
        <div className="text-sm font-medium text-sw-text-primary mt-1">
          {data.label}
        </div>
      )}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  default: DefaultNode,
};

export default function AgentCanvas({
  initialNodes = [],
  initialEdges = [],
  onFlowChange,
  onNodeSelect,
  selectedNodeId,
  readOnly = false,
}: AgentCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      if (onFlowChange) {
        onFlowChange(nodes, newEdges);
      }
    },
    [nodes, edges, setEdges, onFlowChange, readOnly]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      if (readOnly) return;
      setNodes((nds) => nds.filter((n) => !deleted.find((d) => d.id === n.id)));
      if (onFlowChange) {
        const remainingNodes = nodes.filter((n) => !deleted.find((d) => d.id === n.id));
        onFlowChange(remainingNodes, edges);
      }
    },
    [nodes, edges, setNodes, onFlowChange, readOnly]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (readOnly) return;

      const nodeType = event.dataTransfer.getData("application/reactflow") as NodeType;
      if (!nodeType || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: "default",
        position,
        data: {
          label: nodeType.split(".").pop() || nodeType,
          type: nodeType,
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      if (onFlowChange) {
        onFlowChange(newNodes, edges);
      }
    },
    [reactFlowInstance, nodes, edges, setNodes, onFlowChange, readOnly]
  );

  // Update nodes when initialNodes change
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  // Update edges when initialEdges change
  useEffect(() => {
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  // Highlight selected node
  const nodesWithSelection = nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
  }));

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%" }}
      className="bg-sw-bg"
    >
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onNodesDelete={readOnly ? undefined : onNodesDelete}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        onDrop={readOnly ? undefined : onDrop}
        onDragOver={readOnly ? undefined : onDragOver}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        nodeTypes={nodeTypes}
        fitView
        className="bg-sw-bg"
      >
        <Background color="#181c22" gap={16} />
        <Controls className="bg-sw-bg-elevated border border-sw-border-subtle" />
        <MiniMap
          className="bg-sw-bg-elevated border border-sw-border-subtle"
          nodeColor="#26f68c"
        />
      </ReactFlow>
    </div>
  );
}

