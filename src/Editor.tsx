import React, { FunctionComponent, useState } from 'react';
import styles from './Editor.module.css';
import varStyles from './Variable.module.css';
import { Panel } from './Panel';
import { ButtonContainer, Button } from './Button';
import { Variable } from './Variable';

interface CanvasProps {
  variableArray: VariableInfo[]
}

export interface VariableInfo {
  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset:number;
  yOffset:number;
}

const Canvas: FunctionComponent<CanvasProps> = ({ variableArray = []}) => {
  let active = false;
  let selectedItem: any = null;
  let itemData: any = null

  const dragStart = (event: any): void => {
    // gather all instances of variables and starts drag functionality
    let vars = document.getElementsByClassName(varStyles.variable)
    let varsSet = new Set(vars)
    //every variable should have their own x and y properties, now find a way to access them
    if (varsSet.has(event.target)) {
      active = true;
      // does selected item have the meta data i need? Yes, in a data- prop
      selectedItem = event.target;
      itemData = JSON.parse(selectedItem.dataset.varinfo)
      let { xOffset, yOffset } = itemData;
      itemData.initialX = event.clientX - xOffset;
      itemData.initialY = event.clientY - yOffset;
    }
  }

  const dragEnd = (event: React.MouseEvent): void => {
    if (active) {
      let { currentX, currentY } = itemData;
      itemData.initialX = currentX;
      itemData.initialY = currentY;
      selectedItem.dataset.varinfo = JSON.stringify(itemData)
      active = false
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
      setTranslate(itemData.currentX, itemData.currentY, selectedItem)
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
      {variableArray.map((variableInfo, i) => <Variable variableInfo={variableInfo} key={i.toString()}/>)}
    </div>
  )
}

export const Editor = (): JSX.Element => {
  let initialVarState: VariableInfo[] = []
  const [variables, setVariables] = useState(initialVarState)

  const clickVariable = (): void => {
    let newVarInfo = {
      currentX: 0, 
      currentY: 0,
      initialX: 0,
      initialY: 0,
      xOffset: 0,
      yOffset: 0,
    }
    let newVarArray: VariableInfo[] = [...variables, newVarInfo]
    setVariables(newVarArray)
  }

  return (
    <Panel windowName="Editor">
      <ButtonContainer>
        <Button 
          name="Variables"
          ddClick={clickVariable}
          dropDown
          dropDownList={['number', 'string', 'boolean', 'null']}/>
        <Button name="Loops" dropDown/>
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