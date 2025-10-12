import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  ReactFlowProps,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import styles from './styles.module.scss';

import { CircularNode } from './CircularNode';
import type { ChainFlowProps } from './props';
import {
  assignHandlesToEdges,
  getELKLayoutedElements,
  transformStatesToNodes,
  transformTransitionsToEdges,
} from './utils';

const nodeTypes = {
  circular: CircularNode,
};

export function ChainFlow({ chain, onNodeSelect, onEdgeSelect }: ChainFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

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

  const autoHandledEdges = useMemo(() => {
    return assignHandlesToEdges(edges, nodeMap);
  }, [edges, nodeMap]);

  const onConnect: NonNullable<ReactFlowProps['onConnect']> = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges],
  );

  const handleNodeClick: NonNullable<ReactFlowProps['onNodeClick']> = useCallback(
    (_, node) => {
      if (onNodeSelect) {
        const state = chain.getState(node.id);
        if (state) {
          onNodeSelect(state);
        }
      }
    },
    [chain, onNodeSelect],
  );

  const handleEdgeClick: NonNullable<ReactFlowProps['onEdgeClick']> = useCallback(
    (_, edge) => {
      if (onEdgeSelect) {
        const transition = chain.getTransition(edge.id);
        if (transition) {
          onEdgeSelect(transition);
        }
      }
    },
    [chain, onEdgeSelect],
  );

  return (
    <div className={styles.chainFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={autoHandledEdges}
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
