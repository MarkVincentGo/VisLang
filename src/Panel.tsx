import React, { FunctionComponent } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  windowName: string,
  backgroundColor?: string,
  style?: any,
  children?: any
}


export const Panel: FunctionComponent<PanelProps> = (
  {windowName, backgroundColor = 'white', children, style}
  ): JSX.Element => (
  <div>
    <div>{windowName}</div>
    <div className={styles.container} style={{ backgroundColor, ...style }}>
      {children}
    </div>
  </div>
)