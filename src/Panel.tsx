import React, { FunctionComponent, RefObject } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  windowName: string,
  backgroundColor?: string,
  style?: any,
  children?: any,
  refer?: RefObject<HTMLDivElement>
}


export const Panel: FunctionComponent<PanelProps> = (
  {windowName, backgroundColor = 'white', children, style, refer}
  ): JSX.Element => (
  <div ref={refer}>
    <div className={styles.container} style={{ backgroundColor, ...style }}>
      {children}
    </div>
  </div>
)