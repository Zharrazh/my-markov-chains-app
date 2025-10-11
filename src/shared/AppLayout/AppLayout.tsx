import styles from './styles.module.scss';
import { AppLayoutProps } from './props';

export function AppLayout({ workspace, sidebar }: AppLayoutProps) {
  return (
    <div className={styles.appLayout}>
      <div className={styles.workspace}>{workspace}</div>
      <div className={styles.sidebar}>{sidebar}</div>
    </div>
  );
}
