import React, { FunctionComponent, useState } from 'react';
import styles from './Editor.module.css';
import { Panel } from './Panel';
import { ButtonContainer, Button } from './Button';
import { Variable } from './Variable';
import { Operator } from './Operator';

export interface VariableInfo {
  readonly id: number,
  type: string,
  name: string,
  value?: any,
}

export interface OperationInfo {
  readonly id: number,
  type: string,
  arg1: string,
  arg2: string
}

interface CanvasProps {
  variableArray: VariableInfo[],
  operationsArray: OperationInfo[],
  editVariable(varData: VariableInfo, name: string, value?: string): void
  pressPlay(): void
}

const Canvas: FunctionComponent<CanvasProps> = (
  { variableArray = [],
    operationsArray = [],
    editVariable,
    pressPlay }
  ) => {
  let active = false;
  let selectedItem: any = null;
  let itemData: any = null

  const dragStart = (event: any ): void => {
    // gather all instances of variables and starts drag functionality
    let draggables = document.getElementsByClassName('draggable');
    let dragSet = new Set(draggables)
    //every variable should have their own x and y properties, now find a way to access them
    if (dragSet.has(event.target)) {
      active = true;
      // does selected item have the meta data i need? Yes, in a data- prop
      selectedItem = event.target;
      itemData = JSON.parse(selectedItem.dataset.varinfo)
      let { xOffset, yOffset } = itemData;
      itemData.initialX = event.clientX - xOffset;
      itemData.initialY = event.clientY - yOffset;
    }
  }

  const dragEnd = (): void => {
    if (active) {
      let { currentX, currentY } = itemData;
      itemData.initialX = currentX;
      itemData.initialY = currentY;
      selectedItem.dataset.varinfo = JSON.stringify(itemData);
      active = false
    }
  }

  const drag = (event: React.MouseEvent): void => {
    if (active) {
      let { initialX, initialY } = itemData;
      event.preventDefault();
      itemData.currentX = event.clientX - initialX;
      itemData.currentY = event.clientY - initialY;
      itemData.xOffset = itemData.currentX;
      itemData.yOffset = itemData.currentY;
      setTranslate(itemData.currentX, itemData.currentY, selectedItem);
    }
  }

  const setTranslate = (xPos: number, yPos: number, el: any): void => {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`
  }

  return (
    <div 
      className={styles.canvas}
      onMouseDown={dragStart}
      onMouseUp={dragEnd}
      onMouseMove={drag}>
      {variableArray.map((data, i) => <Variable data={data} key={i.toString()} edit={editVariable}/>)}
      {operationsArray.map((operator, i) => <Operator operator={operator} key={i.toString()}/>)}
      <Button name="Play" backgroundColor="red" onClick={pressPlay}/>
    </div>
  )
}


interface EditorProps {
  printToConsole(text:string): void
}

export const Editor: FunctionComponent<EditorProps> = ({ printToConsole }): JSX.Element => {
  const [variables, setVariables] = useState<VariableInfo[]>([]);
  const [operations, setOperations] = useState<OperationInfo[]>([])


  /* when a type is clicked from the dropdown, this function creates new variable
    metadata and consequently makes a new dom element representing the variable
  */
  const clickVariable = (type: string): void => {
    let newVarInfo = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type,
      name: '',
      value: undefined
    }
    let newVarArray: VariableInfo[] = [...variables, newVarInfo]
    console.log(newVarArray)
    setVariables(newVarArray)
  }

  const editVariable = (varData: VariableInfo, name: string, value: string = ''): void => {
    const newVariables = [...variables];
    let editedVar = newVariables.find(variable => variable.id === varData.id);
    if (editedVar) {
      editedVar.name = name;
      editedVar.value = value;
    }
    setVariables(newVariables);
  }

  const clickOperations = (type: string): void => {
    let newOperatorInfo = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type,
      arg1: '',
      arg2: ''
    }
    const newOperations: OperationInfo[] = [...operations, newOperatorInfo];
    setOperations(newOperations);
  }

  const pressPlay = (): void => {
    let i: string = variables.map(({name, value}) => `var ${name} = ${value}`).join('; ');
    (function() {
      console.log(i)
      eval(`${i}; printToConsole(x + y)`)
    })()

  }

  return (
    <Panel windowName="Editor">
      <ButtonContainer>
        <Button 
          name="Variables"
          ddClick={clickVariable}
          dropDown
          dropDownList={['Number', 'String', 'Boolean', 'Null']}/>
        <Button
          name="Operations"
          ddClick={clickOperations}
          dropDown
          dropDownList={['+', '-', '*', '/', '%']}/>
        <Button
          name="Loops"
          dropDown
          dropDownList={['For', 'While']}/>
        <Button name="Function"/>
        <Button name="Log to Console"/>
      </ButtonContainer>
      <Canvas
        variableArray={variables}
        editVariable={editVariable}
        operationsArray={operations}
        pressPlay={pressPlay}/>
    </Panel>
  )
}