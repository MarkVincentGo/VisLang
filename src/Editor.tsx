import React, { FunctionComponent, useState, useEffect } from 'react';
import styles from './Editor.module.css';
import axios from 'axios';
import { Constant, Variable, VarReference, Operator, End, Loop } from './Classes'
import { IVariableInfo, IVarReference, IFunctionInfo, IDataSVGLine, IEnd, IConstantInfo, ILoop } from './Interfaces';
import { Panel } from './Panel';
import { Canvas } from './EditorCanvas';
import { ButtonContainer, Button } from './Button';
import * as R from 'ramda';
import { getDraggableCoordinates } from './utilityFunctions';
import { createPortal } from 'react-dom';
import { LoadModal, SaveModal } from './SaveModal';


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

  const [saveModal, setSaveModal] = useState(false)
  const [loadModal, setLoadModal] = useState(false)

  const [refer, setRefer] = useState<number>((window.innerWidth * 2 / 3) - 50);

  useEffect(() => {
    let changeRef = (): void => {
     setRefer(window.innerWidth * 2 / 3 - 50);
    }
    window.addEventListener('resize', changeRef);
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

  const pressClear = (): void => {
    setConstants([]);
    setVariables([]);
    setVarReferences([]);
    setEnds([]);
    setLoops([]);
    setLines([]);
    setOperations([]);
  }

  const saveData = async (name: string) => {
    try {
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
          newE.left = left - 30;
          newE.top = top - 83;
        }
        return newE;
      });
      await axios.post('/save', { Name: name, Components: JSON.stringify(processed)})
      setSaveModal(false)
    } catch(e) {
      console.error(e)
    }
  }

  const pressSave = (): void => {
    setSaveModal(true)
  }

  const loadData = async (name: string) => {
    pressClear();

    try {
      const { data } = await axios.get(`/load/${name}`)
      // this is for loading sessions
      if (!data.Name) {setLoadModal(false); return };
      let variables = data.Components;
      let newVar = variables
        .filter((el: any) => el.type === 'Assign Function')
        .map((el: IVariableInfo) => {
          return { ...el, func: function(incomingVal: any) {
            return incomingVal;
          }}
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
    let newReferences = variables.filter((el: any) => el.type === 'Reference').map((el: any) => {
      return { ...el,
        variableReferenced: newVar.find((e: IVariableInfo) => e.id === el.variableReferenced.id),
        func: (scope: Map<string, any>) => {
          return scope.get(el.variableReferenced.name);
        }}
    })
    let newEnds = variables.filter((el: any) => el.type === 'End');
    newEnds = newEnds.map((el: any) => {
      el.func = function(a: any): any {
        return a;
      };
      return el;
    });
    let newLines = variables.filter((el: any) => el.hasOwnProperty('el1'));
    setLines(newLines);
    setVariables(newVar);
    setVarReferences(newReferences);
    setConstants(newConst);
    setOperations(newOps);
    setEnds(newEnds);
    setLoadModal(false);
    } catch (e) {
      console.error(e);
    }
  }

  const pressLoad = () => {
    setLoadModal(true)
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
    <Panel className={styles.editor} windowName="Editor" style={{width: refer + width}}>
      {saveModal && createPortal(
        <SaveModal onClick={() => setSaveModal(false)} saveFn={saveData}/>, 
        document.getElementsByClassName('App')[0])}
      {loadModal && createPortal(
        <LoadModal onClick={() => setSaveModal(false)} loadFn={loadData}/>, 
        document.getElementsByClassName('App')[0])}
      <ButtonContainer>
        <Button
          className={styles.constantsButton} 
          name="Constant"
          ddClick={clickConstant}
          dropDown
          dropDownList={['Number', 'String', 'Boolean']}/>
        <Button 
          className={styles.variablesButton} 
          name="Variables"
          ddClick={clickVariable}
          dropDown
          dropDownList={['Number', 'String', 'Boolean', 'Null']}/>
        <Button
          className={styles.operationsButton} 
          name="Operations"
          ddClick={clickOperator}
          dropDown
          dropDownList={['+', '-', '*', '/', 'mod', '<', '>', '==']}
          ddStyle={{width: 110, height: 170}}/>
        <Button
          className={styles.loopsButton} 
          name="Loops"
          dropDown
          dropDownList={['For', 'While']}
          ddClick={clickLoop}/>
        <Button 
          className={styles.setOrderButton} 
          name="Set Order"
          onClick={clickOrder}/>
        <Button
          className={styles.printButton} 
          name="Print"
          onClick={clickConsoleLog}/>
        <Button 
          className={styles.endButton} 
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
        pressSave={pressSave}
        pressLoad={pressLoad}
        pressClear={pressClear}
        linesArray={lines}
        updateLines={updateLines}/>
    </Panel>
  )
}