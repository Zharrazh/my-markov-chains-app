import type { TransitionDTO } from '@entities/transition';
import type { StateDTO } from '../../types';

export interface StateCardProps {
  state: StateDTO;
  associatedTranslations?: TransitionDTO[];
  onClick?: () => void;
}
