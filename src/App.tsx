import { ChainDTO, ChainEntity, ChainFlow } from '@entities/chain';
import { StateCard, StateEntity, type StateDTO } from '@entities/state';
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

const chain = new ChainEntity(exampleChain);

export default function App() {
  const [selectedState, setSelectedState] = useState<StateEntity | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<TransitionDTO | null>(null);

  const onSelectNode = (node: StateDTO) => {
    const state = chain.getState(node.id);
    if (state) {
      setSelectedState(state);
    }
    setSelectedTransition(null);
  };

  const onSelectEdge = (edge: TransitionDTO) => {
    setSelectedTransition(edge);
    setSelectedState(null);
  };

  return (
    <AppLayout
      workspace={
        <ChainFlow chain={chain} onNodeSelect={onSelectNode} onEdgeSelect={onSelectEdge} />
      }
      sidebar={
        <div>
          {selectedState && <StateCard state={selectedState} />}
          {selectedTransition && <TransitionRow transition={selectedTransition} />}
          {!selectedState && !selectedTransition && (
            <p>Выберите элемент на графе для просмотра информации</p>
          )}
        </div>
      }
    />
  );
}
