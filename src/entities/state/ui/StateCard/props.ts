import type { StateEntity } from '../../types';

export interface StateCardProps {
  state: StateEntity;
  onClick?: () => void;
}
