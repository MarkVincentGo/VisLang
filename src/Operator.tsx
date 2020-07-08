import React, { FunctionComponent } from 'react';
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
      color="#FCBB5B"
      activeColor="#FDAD29"
      borderColor="#FF5000"
      componentId={operator.id}
      contextMenu={['Delete Operation', 'Copy Operation']}
      onContextMenu={e => e.preventDefault()}
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


