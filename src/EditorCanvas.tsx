import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import { DrawLines } from './DrawLines';
import { DataSVGLine } from './Classes'
import styles from './Editor.module.css';
import { Button } from './Button';
import { Variable } from './Variable';
import { Operator } from './Operator';
import { VarReference } from './VarReference'
import { IVariableInfo, IVarReference, IFunctionInfo, IDataSVGLine } from './Interfaces';
import { ConsoleLog } from './SimpleFunctions';
import { End } from './End';


interface CanvasProps {
  variableArray: IVariableInfo[],
  referenceArray: IVarReference[],
  operationsArray: IFunctionInfo[],
  linesArray: IDataSVGLine[],
  loopsArray: number[],
  logsArray: IFunctionInfo[],
  endsArray:any[],
  updateLines(newLines: IDataSVGLine[]): void,
  editVariable(varData: IVariableInfo, name: string, value?: string): void,
  editFunction(operator: IFunctionInfo, key: string, value: any): void,
  handleVariableDropDown(option: string, varData: IVariableInfo): void,
  handleReferenceDropDown(option: string, refData: IVarReference): void,
  handleOperatorDropDown(option: string, opData: IFunctionInfo): void,
  pressPlay(): void
}


export const Canvas: FunctionComponent<CanvasProps> = (
  { variableArray,
    referenceArray,
    operationsArray,
    linesArray,
    loopsArray,
    logsArray,
    endsArray,
    updateLines,
    editVariable,
    editFunction,
    handleVariableDropDown,
    handleReferenceDropDown,
    handleOperatorDropDown,
    pressPlay }
  ) => {
  let active = false;
  let selectedItem: any = null;
  let itemData: any = null;
  let startX = 0;
  let startY = 0;
  // this is attempt to get the height and width of the canvas component
  const [dimensions, setDimensions] = useState<number[]>([0,0]);
  const [mousedDownInNode, setmousedDownInNode] = useState<boolean>(false);
  const [currentLine, setcurrentLine] = useState<IDataSVGLine>(
    {id: 0, x1: 0, y1: 0, x2: 0, y2: 0, data: null, el1: null, el2: null}
    );
  const [renderSVG, setrenderSVG] = useState(false);

  // const canvasEl = useCallback((node) => {
  //     if (node) {
  //       setDimensions([node.clientHeight, node.clientWidth])
  //     }
  //   }, [],)

    const canvasEl = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const getRectsInterval = setInterval(() => {
        setDimensions(dimensions => {
          let node = canvasEl.current;
          if (node) {
            let newDimensions: number[] = [node.clientHeight, node.clientWidth];
            if (!renderSVG) {
              setrenderSVG(true)
            }
            return JSON.stringify(dimensions) === JSON.stringify(newDimensions) ? dimensions : newDimensions
          }
          return dimensions
        })
      }, 500)
      return () => {
        clearInterval(getRectsInterval)
      }
      // eslint-disable-next-line
    }, [])

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
    startX = event.clientX;
    startY = event.clientY;
  }

  const dragEnd = (event: any): void => {
    if (active) {
      let { currentX, currentY } = itemData;
      itemData.initialX = currentX;
      itemData.initialY = currentY;
      selectedItem.dataset.varinfo = JSON.stringify(itemData);
      active = false;


      // if active, i want to change the coordinates of each line connected to that element
      // i have component id info with item data
      // i have the dom node info in selected data
      // all i need is the svg info (select element by id)
      // lines are connected based on the nodes current position
      // change all the line instances that have this component id
      // if this is an el1, change all of the x1, y1
      // if this is an el2, change the x2, y2
      // make the change relative to the bound client rect of canvas
      let newLines = linesArray.map(el => {
        let newEl = {...el}
        if (newEl.el1 === itemData.componentId) {
          newEl.x1 = newEl.x1 + (event.clientX - startX);
          newEl.y1 = newEl.y1 + (event.clientY - startY);
        } else if (newEl.el2 === itemData.componentId) {
          newEl.x2 = newEl.x2 + (event.clientX - startX);
          newEl.y2 = newEl.y2 + (event.clientY - startY);
        }
        return newEl;
      })
      if (linesArray.length) {
        updateLines(newLines)
      }
    }
    if (mousedDownInNode) {
      setcurrentLine({id: 0, x1: 0, y1: 0, x2: 0, y2: 0, data: null, el1: null, el2: null})
      setmousedDownInNode(false)
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
    if (mousedDownInNode) {
      nodeMouseMove(event)
    }
  }

  const setTranslate = (xPos: number, yPos: number, el: any): void => {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`
  }

  // line-making logic
  // when one node is clicked client mouse data passed to line data
  const nodeMouseDown = (event: React.MouseEvent,  nodeInfo: any, index: number): void => {
    let { position, id: nodeId, args } = nodeInfo
    if (!nodeId) {
      nodeId = nodeInfo.referenceId
    }
    setmousedDownInNode(true)
    let newLine: IDataSVGLine = new DataSVGLine(position, nodeId, event)

    if (position === 'top') {
      // implement logic if line is backed out
      let newArgs = [...args];
      newArgs[index] = newLine.id;
      editFunction(nodeInfo, 'args', newArgs)
    }

    setcurrentLine(newLine)
  }


  const nodeMouseMove = (event: React.MouseEvent):void => {
    let newLine = {
      ...currentLine,
      x2: event.clientX, 
      y2: event.clientY,
    }
    setcurrentLine(newLine)
  }

  const nodeMouseUp = (event: React.MouseEvent, nodeInfo: any, index: number):void => {
    let { position, id: nodeId, args } = nodeInfo;
    let newLine = {...currentLine}
    if (position === 'bottom') {
      newLine.el1 = nodeId
    } else if (position === 'top') {
      newLine.el2 = nodeId
    }
    
    if (position === 'top') {
      let newArgs = [...args];
      newArgs[index] = newLine.id;
      editFunction(nodeInfo, 'args', newArgs)
    }

    let newLines = [...linesArray, newLine];
    updateLines(newLines);
    setmousedDownInNode(false)
  }

  const deleteLine = (lineId: number): void => {
    let newLines = linesArray.filter(line => line.id !== lineId);
    updateLines(newLines)

    for (let op of operationsArray) {
      let indexOfLineId = op.args.indexOf(lineId);
      if (indexOfLineId > -1 ) {
        let argsCopy = [...op.args]
        argsCopy[indexOfLineId] = null;
        editFunction(op, 'args', argsCopy);
      }
    }

    for (let end of endsArray) {
      let indexOfLineId = end.args.indexOf(lineId);
      if (indexOfLineId > -1 ) {
        let argsCopy = [...end.args]
        argsCopy[indexOfLineId] = null;
        editFunction(end, 'args', argsCopy);
      }
    }

  }

  return (
    <div 
      className={styles.canvas}
      draggable="false"
      onMouseDown={dragStart}
      onMouseUp={dragEnd}
      onMouseMove={drag}
      ref={canvasEl}>
      <Button
        name="Play"
        backgroundColor="yellowgreen"
        color="black"
        onClick={pressPlay}
        style={{ height: 'auto', borderRadius: 0, width: '100%' }}
        outerStyle={{width: '100%'}}/>
      {variableArray.map((data, i) => (
        <Variable
          data={data}
          key={i.toString()}
          edit={editVariable}
          mousedDown={nodeMouseDown}
          mousedUp={nodeMouseUp}
          handleVariableDropDown={handleVariableDropDown}/>
      ))}
      {referenceArray.map((data, i) => (
        <VarReference
          key={i.toString()}
          data={data}
          mousedDown={nodeMouseDown}
          mousedUp={nodeMouseUp}
          handleReferenceDropDown={handleReferenceDropDown}/>
      ))}
      {operationsArray.map((operator, i) => (
        <Operator
          operator={operator}
          key={i.toString()}
          mousedDown={nodeMouseDown}
          mousedUp={nodeMouseUp}
          handleOperatorDropDown={handleOperatorDropDown}/>
      ))}
      {logsArray.map((log, i) => (
        <ConsoleLog
          key={i.toString()}
          mousedDown={nodeMouseDown}
          mousedUp={nodeMouseUp}
          data={log}/>
      ))}
      {endsArray.map((end, i) => (
        <End
          key={i.toString()}
          mousedDown={nodeMouseDown}
          mousedUp={nodeMouseUp}
          data={end}/>
      ))}

      { renderSVG ?
        <DrawLines
        canvasInfo={dimensions}
        currentLine={currentLine}
        mouseDown={mousedDownInNode}
        lines={linesArray}
        loops={loopsArray}
        deleteLine={deleteLine}/>
        : 
        <></>
      }
    </div>
  )
}