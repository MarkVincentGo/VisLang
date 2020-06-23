import React, { FunctionComponent, useState } from 'react';
import styles from './Variable.module.css';

/*
This module defines the component rendered when a variable is declared
Current Features: 
  - Styling
  - Input boxes
  - pressing enter to confirm bind, converting input to text
In Progress:
  - binding to javascript
  - binding inputs to values in state
*/
interface InputComponentProps {
  value: string,
  onChange(text: string): any,
}

const InputComponent: FunctionComponent<InputComponentProps> = ({value, onChange}): JSX.Element => {
  const [varConfirmed, setVarConfirmed] = useState(false);

  const changeInputField = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    onChange(target.value);
  }

  const pressEnter = (event: React.KeyboardEvent): void => {
    if (event.keyCode === 13) {
      console.log('Enter')
      setVarConfirmed(true)
    }
  }

  const clickConfirmed = (event: React.SyntheticEvent): void => {
    event.stopPropagation()
    setVarConfirmed(false);
  }

  return (
    !varConfirmed ? (
      <input 
      className={styles.varInput}
      type="text" value={value}
      onChange={changeInputField}
      onKeyDown={pressEnter}
      style={{width: 8 * (value.length || 1)}}/> ) :
      <div 
        className={styles.varConfirmed}
        onClick={clickConfirmed}>
        {value}
      </div>
  )
}

interface VariableInfo {
  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset:number;
  yOffset:number;
}

export const Variable: FunctionComponent = (): JSX.Element => {
  const [varName, setVarName] = useState('');
  const [valName, setValName] = useState('');
  const [active, setActive] = useState(false);

  const mouseIn = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    if (target.tagName !== 'INPUT') {
      setActive(true)
    }
  }

  let variableInfo: VariableInfo = {
    currentX: 0, 
    currentY: 0,
    initialX: 0,
    initialY: 0,
    xOffset: 0,
    yOffset: 0,
  }

  const mouseOut = (): void => {
    setActive(false)
  }
  

  return (
    <div 
      className={[styles.variable, active ? styles.active : ''].join(' ')}
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
      data-varinfo={JSON.stringify(variableInfo)}>
      <InputComponent 
        onChange={setVarName}
        value={varName}/>
       {' = '} 
      <InputComponent
        onChange={setValName}
        value={valName}/>
    </div>
  )
}
