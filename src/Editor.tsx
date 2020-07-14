import React, { FunctionComponent, useState } from 'react';
import { Constant, Variable, VarReference, Operator, End, Loop } from './Classes'
import { IVariableInfo, IVarReference, IFunctionInfo, IDataSVGLine, IEnd, IConstantInfo, ILoop } from './Interfaces';
import { Panel } from './Panel';
import { Canvas } from './EditorCanvas';
import { ButtonContainer, Button } from './Button';
import * as R from 'ramda';


interface EditorProps {
  interpret(data: any): void
}

export const Editor: FunctionComponent<EditorProps> = ({ interpret }): JSX.Element => {
  const [constants, setConstants] = useState<IConstantInfo[]>([])
  const [variables, setVariables] = useState<IVariableInfo[]>([]);
  const [varReferences, setVarReferences] = useState<IVarReference[]>([]);
  const [operations, setOperations] = useState<IFunctionInfo[]>([]);
  const [lines, setLines] = useState<IDataSVGLine[]>([]);
  const [loops, setLoops] = useState<ILoop[]>([])
  const [ends, setEnds] = useState<any[]>([]);


  const clickConstant = (type: string): void => {
    let newConstant: IConstantInfo = new Constant(type)
    let newConstantArray: IConstantInfo[] = [...constants, newConstant]
    setConstants(newConstantArray)
  }

  const editConstant = (constData: IConstantInfo, value: string = ''): void => {
    const newConstants = [...constants];
    let editedConst = R.find(constant => constant.id === constData.id, newConstants);
    if (editedConst) { editedConst.value = value }
    setConstants(newConstants)
  }

  /* when a type is clicked from the dropdown, this function creates new variable
    metadata and consequently makes a new dom element representing the variable
  */
  const clickVariable = (type: string): void => {
    let newVar: IVariableInfo = new Variable(type)
    let newVarArray: IVariableInfo[] = [...variables, newVar]
    setVariables(newVarArray)
  }

  /* edits variable info based on the variable id given on instantiation */
  const editVariable = (varData: IVariableInfo, name: string, value: string = ''): void => {
    const newVariables = [...variables];
    let editedVar = R.find(variable => variable.id === varData.id, newVariables);
    if (editedVar) {
      editedVar.name = name;
      editedVar.value = value;
      if (editedVar.value === 'REF') {
        editedVar.reassign = true;
      } else {
        editedVar.reassign = false;
      }
    }
    setVariables(newVariables);
  }

  const handleConstantDropDown = ( option: string, constData: IConstantInfo ): void => {
    switch (option) {
      case 'Delete Constant': {
        let newConstants = R.map(el => {
          if (el === constData) {
            el.deleted = true;
          }
          return el;
        }, constants)
        setConstants(newConstants)

        let newLines = lines.filter(line => line.el1 !== constData.id);
        newLines = newLines.filter(line => line.el2 !== constData.id);
        setLines(newLines);
        break;
      }
      default:
        break;
    }
  }

  const handleVariableDropDown = ( option: string, varData: IVariableInfo ): void => {
    switch (option) {
      case 'Add Reference': {
        const newReference: IVarReference = new VarReference(varData)
        const newVarReferences = [...varReferences, newReference]
        setVarReferences(newVarReferences)
        break;

      }
      case 'Delete Variable': {
        /* this method does not filter because on rerender, a deleted variable 
        and its references might move positions in the array and change their
        positions in the DOM. Workaround was to keep the variables and references
        in the array and just add a 'deleted property which renders nothing if true */
        const newVarReferences = R.map(el => {
          if (el.variableReferenced === varData) {
            el.deleted = true;
          }
          return el;
        }, varReferences);

        let newLines = lines.filter(line => line.el1 !== varData.id);
        newLines = newLines.filter(line => line.el2 !== varData.id);
        setLines(newLines);


        setVarReferences(newVarReferences);
        /* does a full delete of the vairable properties, interpreter SHOULD ignore
        var names of empty string*/
        const newVariables = R.map(el => {
          if (el === varData) {
            el.deleted = true;
            el.name = '';
            el.value = null
          }
          return el;
        }, variables);
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
        // const newReference = {...refData, id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}
        const newReference: IVarReference = new VarReference(refData.variableReferenced)
        const newVarReferences = [...varReferences, newReference];
        setVarReferences(newVarReferences)
        break;
      }
      case 'Delete Reference': {
        const newVarReferences = R.map(el => {
          if (el === refData) {
            el.deleted = true;
          }
          return el;
        }, varReferences);
        setVarReferences(newVarReferences);

        let newLines = lines.filter(line => line.el1 !==  refData.id);
        newLines = newLines.filter(line => line.el2 !== refData.id);
        setLines(newLines);
        break;
      }
        
      default:
        break;
    }
  }

  const clickOperator = (type: string): void => {
    let newOperatorInfo: IFunctionInfo = new Operator(type)
    const newOperations: IFunctionInfo[] = [...operations, newOperatorInfo];
    setOperations(newOperations);
  }

  const editFunction = (operator: IFunctionInfo | IVariableInfo | ILoop, key: string, value: any): void => {
    switch (operator.type) {
      case 'Assign Function': {
        let newVariables = R.map(el => {
          let newVar: IVariableInfo = {...el};
          if (newVar.id === operator.id) {
            newVar[key] = value
          }
          return newVar
        }, variables)
        setVariables(newVariables)
        break;
      }
      case 'Function':
        let newOperations = R.map(el => {
          let newEl:IFunctionInfo = {...el}
          if (newEl.id === operator.id) {
            newEl[key] = value;
          }
          return newEl;
        }, operations);
        setOperations(newOperations);
        break;
      case 'Loop':
        let newLoops = R.map(el => {
          let newLoop: ILoop = {...el}
          if (newLoop.id === operator.id) {
            newLoop[key] = value;
          }
          return newLoop;
        }, loops);
        setLoops(newLoops)
        break;
      case 'End': 
      let newEnds = R.map(el => {
        let newEl:IFunctionInfo = {...el}
        if (newEl.id === operator.id) {
          newEl[key] = value;
        }
        return newEl;
      }, ends);
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

        let newOperations = R.map(op => {
          if (op.id === id) {
            op.deleted = true;
          }
          return op
        }, operations);
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

  const clickOrder = ():void => {
    let newOperation = new Operator('Order', 'goldenrod');
    let newOperations = [...operations, newOperation];
    setOperations(newOperations);
  }


  const clickLoop = (type: string): void => {
    let newLoop = new Loop()
    let newLoops = [...loops, newLoop];
    setLoops(newLoops)
  }

  const editLoop = (loop: ILoop, key: string, value: any): void => {
    let newLoops = R.map((l) => {
      let newLoop = {...l};
      if (l.id === loop.id) {
        newLoop[key] = value;
      }
      return newLoop;
    }, loops)
    setLoops(newLoops);
  }

  const clickConsoleLog = ():void => {
    let newOperation = new Operator('Print', 'lightgreen');
    let newOperations = [...operations, newOperation];
    setOperations(newOperations);
  }

  const clickEnding = ():void => {
    let newEnd: IEnd = new End();
    setEnds([...ends, newEnd]);
  }

  
  const updateLines = (newLines: IDataSVGLine[]):void => {
    setLines(newLines)
  }
  
  const pressPlay = (): void => { 
    interpret([
      ...constants.filter(c => !c.deleted),
      ...variables.filter(v => !v.deleted),
      ...varReferences.filter(vr => !vr.deleted),
      ...operations.filter(op => !op.deleted),
      ...lines,
      ...loops,
      ...ends.filter(end => end.args[0])
    ])
  }

  return (
    <Panel windowName="Editor">
      <ButtonContainer>
        <Button 
          name="Constant"
          ddClick={clickConstant}
          dropDown
          dropDownList={['Number', 'String', 'Boolean']}/>
        <Button 
          name="Variables"
          ddClick={clickVariable}
          dropDown
          dropDownList={['Number', 'String', 'Boolean', 'Null']}/>
        <Button
          name="Operations"
          ddClick={clickOperator}
          dropDown
          dropDownList={['+', '-', '*', '/', 'mod', '<', '>', '==']}
          ddStyle={{width: 110, height: 170}}/>
        <Button
          name="Loops"
          dropDown
          dropDownList={['For', 'While']}
          ddClick={clickLoop}/>
        <Button 
          name="Set Order"
          onClick={clickOrder}/>
        <Button
          name="Print"
          onClick={clickConsoleLog}/>
        <Button 
          name="End"
          onClick={clickEnding}/>
      </ButtonContainer>
      <Canvas
        constantArray={constants}
        editConstant={editConstant}
        variableArray={variables}
        referenceArray={varReferences}
        editVariable={editVariable}
        operationsArray={operations}
        editFunction={editFunction}
        loopsArray={loops}
        editLoop={editLoop}
        endsArray={ends}
        handleConstantDropDown={handleConstantDropDown}
        handleVariableDropDown={handleVariableDropDown}
        handleReferenceDropDown={handleReferenceDropDown}
        handleOperatorDropDown={handleOperatorDropDown}
        pressPlay={pressPlay}
        linesArray={lines}
        updateLines={updateLines}/>
    </Panel>
  )
}