import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable'
import { IFunctionInfo } from './Editor';
import { DataNode } from './DataNode';




interface OperatorProps {
  operator: IFunctionInfo,
  mousedDown(event: React.MouseEvent, dragInfo: any): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any): void
}

export const Operator: FunctionComponent<OperatorProps> = ({ operator, mousedDown, mousedUp }): JSX.Element => {
  return (
    <Draggable color="#FCBB5B" activeColor="#FDAD29" borderColor="#FF5000" componentId={operator.id}>
      <DataNode position="top" nodes={2} mousedDown={mousedDown} mousedUp={mousedUp} dragInfo={operator}/>
        {operator.opType}
      <DataNode position="bottom" nodes={1} mousedDown={mousedDown} mousedUp={mousedUp} dragInfo={operator}/>
    </Draggable>
  )
}


