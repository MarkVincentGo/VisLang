import React, { FunctionComponent } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  windowName: string,
  backgroundColor?: string,
  children?: any
}


export const Panel: FunctionComponent<PanelProps> = (
  {windowName, backgroundColor = 'white', children}
  ): JSX.Element => (
  <div>
    <div>{windowName}</div>
    <div className={styles.container} style={{ backgroundColor }}>
      {children}
    </div>
  </div>
)