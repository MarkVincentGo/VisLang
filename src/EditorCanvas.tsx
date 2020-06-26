import React, { FunctionComponent, useState, useCallback } from 'react';
import styles from './Editor.module.css';
import { Button } from './Button';
import { Variable } from './Variable';
import { Operator } from './Operator';
import { VarReference } from './VarReference'
import { IVariableInfo, IVarReference, IOperatorInfo } from './Editor';

export interface SVGLine {
  id: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
}

interface DrawLinesProps {
  canvasInfo: number[],
  children?: any,
  lines: SVGLine[],
  mouseDown: boolean,
  currentLine: SVGLine
}


const DrawLines:FunctionComponent<DrawLinesProps> = ({ canvasInfo, children, lines, mouseDown, currentLine }): JSX.Element => {
  // const [height, setheight] = useState(0)
  // const [width, setwidth] = useState(0)

  return (
    <svg
      onClick={e => console.log(e.currentTarget.getBoundingClientRect())}
      viewBox={`0 0 ${canvasInfo[1]} ${canvasInfo[0]}`}
      style={{border: '1px solid black', width: canvasInfo[1], height: canvasInfo[0]}}>
      {mouseDown ? <line x1={currentLine.x1} x2={currentLine.x2} y1={currentLine.y1} y2={currentLine.y2} stroke="black"/> : <></>}
      {lines.map((el) => (
        <line x1={el.x1} x2={el.x2} y1={el.y1} y2={el.y2} stroke="black" />
      ))}
      {children}
    </svg>
  )
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



export const Canvas: FunctionComponent<CanvasProps> = (
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
  // this is attempt to get the height and width of the canvas component
  const [dimensions, setDimensions] = useState<number[]>([0,0]);

  const [mousedDownInNode, setmousedDownInNode] = useState<boolean>(false)
  const [mousedUpInNode, setmousedUpInNode] = useState<boolean>(false)

  const canvasEl = useCallback((node) => {
      if (node) {
        setDimensions([node.clientHeight, node.clientWidth])
      }
    },
    [],
  )

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
    if (mousedDownInNode) {
      setcurrentLine({id: 0, x1: 0, y1: 0, x2: 0, y2: 0})
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

  const [lines, setLines] = useState<SVGLine[]>([])
  const [currentLine, setcurrentLine] = useState<SVGLine>({id: 0, x1: 0, y1: 0, x2: 0, y2: 0})
  // when one node is clicked client mouse data passed to line data
  const nodeMouseDown = (event: React.MouseEvent): void => {
    setmousedDownInNode(true)
    let newLine = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      x1: event.clientX - 14,
      y1: event.clientY - 103,
      x2: event.clientX - 14, 
      y2: event.clientY - 103,
    }
    setcurrentLine(newLine)
  }


  const nodeMouseMove = (event: React.MouseEvent):void => {
    let newLine = {
      ...currentLine,
      x2: event.clientX - 14, 
      y2: event.clientY - 103,
    }
    setcurrentLine(newLine)
  }

  const nodeMouseUp = ():void => {
    let newLines = [...lines, currentLine];
    setLines(newLines);
    setmousedDownInNode(false)
  }

  return (
    <div 
      className={styles.canvas}
      onMouseDown={dragStart}
      onMouseUp={dragEnd}
      onMouseMove={drag}
      ref={canvasEl}>
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
          key={i.toString()}
          mousedDown={nodeMouseDown}
          mousedUp={nodeMouseUp}/>
      ))}
      <DrawLines
        canvasInfo={dimensions}
        currentLine={currentLine}
        mouseDown={mousedDownInNode}
        lines={lines}/>
    </div>
  )
}