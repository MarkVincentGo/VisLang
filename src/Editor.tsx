import React, { FunctionComponent, useState } from 'react';
import styles from './Editor.module.css';
import { Panel } from './Panel';
import { ButtonContainer, Button } from './Button';
import { Variable } from './Variable';
import { Operator } from './Operator';
import { VarReference } from './VarReference'

export interface IVariableInfo {
  readonly id: number,
  type: string,
  name: string,
  value?: any,
  deleted: boolean,
}

export interface IVarReference {
  readonly referenceId: number,
  readonly variableReferenced: IVariableInfo,
  deleted: boolean,
}

export interface IOperatorInfo {
  readonly id: number,
  type: string,
  arg1: string,
  arg2: string
}

interface CanvasProps {
  variableArray: IVariableInfo[],
  referenceArray: IVarReference[],
  operationsArray: IOperatorInfo[],
  editVariable(varData: IVariableInfo, name: string, value?: string): void,
  handleVariableDropDown(option: string, varData?: IVariableInfo): void,
  handleReferenceDropDown(option: string, refData: IVarReference): void,
  pressPlay(): void
}

const Canvas: FunctionComponent<CanvasProps> = (
  { variableArray = [],
    referenceArray = [],
    operationsArray = [],
    editVariable,
    handleVariableDropDown,
    handleReferenceDropDown,
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
      <Button
        name="Play"
        backgroundColor="yellowgreen"
        color="black"
        onClick={pressPlay}
        style={{ height: 'auto', borderRadius: 0 }}/>
      {variableArray.map((data, i) => (
        <Variable
          data={data}
          key={i.toString()}
          edit={editVariable}
          handleVariableDropDown={handleVariableDropDown}/>
      ))}
      {referenceArray.map((data, i) => (
        <VarReference
          key={i.toString()}
          data={data}
          handleReferenceDropDown={handleReferenceDropDown}/>
      ))}
      {operationsArray.map((operator, i) => (
        <Operator
          operator={operator}
          key={i.toString()}/>
      ))}
    </div>
  )
}


interface EditorProps {
  printToConsole(data: any): void
}

export const Editor: FunctionComponent<EditorProps> = ({ printToConsole }): JSX.Element => {
  const [variables, setVariables] = useState<IVariableInfo[]>([]);
  const [varReferences, setVarReferences] = useState<IVarReference[]>([])
  const [operations, setOperations] = useState<IOperatorInfo[]>([])


  /* when a type is clicked from the dropdown, this function creates new variable
    metadata and consequently makes a new dom element representing the variable
  */
  const clickVariable = (type: string): void => {
    let newVarInfo = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type,
      name: '',
      value: undefined,
      deleted: false
    }
    let newVarArray: IVariableInfo[] = [...variables, newVarInfo]
    setVariables(newVarArray)
  }

  /* edits variable info based on the variable id given on instantiation */
  const editVariable = (varData: IVariableInfo, name: string, value: string = ''): void => {
    const newVariables = [...variables];
    let editedVar = newVariables.find(variable => variable.id === varData.id);
    if (editedVar) {
      editedVar.name = name;
      editedVar.value = value;
    }
    setVariables(newVariables);
  }

  const handleVariableDropDown = ( option: string, varData: IVariableInfo ): void => {
    switch (option) {
      case 'Add Reference': {
        const newReference: IVarReference = {
          referenceId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
          variableReferenced: varData,
          deleted: false
        }
        const newVarReferences = [...varReferences, newReference]
        setVarReferences(newVarReferences)
        break;

      }
      case 'Delete Variable': {
        /* this method does not filter because on rerender, a deleted variable 
        and its references might move positions in the array and change their
        positions in the DOM. Workaround was to keep the variables and references
        in the array and just add a 'deleted property which renders nothing if true */
        const newVarReferences = varReferences.map(el => {
          if (el.variableReferenced === varData) {
            el.deleted = true
          }
          return el;
        });
        setVarReferences(newVarReferences);
        /* does a full delete of the vairable properties, interpreter SHOULD ignore
        var names of empty string*/
        const newVariables = variables.map(el => {
          if (el === varData) {
            el.deleted = true;
            el.name = '';
            el.value = null
          }
          return el;
        });
        setVariables(newVariables);
        break;
      }
      default:
        break;
    }
  }

  const handleReferenceDropDown = (option: string, refData: IVarReference): void => {
    switch (option) {
      case 'Copy Reference': {
        const newReference = {...refData, referenceId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) }
        const newVarReferences = [...varReferences, newReference];
        setVarReferences(newVarReferences)
        break;
      }
      case 'Delete Reference': {
        const newVarReferences = varReferences.map(el => {
          if (el === refData) {
            el.deleted = true;
          }
          return el;
        });
        setVarReferences(newVarReferences);
        break;
      }
        
      default:
        break;
    }
  }

  const clickOperations = (type: string): void => {
    let newOperatorInfo = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type,
      arg1: '',
      arg2: ''
    }
    const newOperations: IOperatorInfo[] = [...operations, newOperatorInfo];
    setOperations(newOperations);
  }

  const pressPlay = (): void => {
    let i: string = variables.map(({name, value}) => `var ${name} = ${value}`).join('; ');
    printToConsole({ variables })

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
        referenceArray={varReferences}
        editVariable={editVariable}
        operationsArray={operations}
        handleVariableDropDown={handleVariableDropDown}
        handleReferenceDropDown={handleReferenceDropDown}
        pressPlay={pressPlay}/>
    </Panel>
  )
}