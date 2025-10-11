import type { State } from '@entities/state';
import type { Transition } from '@entities/transition';

export interface Chain {
  id: string;
  label?: string;
  description?: string;
  initialStateId: string;
  terminalStateId?: string;
  states: State[];
  transitions: Transition[];
}
