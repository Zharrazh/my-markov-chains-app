import type { Transition } from '@entities/transition';
import type { State } from '../../types';

export interface StateCardProps {
  state: State;
  associatedTranslations?: Transition[];
  onClick?: () => void;
}
