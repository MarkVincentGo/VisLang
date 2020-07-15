import React, { FunctionComponent, useState, useEffect } from 'react';
import { Panel } from './Panel';
import styles from './Console.module.css'

const backgroundColor = '#180027';

interface ConsoleProps {
  output: string[],
  getWidth(s: string, w: number): void,
  width: number
}

export const Console:FunctionComponent<ConsoleProps> = ({ output, getWidth, width }): JSX.Element => {
  const [refer, setRefer] = useState<number>(window.innerWidth > 1200 ? ((window.innerWidth * 2 / 3) - 50) : window.innerWidth - 50);

  useEffect(() => {
    let changeRef = (): void => {
     setRefer(window.innerWidth > 1200 ? ((window.innerWidth / 3) - 50) : window.innerWidth - 50);
    }
    window.addEventListener('resize', changeRef)
    return () => {
      window.removeEventListener('resize', changeRef)
    }
  }, [])
  return (
    <Panel
      windowName="Console"
      backgroundColor={backgroundColor}
      style={{justifyContent: 'flex-start', width: refer - width}}>
      {output.map((text, i) => (
        <p key={i.toString()} className={styles.output}>{text}</p>
      ))}
    </Panel>
  )
}