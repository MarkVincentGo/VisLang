import React, { FunctionComponent } from 'react';
import styles from './Variable.module.css'
import { Draggable } from './Draggable'
import { IFunctionInfo } from './Interfaces';
import { DataNode } from './DataNode';



interface OperatorProps {
  operator: IFunctionInfo,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void,
  handleOperatorDropDown(option: string, opData: IFunctionInfo): void
}

export const Operator: FunctionComponent<OperatorProps> = ({ operator, mousedDown, mousedUp, handleOperatorDropDown }): JSX.Element => {
  const handleDropDown = (option: string): void => {
    handleOperatorDropDown(option, operator)
  }
  
  return ( !operator.deleted ?
    <Draggable
      className={styles.operatorContainer}
      color={operator.color}
      activeColor="#FDAD29"
      borderColor="#FF5000"
      componentId={operator.id}
      contextMenu={['Delete Operation', 'Copy Operation']}
      onContextMenu={e => e.preventDefault()}
      left={operator.left}
      top={operator.top}
      contextMenuClick={handleDropDown}>
      <DataNode
        position="top"
        nodes={operator.args.length}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={operator}/>
        {operator.opType}
      <DataNode
        position="bottom"
        nodes={1}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={operator}/>
    </Draggable>
    :
    <></>
  )
}


