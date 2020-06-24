import React, { FunctionComponent, useState } from 'react';
import styles from './Draggable.module.css';

interface DraggableProps {
  color?: string,
  activeColor?: string,
  borderColor?: string,
  children?: any
}

interface VariableInfo {
  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset:number;
  yOffset:number;
}

export const Draggable: FunctionComponent<DraggableProps> = (
  { color = 'rgba(157, 83, 226, 0.329)', 
    activeColor = 'rgba(157, 83, 226, 0.429)',
    borderColor = 'blueviolet', children }
  ) => {
  const [active, setActive] = useState(false);
  let variableInfo: VariableInfo = {
    currentX: 0, 
    currentY: 0,
    initialX: 0,
    initialY: 0,
    xOffset: 0,
    yOffset: 0,
  }  

  const mouseIn = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    if (target.tagName !== 'INPUT') {
      setActive(true)
    }
  }

  const mouseOut = (): void => {
    setActive(false)
  }

  return (
    <div 
    className={[styles.variable, active ? styles.active : '', 'draggable'].join(' ')}
    onMouseEnter={mouseIn}
    onMouseLeave={mouseOut}
    style={{
      backgroundColor: active ? color : activeColor,
      borderColor,
      boxShadow: `0px 0px 0px 1px ${borderColor}`
    }}
    data-varinfo={JSON.stringify(variableInfo)}>
      {children}
    </div>
  )
}