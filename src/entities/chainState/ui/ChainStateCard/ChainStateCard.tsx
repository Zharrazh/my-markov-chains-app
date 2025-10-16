import type { FC } from 'react';
import type { ChainStateCardProps } from './props';
import styles from './styles.module.scss';

export const ChainStateCard: FC<ChainStateCardProps> = ({ state }) => {
  switch (state.type) {
    case 'AtState':
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>Текущее состояние (AtState)</h2>
          <p>
            <b>ID:</b> {state.state.id}
          </p>
          <p>
            <b>Label:</b> {state.state.label}
          </p>
          <p>
            <b>Описание:</b> {state.state.description}
          </p>
        </div>
      );

    case 'SelectingTransition':
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>Выбор перехода (SelectingTransition)</h2>
          <p>
            <b>Выпавшее число:</b> {state.rolledNumber.toFixed(3)}
          </p>
          <p>
            <b>Выбран переход:</b>
          </p>
          <ul className={styles.list}>
            <li>
              <b>ID:</b> {state.chosenTransition.id}
            </li>
            <li>
              <b>От состояния:</b> {state.chosenTransition.fromStateId}
            </li>
            <li>
              <b>К состоянию:</b> {state.chosenTransition.toStateId}
            </li>
            <li>
              <b>Вероятность:</b> {state.chosenTransition.probability}
            </li>
          </ul>
          <p>
            <b>Доступные переходы:</b>
          </p>
          <ul className={styles.list}>
            {state.availableTransitions.map((t) => (
              <li key={t.id}>
                {t.id}: {t.fromStateId} → {t.toStateId} (p = {t.probability})
              </li>
            ))}
          </ul>
        </div>
      );

    case 'Terminated':
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>Цепь завершена (Terminated)</h2>
          <p>
            <b>Конечное состояние:</b>
          </p>
          <p>
            <b>ID:</b> {state.terminalState.id}
          </p>
          <p>
            <b>Label:</b> {state.terminalState.label}
          </p>
          <p>
            <b>Описание:</b> {state.terminalState.description}
          </p>
        </div>
      );

    default:
      return <div className={styles.card}>Неизвестное состояние</div>;
  }
};
