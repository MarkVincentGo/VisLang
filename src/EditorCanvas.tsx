import React, { FunctionComponent } from 'react';
import styles from './Editor.module.css';
import { Button } from './Button';
import { Variable } from './Variable';
import { Operator } from './Operator';
import { VarReference } from './VarReference'
import { IVariableInfo, IVarReference, IOperatorInfo } from './Editor';

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
          key={i.toString()}/>
      ))}
    </div>
  )
}