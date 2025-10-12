import type { FC } from 'react';
import type { StateCardProps } from './props';
import styles from './styles.module.scss';
import { TransitionRow } from '@entities/transition';

const MAX_TRANSITIONS_TO_SHOW = 5; // Максимальное количество переходов для показа

export const StateCard: FC<StateCardProps> = ({ state, onClick }) => {
  const transitionsCount = state.transitions?.length ?? 0;
  const visibleTransitions = state.transitions?.slice(0, MAX_TRANSITIONS_TO_SHOW) ?? [];

  return (
    <div
      className={styles.stateCard}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`State ${state.label}`}
    >
      <h3 className={styles.label}>{state.label}</h3>
      {state.description && <p className={styles.description}>{state.description}</p>}
      {transitionsCount > 0 ? (
        <>
          <p className={styles.transitions}>Transitions: {transitionsCount}</p>
          <div className={styles.transitionsList}>
            {visibleTransitions.map((transition) => (
              <TransitionRow key={transition.id} transition={transition} />
            ))}
          </div>
          {transitionsCount > MAX_TRANSITIONS_TO_SHOW && (
            <p className={styles.moreTransitions}>
              +{transitionsCount - MAX_TRANSITIONS_TO_SHOW} more
            </p>
          )}
        </>
      ) : (
        <p className={styles.noTransitions}>No transitions</p>
      )}
    </div>
  );
};
