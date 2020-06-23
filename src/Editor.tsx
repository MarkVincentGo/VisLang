import React, { FunctionComponent, useState } from 'react';
import styles from './Editor.module.css';
import varStyles from './Variable.module.css';
import { Panel } from './Panel';
import { ButtonContainer, Button } from './Button';
import { Variable } from './Variable';

interface CanvasProps {
  variableArray: JSX.Element[]
}

const Canvas: FunctionComponent<CanvasProps> = ({ variableArray = []}) => {
  let active = false;
  let currentX: number;
  let currentY: number;
  let initialX: number;
  let initialY: number;
  let xOffset:number = 0;
  let yOffset:number = 0;
  let selectedItem: any = null;

  const dragStart = (event: any): void => {
    // gather all instances of variables and starts drag functionality
    let vars = document.getElementsByClassName(varStyles.variable)
    let varsSet = new Set(vars)
    initialX = event.clientX - xOffset;
    initialY = event.clientY - yOffset;
    if (varsSet.has(event.target)) {
      active = true;
      selectedItem = event.target;
    }
  }

  const dragEnd = (event: React.MouseEvent): void => {
    initialX = currentX;
    initialY = currentY;
    active = false
  }

  const drag = (event: React.MouseEvent): void => {
    if (active) {
      event.preventDefault();
      currentX = event.clientX - initialX;
      currentY = event.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      setTranslate(currentX, currentY, selectedItem)
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
      {variableArray.map(variable => variable)}
    </div>
  )
}

export const Editor = (): JSX.Element => {
  let initialVarState: JSX.Element[] = []
  const [variables, setVariables] = useState(initialVarState)

  const clickVariable = (): void => {
    let newVarArray: JSX.Element[] = [...variables, <Variable />]
    setVariables(newVarArray)
  }

  return (
    <Panel windowName="Editor">
      <ButtonContainer>
        <Button name="Variables" onClick={clickVariable}/>
        <Button name="Loops"/>
        <Button name="Operations"/>
        <Button name="Function"/>
        <Button name="Log to Console"/>
        <Button name="Test 1"/>
        <Button name="Test 2"/>
      </ButtonContainer>
      <Canvas variableArray={variables}/>
    </Panel>
  )
}