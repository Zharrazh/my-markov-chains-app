import { TransitionEntity } from '@entities/transition';
import type { StateEntity } from '../../types';

export interface StateCardProps {
  state: StateEntity;
  transitions?: TransitionEntity[] | null;
  onClick?: () => void;
}
