import React, { FunctionComponent, useEffect, useState } from 'react';
import styles from './Variable.module.css';
import { Draggable } from './Draggable';
import { IVariableInfo } from './Interfaces';
import { DataNode } from './DataNode';

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

export const InputComponent: FunctionComponent<InputComponentProps> = ({value, name = '', onChange, confirmFn = function(){}}): JSX.Element => {
  const [varConfirmed, setVarConfirmed] = useState(value ? true : false);

  const changeInputField = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    onChange(target.value);
  }

  useEffect(() => {
    if (value.length) {
      setVarConfirmed(true)
    }
  }, [])

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
        style={{width: 10 * (value.length || 1)}}/> ) :
      <div 
        className={[styles.varConfirmed, 'inputConfirm'].join(' ')}
        onClick={clickConfirmed}>
        {value || 'undef'}
      </div>
  )
}

interface VariableProps {
  data: IVariableInfo,
  edit(varData: IVariableInfo, name: string, value?: string): void,
  handleVariableDropDown(option?: string, varInfo?: IVariableInfo): void,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void
}

export const Variable: FunctionComponent<VariableProps> = ({ data, edit, handleVariableDropDown, mousedDown, mousedUp }): JSX.Element => {
  const [varName, setVarName] = useState(data.name || '');
  const [valName, setValName] = useState(data.value || '');

  const colorConditions = (type: string) => {
    switch (type) {
      case 'Number':
        return '#B290FF';
      case 'String':
        return '#9090FF';
      case 'Boolean':
        return '#90ADFF';
      default:
        return '#B290FF';
    }
  }

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
      className={styles.variableContainer}
      color={colorConditions(data.valueType)}
      borderColor="goldenrod"
      onContextMenu={e => e.preventDefault()}
      contextMenu={['Add Reference', 'Delete Variable']}
      contextMenuClick={handleDropDown}
      left={data.left}
      top={data.top}
      componentId={data.id}>
      <DataNode
        position="top"
        nodes={data.args.length}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={data}/>
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
      <br />
      <p style={{margin: '0 auto', fontSize: 8}}>{data.valueType}</p>
        <DataNode
          position="bottom"
          nodes={1}
          mousedDown={mousedDown}
          mousedUp={mousedUp}
          dragInfo={data}/>
    </Draggable>
    :
    <></>
  )
}
