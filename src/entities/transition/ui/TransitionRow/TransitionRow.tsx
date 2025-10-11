import type { FC } from 'react';
import type { TransitionRowProps } from './props';
import styles from './styles.module.scss';

export const TransitionRow: FC<TransitionRowProps> = ({ transition }) => {
  return (
    <div className={styles.transition}>
      <div className={styles.label}>{transition.label ?? 'Transition'}</div>
      <div className={styles.probability}>Probability: {transition.probability}</div>
      <div className={styles.to}>
        To: <strong>{transition.toStateId}</strong>
      </div>
    </div>
  );
};
