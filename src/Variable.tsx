import React, { FunctionComponent, useState } from 'react';
import styles from './Variable.module.css';
import { Draggable } from './Draggable'

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
  name?: string,
  onChange(text: string): any,
  confirmFn?(): void,
}

const InputComponent: FunctionComponent<InputComponentProps> = ({value, name = '', onChange, confirmFn = function(){}}): JSX.Element => {
  const [varConfirmed, setVarConfirmed] = useState(false);

  const changeInputField = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    onChange(target.value);
  }

  const pressEnter = (event: React.KeyboardEvent): void => {
    if (event.keyCode === 13) {
      if ((name === 'varName' && value.length)) {
        confirmFn();
        setVarConfirmed(true)
      } else if (name !== 'varName') {
        confirmFn();
        setVarConfirmed(true)
      }
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
      type="text"
      name={name}
      value={value}
      onChange={changeInputField}
      onKeyDown={pressEnter}
      style={{width: 8 * (value.length || 1)}}/> ) :
      <div 
        className={styles.varConfirmed}
        onClick={clickConfirmed}>
        {value || 'undef'}
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

  const confirmVarDeclaration = (): void => {
    if (varName.length && valName.length) {
      console.log(`${varName} = ${valName}`);
    } else if (varName.length && !valName.length) {
      console.log(`${varName}`)
    }
  }
  

  return (
    <Draggable>
      <InputComponent 
        onChange={setVarName}
        value={varName}
        confirmFn={confirmVarDeclaration}
        name="varName"/>
       {' = '} 
      <InputComponent
        onChange={setValName}
        value={valName}
        confirmFn={confirmVarDeclaration}/>
    </Draggable>
  )
}
