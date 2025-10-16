import { ChainEntity } from '@entities/chain';
import { StateEntity } from '@entities/state';
import { TransitionEntity } from '@entities/transition';

export type ChainStateType = 'AtState' | 'SelectingTransition' | 'Terminated';

export interface BaseState {
  type: ChainStateType;
}

export interface AtStateState extends BaseState {
  type: 'AtState';
  state: StateEntity;
}

export interface SelectingTransitionState extends BaseState {
  type: 'SelectingTransition';
  availableTransitions: TransitionEntity[];
  rolledNumber: number;
  chosenTransition: TransitionEntity;
}

export interface TerminatedState extends BaseState {
  type: 'Terminated';
  terminalState: StateEntity;
}

export type ChainState = AtStateState | SelectingTransitionState | TerminatedState;

export class ChainStateManager {
  private chain: ChainEntity;
  private currentState: ChainState;

  constructor(chain: ChainEntity, initialState?: ChainState) {
    this.chain = chain;
    if (initialState) {
      this.currentState = initialState;
    } else {
      const initialStateEntity = this.chain.getState(this.chain.getChain().initialStateId);
      if (!initialStateEntity) throw new Error('Initial state not found in chain');
      this.currentState = { type: 'AtState', state: initialStateEntity };
    }
  }

  getState(): ChainState {
    return this.currentState;
  }

  next(): ChainStateManager {
    switch (this.currentState.type) {
      case 'AtState': {
        const transitions = this.chain.getTransitionsFromState(this.currentState.state.id);
        if (transitions.length === 0) {
          if (this.currentState.state.id === this.chain.getChain().terminalStateId) {
            const terminatedState: ChainState = {
              type: 'Terminated',
              terminalState: this.currentState.state,
            };
            return new ChainStateManager(this.chain, terminatedState);
          } else {
            throw new Error('Нет переходов и состояние не терминальное');
          }
        }
        const rolledNumber = Math.random();
        let cumulative = 0;
        let chosenTransition: TransitionEntity | null = null;
        for (const t of transitions) {
          cumulative += t.probability;
          if (rolledNumber <= cumulative) {
            chosenTransition = t;
            break;
          }
        }
        if (!chosenTransition) {
          chosenTransition = transitions[transitions.length - 1];
        }
        const selectingTransitionState: ChainState = {
          type: 'SelectingTransition',
          availableTransitions: transitions,
          rolledNumber,
          chosenTransition,
        };
        return new ChainStateManager(this.chain, selectingTransitionState);
      }

      case 'SelectingTransition': {
        const nextState = this.chain.getState(this.currentState.chosenTransition.toStateId);
        if (!nextState) {
          throw new Error('Следующее состояние не найдено');
        }
        if (nextState.id === this.chain.getChain().terminalStateId) {
          const terminatedState: ChainState = {
            type: 'Terminated',
            terminalState: nextState,
          };
          return new ChainStateManager(this.chain, terminatedState);
        } else {
          const atState: ChainState = {
            type: 'AtState',
            state: nextState,
          };
          return new ChainStateManager(this.chain, atState);
        }
      }

      case 'Terminated': {
        // Цепь завершена, возвращаем текущий экземпляр
        return this;
      }

      default:
        throw new Error('Неизвестное состояние');
    }
  }
}
