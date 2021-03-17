import React, { FunctionComponent, RefObject } from 'react';
import classNames from 'classnames';
import styles from './Panel.module.css';

interface PanelProps {
  className?: string;
  windowName: string,
  backgroundColor?: string,
  style?: any,
  children?: any,
  refer?: RefObject<HTMLDivElement>
}


export const Panel: FunctionComponent<PanelProps> = (
  {className, windowName, backgroundColor = 'white', children, style, refer}
  ): JSX.Element => (
  <div ref={refer}>
    <div className={classNames(styles.container, className)} style={{ backgroundColor, ...style }}>
      {children}
    </div>
  </div>
)