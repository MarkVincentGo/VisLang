import React, { FunctionComponent, useState } from 'react';
import * as R from 'ramda';
import { Panel } from './Panel';
import { Canvas } from './EditorCanvas';
import { ButtonContainer, Button } from './Button';


export interface IVariableInfo {
  readonly id: number,
  type: string,
  valueType: string,
  name: string,
  args?: any[],
  value?: any,
  deleted: boolean,
}

export interface IVarReference {
  readonly id: number,
  readonly variableReferenced: IVariableInfo,
  deleted: boolean,
  args?: any[],
}

export interface IFunctionInfo {
  [key: string]: any,
  readonly id: number,
  type: string,
  opType: string,
  args: any[],
  func(...args: any[]): void,
  value: number | string | boolean,
  deleted: boolean
}

export interface DataSVGLine {
  readonly id: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  data: any,
  el1: any,
  el2: any,
}

interface EditorProps {
  interpret(data: any): void
}

export const Editor: FunctionComponent<EditorProps> = ({ interpret }): JSX.Element => {
  const [variables, setVariables] = useState<IVariableInfo[]>([]);
  const [varReferences, setVarReferences] = useState<IVarReference[]>([]);
  const [operations, setOperations] = useState<IFunctionInfo[]>([]);
  const [lines, setLines] = useState<DataSVGLine[]>([]);
  const [logs, setLogs] = useState<IFunctionInfo[]>([]);
  const [ends, setEnds] = useState<any[]>([]);


  /* when a type is clicked from the dropdown, this function creates new variable
    metadata and consequently makes a new dom element representing the variable
  */
  const clickVariable = (type: string): void => {
    let newVarInfo = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type: 'Value',
      valueType: type,
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
          id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
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
        const newReference = {...refData, id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) }
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

  const clickOperator = (type: string): void => {
    let opFunc = null
    if (type === '+') {
      opFunc = (a: number, b: number): number => a + b;
    } else if (type === '-') {
      opFunc = (a: number, b: number): number => a - b;
    } else if (type === '*') {
      opFunc = (a: number, b: number): number => a * b;
    } else if (type === '/') {
      opFunc = (a: number, b: number): number => a / b;
    } else if (type === '%') {
      opFunc = (a: number, b: number): number => a % b;
    } else { 
      opFunc = (): number => 0
    }

    let newOperatorInfo = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      type: 'Function',
      opType: type,
      args: [null, null],
      func: opFunc,
      value: 0,
      deleted: false
    }
    const newOperations: IFunctionInfo[] = [...operations, newOperatorInfo];
    setOperations(newOperations);
  }

  const editFunction = (operator: IFunctionInfo, key: string, value: any): void => {
    switch (operator.type) {
      case 'Function':
        if (operator.opType === 'Console Log') {
          let newLogs = logs.map(el => {
            let newEl:IFunctionInfo = {...el}
            if (newEl.id === operator.id) {
              newEl[key] = value;
            }
            return newEl;
          });
          setLogs(newLogs)
        } else {
          let newOperations = operations.map(el => {
            let newEl:IFunctionInfo = {...el}
            if (newEl.id === operator.id) {
              newEl[key] = value;
            }
            return newEl;
          });
          setOperations(newOperations)
        }
        break;
      case 'End': 
      let newEnds = ends.map(el => {
        let newEl:IFunctionInfo = {...el}
        if (newEl.id === operator.id) {
          newEl[key] = value;
        }
        return newEl;
      });
      setEnds(newEnds)
        break;
    
      default:
        break;
    }
  }

  const handleOperatorDropDown = (option: string, opData: IFunctionInfo) => {
    switch (option) {
      case 'Delete Operation': {
        let { id } = opData;
        let newLines = lines.filter(line => line.el1 !== id);
        newLines = newLines.filter(line => line.el2 !== id);
        setLines(newLines);

        let newOperations = operations.map(op => {
          if (op.id === id) {
            op.deleted = true;
          }
          return op
        });
        setOperations(newOperations);
        
        break;
      }
      case 'Copy Operation': {
        let opCopy = operations.find(op => op.id === opData.id)
        if (opCopy) {
          let newOperations = [
            ...operations,
            {...opCopy,
              id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
              args: [null, null] }
          ];
          setOperations(newOperations);
        }
        break;
      }
      default:
        break;
    }
  }

  const clickConsoleLog = ():void => {
    let newLog = {
      id: Math.floor(Math.random()* Number.MAX_SAFE_INTEGER),
      type: 'Function',
      opType: 'Console Log',
      args: [null],
      func: function(x: any) {console.log(x); return x},
      value: 0,
      deleted: false
    };
    let newLogs = [...logs, newLog];
    setLogs(newLogs);
  }

  const clickEnding = ():void => {
    let newEnd = {
      id: -(Math.floor(Math.random() * 1000 + 1)),
      type: 'End',
      args: [null],
      func: function(a: any) {return a},
      value: 1
    }
    setEnds([...ends, newEnd]);
  }

  
  const updateLines = (newLines: DataSVGLine[]):void => {
    setLines(newLines)
  }
  
  const pressPlay = (): void => { 
    interpret([
      ...variables.filter(v => !v.deleted),
      ...varReferences.filter(vr => !vr.deleted),
      ...operations.filter(op => !op.deleted),
      ...lines,
      ...logs,
      ...ends.filter(end => end.args[0])
    ])
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
          ddClick={clickOperator}
          dropDown
          dropDownList={['+', '-', '*', '/', '%']}/>
        <Button
          name="Loops"
          dropDown
          dropDownList={['For', 'While']}/>
        <Button name="Function"/>
        <Button
          name="Log to Console"
          onClick={clickConsoleLog}/>
        <Button 
          name="End"
          onClick={clickEnding}/>
      </ButtonContainer>
      <Canvas
        variableArray={variables}
        referenceArray={varReferences}
        editVariable={editVariable}
        operationsArray={operations}
        editFunction={editFunction}
        logsArray={logs}
        endsArray={ends}
        handleVariableDropDown={handleVariableDropDown}
        handleReferenceDropDown={handleReferenceDropDown}
        handleOperatorDropDown={handleOperatorDropDown}
        pressPlay={pressPlay}
        linesArray={lines}
        updateLines={updateLines}/>
    </Panel>
  )
}