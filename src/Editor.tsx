import React, { FunctionComponent, useState } from 'react';
import { Panel } from './Panel';
import { Canvas } from './EditorCanvas';
import { ButtonContainer, Button } from './Button';


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

export interface DataSVGLine {
  id: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  data: any,
  el1: any,
  el2: any,
}

interface EditorProps {
  printToConsole(data: any): void
}

export const Editor: FunctionComponent<EditorProps> = ({ printToConsole }): JSX.Element => {
  const [variables, setVariables] = useState<IVariableInfo[]>([]);
  const [varReferences, setVarReferences] = useState<IVarReference[]>([]);
  const [operations, setOperations] = useState<IOperatorInfo[]>([]);
  const [lines, setLines] = useState<DataSVGLine[]>([])


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

        let newLines = lines.filter(line => line.el1 !== varData.id);
        newLines = newLines.filter(line => line.el2 !== varData.id);
        setLines(newLines)


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
    printToConsole({ variables })
  }

  const updateLines = (newLines: DataSVGLine[]):void => {
    setLines(newLines)
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
        pressPlay={pressPlay}
        linesArray={lines}
        updateLines={updateLines}/>
    </Panel>
  )
}