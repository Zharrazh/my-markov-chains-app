import { ChainDTO, ChainEntity, ChainFlow } from '@entities/chain';
import { StateDTO, StateEntity } from '@entities/state';
import { type TransitionDTO } from '@entities/transition';
import { ChainStateManager, type ChainState } from '@entities/chainState'; // импорт менеджера состояния
import { AppLayout } from '@shared/AppLayout';
import { useState } from 'react';

const footballSimplifiedChain: ChainDTO = {
  id: 'football-simplified',
  initialStateId: 'possession_ours',
  terminalStateId: 'goal_ours', // терминал по одному из голей
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
    { id: 'goal_ours', label: 'Гол (мы)', description: 'Гол, забитый нашей командой' },
    { id: 'goal_opponent', label: 'Гол (соперник)', description: 'Гол, забитый соперником' },
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
  const state = chainStateManager.getState();

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
      // Сброс информации о выбранном элементе при переходе
      setSelectedState(null);
      setSelectedTransition(null);
    } catch (error) {
      alert(String(error));
    }
  };

  const renderChainState = (state: ChainState) => {
    switch (state.type) {
      case 'AtState':
        return (
          <>
            <b>Текущее состояние цепи:</b> AtState
            <br />
            <b>ID:</b> {state.state.id}
            <br />
            <b>Label:</b> {state.state.label}
            <br />
            <b>Описание:</b> {state.state.description}
          </>
        );
      case 'SelectingTransition':
        return (
          <>
            <b>Текущее состояние цепи:</b> SelectingTransition
            <br />
            <b>Выпавшее число:</b> {state.rolledNumber.toFixed(3)}
            <br />
            <b>Выбран переход:</b> {state.chosenTransition.id} ({state.chosenTransition.fromStateId}{' '}
            → {state.chosenTransition.toStateId})
          </>
        );
      case 'Terminated':
        return (
          <>
            <b>Текущее состояние цепи:</b> Terminated
            <br />
            <b>Конечное состояние:</b> {state.terminalState.label} ({state.terminalState.id})<br />
          </>
        );
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
            <button onClick={handleNextClick} style={{ marginTop: '10px' }}>
              Next
            </button>
            <hr />
            {renderChainState(state)}
          </div>

          {/* Нижняя часть: информация о выбранном элементе */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
            {selectedState && (
              <div>
                <h3>Выбранное состояние</h3>
                <p>ID: {selectedState.id}</p>
                <p>Label: {selectedState.label}</p>
                <p>Описание: {selectedState.description}</p>
              </div>
            )}
            {selectedTransition && (
              <div>
                <h3>Выбранный переход</h3>
                <p>ID: {selectedTransition.id}</p>
                <p>From: {selectedTransition.fromStateId}</p>
                <p>To: {selectedTransition.toStateId}</p>
                <p>Вероятность: {selectedTransition.probability}</p>
              </div>
            )}
            {!selectedState && !selectedTransition && (
              <p>Выберите элемент на графе для просмотра информации</p>
            )}
          </div>
        </div>
      }
    />
  );
}
