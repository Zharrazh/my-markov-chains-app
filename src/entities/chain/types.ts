import type { StateDTO } from '@entities/state';
import type { TransitionDTO } from '@entities/transition';
import { StateEntity } from '@entities/state';
import { TransitionEntity } from '@entities/transition';

export interface ChainDTO {
  id: string;
  label?: string;
  description?: string;
  initialStateId: string;
  terminalStateId?: string;
  states: StateDTO[];
  transitions: TransitionDTO[];
}

export class ChainEntity {
  private chain: ChainDTO;
  private statesMap: Map<string, StateEntity>;
  private transitionsMap: Map<string, TransitionEntity>;

  constructor(chain: ChainDTO) {
    this.chain = chain;
    this.statesMap = new Map(chain.states.map((s) => [s.id, new StateEntity(s)]));
    this.transitionsMap = new Map(chain.transitions.map((t) => [t.id, new TransitionEntity(t)]));
  }

  getState(id: string): StateEntity | undefined {
    return this.statesMap.get(id);
  }

  getTransition(id: string): TransitionEntity | undefined {
    return this.transitionsMap.get(id);
  }

  addState(stateDto: StateDTO): ChainEntity {
    const newStates = [...this.chain.states, stateDto];
    const newChain = { ...this.chain, states: newStates };
    return new ChainEntity(newChain);
  }

  addTransition(transitionDto: TransitionDTO): ChainEntity {
    const newTransitions = [...this.chain.transitions, transitionDto];
    const newChain = { ...this.chain, transitions: newTransitions };
    return new ChainEntity(newChain);
  }

  getChain(): ChainDTO {
    return this.chain;
  }
}
