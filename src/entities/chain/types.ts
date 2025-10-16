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
  public readonly chainDTO: ChainDTO;
  public readonly states: StateDTO[];
  public readonly statesMap: Map<string, StateDTO>;
  public readonly transitions: TransitionDTO[];
  public readonly transitionsMap: Map<string, TransitionDTO>;
  public readonly transitionsFromIdMap: { [fromStateId: string]: TransitionDTO[] };

  constructor(chain: ChainDTO) {
    this.chainDTO = chain;
    this.states = chain.states;
    this.statesMap = new Map(chain.states.map((s) => [s.id, s]));
    this.transitions = chain.transitions;
    this.transitionsMap = new Map(chain.transitions.map((t) => [t.id, t]));
    this.transitionsFromIdMap = chain.transitions.reduce(
      (prev, trans) => ({
        ...prev,
        [trans.fromStateId]: [...(prev[trans.fromStateId] ?? []), trans],
      }),
      {} as { [fromStateId: string]: TransitionDTO[] },
    );
  }

  getState(id: string): StateEntity | null {
    const dto = this.statesMap.get(id);
    if (dto) {
      const transitionsFromThis = this.transitionsFromIdMap[id] ?? [];

      return new StateEntity(dto, transitionsFromThis);
    }
    return null;
  }

  getTransition(id: string): TransitionEntity | null {
    const dto = this.transitionsMap.get(id);
    if (dto) {
      return new TransitionEntity(dto);
    }

    return null;
  }

  addState(stateDto: StateDTO): ChainEntity {
    const newStates = [...this.chainDTO.states, stateDto];
    const newChain = { ...this.chainDTO, states: newStates };
    return new ChainEntity(newChain);
  }

  addTransition(transitionDto: TransitionDTO): ChainEntity {
    const newTransitions = [...this.chainDTO.transitions, transitionDto];
    const newChain = { ...this.chainDTO, transitions: newTransitions };
    return new ChainEntity(newChain);
  }

  getChain(): ChainDTO {
    return this.chainDTO;
  }

  getTransitionsFromState(stateId: string): TransitionEntity[] {
    return (this.transitionsFromIdMap[stateId] ?? []).map(
      (transitionDto) => new TransitionEntity(transitionDto),
    );
  }
}
