import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Edge,
  ReactFlowProps,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './styles.module.scss';

import { CircularNode } from './CircularNode';
import type { ChainFlowProps } from './props';
import {
  getELKLayoutedElements,
  getHandlesForEdge,
  transformStatesToNodes,
  transformTransitionsToEdges,
} from './utils';

const nodeTypes = {
  circular: CircularNode,
};

export function ChainFlow({ chain, onNodeSelect, onEdgeSelect }: ChainFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    async function layout() {
      const initialNodes = transformStatesToNodes(chain.states);
      const initialEdges = transformTransitionsToEdges(chain.transitions);

      const layouted = await getELKLayoutedElements(initialNodes, initialEdges);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }
    layout();
  }, [chain]);

  useEffect(() => {
    async function layout() {
      const newEdges: Edge[] = edges.map((edge) => ({
        ...edge,
        ...getHandlesForEdge(edge, nodes),
      }));

      setEdges(newEdges);
    }
    layout();
  }, [nodes]);

  const onConnect: NonNullable<ReactFlowProps['onConnect']> = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges],
  );

  const handleNodeClick: NonNullable<ReactFlowProps['onNodeClick']> = useCallback(
    (_, node) => {
      if (onNodeSelect) {
        const state = chain.states.find((s) => s.id === node.id);
        if (state) {
          onNodeSelect(state);
        }
      }
    },
    [chain.states, onNodeSelect],
  );

  const handleEdgeClick: NonNullable<ReactFlowProps['onEdgeClick']> = useCallback(
    (_, edge) => {
      if (onEdgeSelect) {
        const transition = chain.transitions.find((t) => t.id === edge.id);
        if (transition) {
          onEdgeSelect(transition);
        }
      }
    },
    [chain.transitions, onEdgeSelect],
  );

  return (
    <div className={styles.chainFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        fitView
      >
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
