import React, { FunctionComponent, useState, useEffect } from 'react';
import { Constant, Variable, VarReference, Operator, End, Loop } from './Classes'
import { IVariableInfo, IVarReference, IFunctionInfo, IDataSVGLine, IEnd, IConstantInfo, ILoop } from './Interfaces';
import { Panel } from './Panel';
import { Canvas } from './EditorCanvas';
import { ButtonContainer, Button } from './Button';
import * as R from 'ramda';


interface EditorProps {
  interpret(data: any): void,
  width: number
}

export const Editor: FunctionComponent<EditorProps> = ({ interpret, width }): JSX.Element => {
  const [constants, setConstants] = useState<IConstantInfo[]>([])
  const [variables, setVariables] = useState<IVariableInfo[]>([]);
  const [varReferences, setVarReferences] = useState<IVarReference[]>([]);
  const [operations, setOperations] = useState<IFunctionInfo[]>([]);
  const [lines, setLines] = useState<IDataSVGLine[]>([]);
  const [loops, setLoops] = useState<ILoop[]>([])
  const [ends, setEnds] = useState<IEnd[]>([]);

  const [refer, setRefer] = useState<number>((window.innerWidth * 2 / 3) - 50);

  useEffect(() => {
    let changeRef = (): void => {
     setRefer(window.innerWidth * 2 / 3 - 50);
    }
    window.addEventListener('resize', changeRef);
// this is for loading sessions
    // let variables = JSON.parse(`[{"id":624655794445455,"type":"Constant","valueType":"Number","value":"1","deleted":false},{"id":1045881243552361,"type":"Assign Function","valueType":"Number","name":"1","args":[null],"value":"3","deleted":false,"reassign":false},{"id":7382545063440897,"type":"Function","opType":"+","args":[1537821049957365,707717976527685],"value":0,"deleted":false,"color":"#FCBB5B"},{"id":3580793239737571,"x1":359,"x2":381,"y1":265,"y2":363,"el1":7382545063440897,"el2":-261},{"id":707717976527685,"x1":455,"x2":368,"y1":185,"y2":234,"el1":1045881243552361,"el2":7382545063440897},{"id":1537821049957365,"x1":273,"x2":355,"y1":197,"y2":233,"el1":624655794445455,"el2":7382545063440897},{"id":-261,"type":"End","args":[3580793239737571],"value":1}]`)
    // let newVar = variables.filter((el: any) => {
    //   return el.type === 'Assign Function'
    // });
    // let newConst = variables.filter((el: any) => el.type === 'Constant')
    // let newOps = variables.filter((el: any) => el.type === 'Function')
    // setVariables(newVar)
    // setConstants(newConst)
    // setOperations(newOps)
    return () => {
      window.removeEventListener('resize', changeRef)
    }
  }, [])


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

  const editFunction = (operator: IFunctionInfo | IVariableInfo | IEnd, key: string, value: any): void => {
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
      case 'End': 
      let newEnds = R.map(el => {
        let newEl:IEnd = {...el}
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
    let newLoops = [...loops, {...newLoop}];
    setLoops(newLoops)
  }


  //BUG, when certain loop is put in, loops array in state is modified
  const editLoop = (loop: number, key: string, value: any, larr: any[]): void => {
    debugger
    console.log(loops)
    let newLoops = R.map((l: ILoop) => {
      let newLoop: ILoop = {...l};
      if (newLoop.id === loop) {
        newLoop[key] = value;
      }
      return newLoop;
    }, loops)
    debugger
    console.log(newLoops)
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
    let allData = [
      ...constants.filter(c => !c.deleted),
      ...variables.filter(v => !v.deleted),
      ...varReferences.filter(vr => !vr.deleted),
      ...operations.filter(op => !op.deleted),
      ...lines,
      ...loops,
      ...ends.filter(end => end.args[0])
    ];
    interpret(allData);
  }

  return (
    <Panel windowName="Editor" style={{width: refer + width}}>
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