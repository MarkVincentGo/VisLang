import React, { FunctionComponent, useState, useCallback, useEffect, useRef } from 'react';
import styles from './Editor.module.css';
import { Button } from './Button';
import { Variable } from './Variable';
import { Operator } from './Operator';
import { VarReference } from './VarReference'
import { IVariableInfo, IVarReference, IOperatorInfo } from './Editor';

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

interface DrawLinesProps {
  canvasInfo: number[],
  children?: any,
  lines: DataSVGLine[],
  mouseDown: boolean,
  currentLine: DataSVGLine
}


const DrawLines:FunctionComponent<DrawLinesProps> = ({ canvasInfo, children, lines, mouseDown, currentLine }): JSX.Element => {
  const svgBox = useRef<any>(<div></div>)
  useEffect(() => {
    let {left, top} = svgBox.current.getBoundingClientRect();
    svgBox.current.setAttribute('viewBox', `${left} ${top} ${canvasInfo[1]} ${canvasInfo[0]}`)
    console.log(svgBox.current.getAttribute('viewBox'))
    return () => {
    }
  }, [canvasInfo])

  useEffect(() => {
    console.log('changed')
  }, [lines])

  return (
    <svg
      className="canvas"
      ref={svgBox}
      viewBox={`0 0 ${canvasInfo[1]} ${canvasInfo[0]}`}
      style={{border: '1px solid black', width: canvasInfo[1], height: canvasInfo[0]}}>
      {mouseDown ? <line x1={currentLine.x1} x2={currentLine.x2} y1={currentLine.y1} y2={currentLine.y2} stroke="black"/> : <></>}
      {lines.map((el, i) => (
        <line key={i.toString()} x1={el.x1} x2={el.x2} y1={el.y1} y2={el.y2} stroke="black" />
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
  let itemData: any = null;
  let startX = 0;
  let startY = 0;
  // this is attempt to get the height and width of the canvas component
  const [dimensions, setDimensions] = useState<number[]>([0,0]);
  const [mousedDownInNode, setmousedDownInNode] = useState<boolean>(false);
  const [lines, setLines] = useState<DataSVGLine[]>([])
  const [currentLine, setcurrentLine] = useState<DataSVGLine>(
    {id: 0, x1: 0, y1: 0, x2: 0, y2: 0, data: null, el1: null, el2: null}
    );

  const canvasEl = useCallback((node) => {
      if (node) {
        setDimensions([node.clientHeight, node.clientWidth])
      }
    }, [],)

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
      let newLines = lines.map(el => {
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
      if (lines.length) {
        setLines(newLines)
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
  const nodeMouseDown = (event: React.MouseEvent,  nodeInfo: any): void => {
    let { position, id: nodeId } = nodeInfo
    setmousedDownInNode(true)
    let newLine: DataSVGLine = {
      data: null,
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      x1: event.clientX,
      y1: event.clientY,
      x2: event.clientX, 
      y2: event.clientY,
      el1: position === "bottom" ? nodeId : null,
      el2: position === "bottom" ? null : nodeId,
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

  const nodeMouseUp = (event: React.MouseEvent, nodeInfo: any):void => {
    let { position, id: nodeId } = nodeInfo;
    let newLine = {...currentLine}
    if (position === 'bottom') {
      newLine.el1 = nodeId
    } else if (position === 'top') {
      newLine.el2 = nodeId
    }
    let newLines = [...lines, newLine];
    setLines(newLines);
    setmousedDownInNode(false)
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