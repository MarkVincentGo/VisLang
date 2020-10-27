import React, { FunctionComponent, useState, useEffect } from 'react';
import { Constant, Variable, VarReference, Operator, End, Loop } from './Classes'
import { IVariableInfo, IVarReference, IFunctionInfo, IDataSVGLine, IEnd, IConstantInfo, ILoop } from './Interfaces';
import { Panel } from './Panel';
import { Canvas } from './EditorCanvas';
import { ButtonContainer, Button } from './Button';
import * as R from 'ramda';
import { getDraggableCoordinates } from './utilityFunctions';


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
    let variables = JSON.parse(`[{"id":3440241934379641,"type":"Constant","valueType":"Number","value":"1","deleted":false,"left":189.53125,"top":148.796875},{"id":3231878006121587,"type":"Constant","valueType":"Number","value":"2","deleted":false,"left":346.203125,"top":153.375},{"id":2319048072233563,"type":"Function","opType":"+","args":[7411721733786273,3490305724360401],"value":0,"deleted":false,"color":"#FCBB5B","left":201.734375,"top":139.875},{"id":7411721733786273,"x1":273,"x2":332,"y1":219,"y2":266,"el1":3440241934379641,"el2":2319048072233563},{"id":3490305724360401,"x1":374,"x2":349,"y1":198,"y2":269,"el1":3231878006121587,"el2":2319048072233563},{"id":6384779577110457,"x1":342,"x2":343,"y1":298,"y2":327,"el1":2319048072233563,"el2":-620},{"id":-620,"type":"End","args":[6384779577110457],"value":1,"left":457.09375,"top":169.203125}]`)
    let newVar = variables.filter((el: any) => {
      return el.type === 'Assign Function'
    });
    let newConst = variables.filter((el: any) => el.type === 'Constant')
    let newOps = variables.filter((el: any) => el.type === 'Function')
    // add abstraction method for this
    newOps = newOps.map((el: any) => {
      switch (el.opType) {
        case '+':
          el.func = (a: number, b: number): number => a + b;
          return el;
        case '-':
          el.func = (a: number, b: number): number => a - b;
          return el;
        case '*':
          el.func = (a: number, b: number): number => a * b;
          return el;
        case '/':
          el.func = (a: number, b: number): number => a / b;
          return el;
        case 'mod':
          el.func = (a: number, b: number): number => a % b;
          return el;
        case 'Print':
          el.func = (x: any) => { console.log(x); return x };
          el.args = [null]
          return el;
        case '<':
          el.func = (a: number | string, b: number | string): boolean => a < b;
          return el;
        case '>':
          el.func = (a: number | string, b: number | string): boolean => a > b;
          return el;  
        case '==':
          el.func = (a: number | string, b: number | string): boolean => a === b;
        return el;
        case 'Order':
          el.args = [null, null, null];
          el.func = (...args: any): any => args[args.length - 1];
          el.increaseArgs = function() {el.args = [...el.args, null]};
          el.decreaseArgs = function() {el.args = el.args.slice(0, el.args.length - 1)}
        return el;
        default:
          el.func = (): number => 0;
          return el;
      }
    })
    let newEnds = variables.filter((el: any) => el.type === 'End')
    newEnds = newEnds.map((el: any) => {
      el.func = function(a: any): any {
        return a;
      };
      return el;
    })
    let newLines = variables.filter((el: any) => el.hasOwnProperty('el1'))
    setVariables(newVar)
    setConstants(newConst)
    setOperations(newOps)
    setLines(newLines)
    setEnds(newEnds)
    console.log(variables)
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
  const editLoop = (loop: number, key: string, value: any, larr?: any[]): void => {
    let newLoops = R.map((l: ILoop) => {
      let newLoop: ILoop = {...l};
      if (newLoop.id === loop) {
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
    let allData = [
      ...constants.filter(c => !c.deleted),
      ...variables.filter(v => !v.deleted),
      ...varReferences.filter(vr => !vr.deleted),
      ...operations.filter(op => !op.deleted),
      ...lines,
      ...loops,
      ...ends.filter(end => end.args[0])
    ];
    const processed = allData.map((e: any) =>
    {
      let newE = { ...e }
      if (!e.hasOwnProperty('el1')) {
        const { left, top } = getDraggableCoordinates(newE)
        newE.left = left;
        newE.top = top;
      }
      return newE;
    })
    console.log(JSON.stringify(processed));
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