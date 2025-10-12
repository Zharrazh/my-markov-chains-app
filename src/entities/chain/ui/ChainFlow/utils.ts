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

// Функция определения handle на основе sourceNode и targetNode
function getHandlesForEdge(sourceNode: Node, targetNode: Node) {
  const dx = (targetNode.position?.x ?? 0) - (sourceNode.position?.x ?? 0);
  const dy = (targetNode.position?.y ?? 0) - (sourceNode.position?.y ?? 0);

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      return { sourceHandle: 'right-source', targetHandle: 'left-target' };
    } else {
      return { sourceHandle: 'left-source', targetHandle: 'right-target' };
    }
  } else {
    if (dy > 0) {
      return { sourceHandle: 'bottom-source', targetHandle: 'top-target' };
    } else {
      return { sourceHandle: 'top-source', targetHandle: 'bottom-target' };
    }
  }
}

// Обёртка: принимает edges и nodeMap, возвращает обновлённый массив edges с хендлерами
export function assignHandlesToEdges(edges: Edge[], nodeMap: Map<string, Node>) {
  return edges.map((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) {
      return edge; // если не нашли узлы, возвращаем без изменений
    }

    const handles = getHandlesForEdge(sourceNode, targetNode);
    return {
      ...edge,
      ...handles,
    };
  });
}

export async function getELKLayoutedElements(nodes: Node[], edges: Edge[]) {
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: 80,
    height: 80,
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
      'elk.algorithm': 'force', // включаем силовой алгоритм
      'elk.force.repulsion': '5000', // сила отталкивания между узлами
      'elk.force.attraction': '0.8', // сила притяжения между связанными узлами
      'elk.force.timeout': '500', // максимальное время вычислений в миллисекундах
      'elk.edgeRouting': 'SPLINES', // тип маршрутизации рёбер (опционально)
      'elk.spacing.nodeNode': '100', // расстояние между узлами
      'elk.force.temperature': '0.1', // параметр "температуры" для динамики алго
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
