import React, { FunctionComponent } from 'react';
import { Panel } from './Panel';
import styles from './Console.module.css'

const backgroundColor = '#180027';

interface ConsoleProps {
  output: string[]
}

export const Console:FunctionComponent<ConsoleProps> = ({ output }): JSX.Element => (
  <Panel
    windowName="Console"
    backgroundColor={backgroundColor}
    style={{justifyContent: 'flex-start'}}>
    {output.map((text, i) => (
      <p key={i.toString()} className={styles.output}>{text}</p>
    ))}
  </Panel>
)