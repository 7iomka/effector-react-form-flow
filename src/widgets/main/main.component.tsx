import clsx from 'clsx';
import type { ReactNode } from 'react';
import { memo } from 'react';
import styles from './main.module.scss';

interface MainProps {
  children: ReactNode;
  className?: string;
}

const Main = memo((props: MainProps) => {
  const { className, children, ...otherProps } = props;
  return (
    <main role="main" className={clsx(styles.Main, className)} {...otherProps}>
      {children}
    </main>
  );
});

Main.displayName = 'Main';

export { Main };
