import { Handle, NodeProps, Position } from 'reactflow';
import styles from './styles.module.scss';
import classNames from 'classnames'; // удобная утилита для условных классов

/**
 * Круглый узел с дублированными точками подключения.
 */
export function CircularNode({ data, selected, id }: NodeProps) {
  // Смещения для сдвоенных handles, задаются в стилях
  return (
    <div
      className={classNames(styles.circularNode, {
        [styles.selected]: selected,
      })}
      data-id={id}
    >
      <div className={styles.label}>{data.label}</div>

      {/* Верхний вход (target), сдвоенный */}
      <Handle
        type="target"
        position={Position.Top}
        className={`${styles.handle}`}
        id="top-target"
      />
      <Handle
        type="source"
        position={Position.Top}
        className={`${styles.handle}`}
        id="top-source"
      />

      {/* Нижний выход (source), сдвоенный */}
      <Handle
        type="target"
        position={Position.Bottom}
        className={`${styles.handle}`}
        id="bottom-target"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${styles.handle}`}
        id="bottom-source"
      />

      {/* Левый вход (target), сдвоенный */}
      <Handle
        type="target"
        position={Position.Left}
        className={`${styles.handle}`}
        id="left-target"
      />
      <Handle
        type="source"
        position={Position.Left}
        className={`${styles.handle}`}
        id="left-source"
      />

      {/* Правый выход (source), сдвоенный */}
      <Handle
        type="target"
        position={Position.Right}
        className={`${styles.handle}`}
        id="right-target"
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`${styles.handle}`}
        id="right-source"
      />
    </div>
  );
}
