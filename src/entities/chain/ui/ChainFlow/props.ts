import type { StateDTO } from '@entities/state';
import type { TransitionDTO } from '@entities/transition';
import { ChainEntity } from '../../types';

export interface ChainFlowProps {
  chain: ChainEntity;
  /**
   * Колбек вызывается при клике на узел.
   * Передаёт DTO состояния, связанного с этим узлом.
   */
  onNodeSelect?: (node: StateDTO) => void;
  /**
   * Колбек вызывается при клике на ребро.
   * Передаёт DTO перехода, связанного с этим ребром.
   */
  onEdgeSelect?: (edge: TransitionDTO) => void;
}
