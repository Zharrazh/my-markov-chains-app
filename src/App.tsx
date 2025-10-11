import { ChainDTO, ChainFlow } from '@entities/chain';
import { StateCard, type StateDTO } from '@entities/state';
import { TransitionRow, type TransitionDTO } from '@entities/transition';
import { AppLayout } from '@shared/AppLayout';
import { useState } from 'react';

const exampleChain: ChainDTO = {
  id: 'complex-chain',
  initialStateId: 'state1',
  states: [
    { id: 'state1', label: 'Start', description: 'Начало' },
    { id: 'state2', label: 'Choice', description: 'Ветвление' },
    { id: 'state3', label: 'Middle', description: 'Промежуточное звено' },
    { id: 'state4', label: 'End', description: 'Конец' },
  ],
  transitions: [
    {
      id: 't1',
      fromStateId: 'state1',
      toStateId: 'state2',
      probability: 0.9,
    },
    {
      id: 't2',
      fromStateId: 'state2',
      toStateId: 'state3',
      probability: 0.6,
    },
    {
      id: 't3',
      fromStateId: 'state3',
      toStateId: 'state4',
      probability: 0.7,
    },
    {
      id: 't4',
      fromStateId: 'state2',
      toStateId: 'state4',
      probability: 0.3,
    },
    {
      id: 't5',
      fromStateId: 'state3',
      toStateId: 'state2',
      probability: 0.2,
    },
    {
      id: 't6',
      fromStateId: 'state4',
      toStateId: 'state1',
      probability: 0.4,
    },
    {
      id: 't7',
      fromStateId: 'state3',
      toStateId: 'state1',
      probability: 0.15,
    },
  ],
};

export default function App() {
  const [selectedNode, setSelectedNode] = useState<StateDTO | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<TransitionDTO | null>(null);

  const onSelectNode = (node: StateDTO) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const onSelectEdge = (edge: TransitionDTO) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  return (
    <AppLayout
      workspace={
        <ChainFlow chain={exampleChain} onNodeSelect={onSelectNode} onEdgeSelect={onSelectEdge} />
      }
      sidebar={
        <div>
          {selectedNode && <StateCard state={selectedNode} />}
          {selectedEdge && <TransitionRow transition={selectedEdge} />}
          {!selectedNode && !selectedEdge && (
            <p>Выберите элемент на графе для просмотра информации</p>
          )}
        </div>
      }
    />
  );
}
