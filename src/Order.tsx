import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable'
import { IFunctionInfo } from './Interfaces';
import { DataNode } from './DataNode';



interface OperatorProps {
  operator: IFunctionInfo,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void,
  handleOperatorDropDown(option: string, opData: IFunctionInfo): void,
  changeArgNum(operator: IFunctionInfo): void,
}

export const Order: FunctionComponent<OperatorProps> = ({ operator, mousedDown, mousedUp, handleOperatorDropDown, changeArgNum }): JSX.Element => {
  const handleDropDown = (option: string): void => {
    handleOperatorDropDown(option, operator)
  }

  const changeArgs = (op: string): void => {
    const newOperator = {...operator};
    if (op === '+') {
        if (newOperator.increaseArgs) {
        newOperator.increaseArgs()
        }
    } else if (op === '-') {
      if (newOperator.decreaseArgs) {
        newOperator.decreaseArgs()
      }
    }
    changeArgNum(newOperator)
  }
  
  return ( !operator.deleted ?
    <Draggable
      color={operator.color}
      activeColor="#FDAD29"
      borderColor="khaki"
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
      <span onClick={() => changeArgs('-')}>-</span> {operator.opType} <span onClick={() => changeArgs('+')}>+</span>
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


