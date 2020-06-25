import React, { FunctionComponent, useState } from 'react';
import styles from './Variable.module.css';
import { Draggable } from './Draggable';
import { IVariableInfo } from './Editor';

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
  confirmFn?(): void
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
    event.stopPropagation();
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

/* 
  variable should be able to have a drop down menu on right click to offer 
  options on what you can do with the variable
  Ex: - create reference
      - delete reference
      - delete variable
*/

interface VariableProps {
  data: IVariableInfo,
  edit(varData: IVariableInfo, name: string, value?: string): void,
  handleVariableDropDown(option?: string, varInfo?: IVariableInfo): void
}

export const Variable: FunctionComponent<VariableProps> = ({ data, edit, handleVariableDropDown }): JSX.Element => {
  const [varName, setVarName] = useState('');
  const [valName, setValName] = useState('');

  const confirmVarDeclaration = (): void => {
    if (varName.length && valName.length) {
      edit(data, varName, valName)
    } else if (varName.length && !valName.length) {
      edit(data, varName)
    }
  }

  const handleDropDown = (option: string): void => {
    handleVariableDropDown(option, data)
  }
  

  return ( !data.deleted ?
    <Draggable
      onContextMenu={e => e.preventDefault()}
      contextMenu={['Add Reference', 'Delete Variable']}
      contextMenuClick={handleDropDown}>
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
    :
    <></>
  )
}
