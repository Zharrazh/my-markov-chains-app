import { Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

import type { StateDTO } from '@entities/state';
import type { TransitionDTO } from '@entities/transition';
import ELK from 'elkjs/lib/elk.bundled.js';

export function transformStatesToNodes(states: StateDTO[]): Node[] {
  return states.map((state) => ({
    id: state.id,
    data: { label: state.label },
    position: { x: 0, y: 0 },
    type: 'circular',
  }));
}

export function transformTransitionsToEdges(transitions: TransitionDTO[]): Edge[] {
  return transitions.map((transition) => ({
    id: transition.id,
    source: transition.fromStateId,
    target: transition.toStateId,
    label: transition.label ?? transition.probability.toFixed(2),
    type: 'default', // меняем тип линии для плавного перехода
    animated: true,
    labelStyle: { fontSize: 12, fill: '#555' },
  }));
}

export function getHandlesForEdge(edge: Edge, nodes: Node[]) {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) return {};

  const dx = (targetNode.position?.x ?? 0) - (sourceNode.position?.x ?? 0);
  const dy = (targetNode.position?.y ?? 0) - (sourceNode.position?.y ?? 0);

  if (Math.abs(dx) > Math.abs(dy)) {
    // Горизонталь больше вертикали — значит выбираем левый или правый хендлер
    if (dx > 0) {
      // Цель справа
      return { sourceHandle: 'right-source', targetHandle: 'left-target' };
    } else {
      // Цель слева
      return { sourceHandle: 'left-source', targetHandle: 'right-target' };
    }
  } else {
    // Вертикаль больше или равна — выбираем верхний или нижний хендлер
    if (dy > 0) {
      // Цель снизу
      return { sourceHandle: 'bottom-source', targetHandle: 'top-target' };
    } else {
      // Цель сверху
      return { sourceHandle: 'top-source', targetHandle: 'bottom-target' };
    }
  }
}

export async function getELKLayoutedElements(nodes: Node[], edges: Edge[]) {
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: 80,
    height: 80,
    // ports: [
    //   { id: 'top-source', side: 'NORTH' },
    //   { id: 'top-target', side: 'NORTH' },
    //   { id: 'bottom-source', side: 'SOUTH' },
    //   { id: 'bottom-target', side: 'SOUTH' },
    //   { id: 'left-source', side: 'WEST' },
    //   { id: 'left-target', side: 'WEST' },
    //   { id: 'right-source', side: 'EAST' },
    //   { id: 'right-target', side: 'EAST' },
    // ],
  }));
  const elkEdges = edges.map((edge) => {
    return {
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    };
  });

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'force',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNodeBetweenLayers': '200',
      'elk.spacing.nodeNode': '100',
      'elk.layered.cycleBreaking.strategy': 'GREEDY',
      'elk.layered.merger.strategy': 'PLACE',
      'org.eclipse.elk.spacing.edgeEdge': '20',
      'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
    },
    children: elkNodes,
    edges: elkEdges,
  };

  const layout = await new ELK().layout(graph);

  if (!layout.children) {
    // Если layout.children нет, просто возвращаем исходные данные без позиций
    return { nodes, edges };
  }

  const layoutedNodes = nodes.map((node) => {
    const ln = layout.children!.find((n) => n.id === node.id);
    if (ln) {
      return {
        ...node,
        position: {
          x: ln.x ?? 0,
          y: ln.y ?? 0,
        },
      };
    }
    return node;
  });

  return {
    nodes: layoutedNodes,
    edges: edges,
  };
}
