import { Button, Text } from '@chakra-ui/react';
import { ChainDTO, ChainEntity, ChainFlow } from '@entities/chain';
import { ChainStateCard, ChainStateManager } from '@entities/chainState'; // импорт менеджера состояния
import { StateCard, StateDTO, StateEntity } from '@entities/state';
import { TransitionRow, type TransitionDTO } from '@entities/transition';
import { AppLayout } from '@shared/AppLayout';
import { useState } from 'react';

const footballSimplifiedChain: ChainDTO = {
  id: 'football-simplified',
  initialStateId: 'possession_ours',
  states: [
    {
      id: 'possession_ours',
      label: 'Владение мячом (мы)',
      description: 'Наша команда владеет мячом',
    },
    {
      id: 'possession_opponent',
      label: 'Владение мячом (соперник)',
      description: 'Противник владеет мячом',
    },
    { id: 'shot_ours', label: 'Удар по воротам (мы)', description: 'Мы бьем по воротам' },
    {
      id: 'shot_opponent',
      label: 'Удар по воротам (соперник)',
      description: 'Соперник бьет по воротам',
    },
    {
      id: 'goal_ours',
      label: 'Гол (мы)',
      description: 'Гол, забитый нашей командой',
      isTerminal: true,
    },
    {
      id: 'goal_opponent',
      label: 'Гол (соперник)',
      description: 'Гол, забитый соперником',
      isTerminal: true,
    },
  ],
  transitions: [
    // Из владения мячом нашей команды
    { id: 't1', fromStateId: 'possession_ours', toStateId: 'shot_ours', probability: 0.3 },
    {
      id: 't2',
      fromStateId: 'possession_ours',
      toStateId: 'possession_opponent',
      probability: 0.7,
    },
    // Из владения мячом соперника
    { id: 't3', fromStateId: 'possession_opponent', toStateId: 'shot_opponent', probability: 0.25 },
    {
      id: 't4',
      fromStateId: 'possession_opponent',
      toStateId: 'possession_ours',
      probability: 0.75,
    },
    // Из удара нашей команды
    { id: 't5', fromStateId: 'shot_ours', toStateId: 'goal_ours', probability: 0.4 },
    { id: 't6', fromStateId: 'shot_ours', toStateId: 'possession_opponent', probability: 0.6 },
    // Из удара соперника
    { id: 't7', fromStateId: 'shot_opponent', toStateId: 'goal_opponent', probability: 0.35 },
    { id: 't8', fromStateId: 'shot_opponent', toStateId: 'possession_ours', probability: 0.65 },
  ],
};

const exampleChain: ChainDTO = footballSimplifiedChain;

const chain = new ChainEntity(exampleChain);

export default function App() {
  const [chainStateManager, setChainStateManager] = useState(new ChainStateManager(chain));
  const [selectedState, setSelectedState] = useState<StateEntity | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<TransitionDTO | null>(null);

  const onSelectNode = (node: StateDTO) => {
    const stateEntity = chain.getState(node.id);
    if (stateEntity) setSelectedState(stateEntity);
    setSelectedTransition(null);
  };

  const onSelectEdge = (edge: TransitionDTO) => {
    setSelectedTransition(edge);
    setSelectedState(null);
  };

  const handleNextClick = () => {
    try {
      const nextManager = chainStateManager.next();
      setChainStateManager(nextManager);
    } catch (error) {
      alert(String(error));
    }
  };

  return (
    <AppLayout
      workspace={
        <ChainFlow chain={chain} onNodeSelect={onSelectNode} onEdgeSelect={onSelectEdge} />
      }
      sidebar={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Верхняя часть: состояние цепи и кнопка */}
          <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <Button onClick={handleNextClick} mb={2}>
              Next
            </Button>
            <ChainStateCard state={chainStateManager.getState()} />
          </div>

          {/* Нижняя часть: информация о выбранном элементе */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
            {selectedState && (
              <StateCard
                state={selectedState}
                transitions={chainStateManager.chain.getTransitionsFromState(selectedState.id)}
              />
            )}
            {selectedTransition && <TransitionRow transition={selectedTransition} />}
            {!selectedState && !selectedTransition && (
              <Text>Выберите элемент на графе для просмотра информации</Text>
            )}
          </div>
        </div>
      }
    />
  );
}
