import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable';
import { DataNode } from './DataNode';
import { IFunctionInfo } from './Interfaces'

interface ConsoleLogProps {
  data: IFunctionInfo,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void
}

export const ConsoleLog: FunctionComponent<ConsoleLogProps> = ({data, mousedDown, mousedUp}): JSX.Element => {
  return (
    <Draggable
      componentId={data.id}
      color="lightgreen"
      borderColor="seaGreen"
      activeColor="#A7FF59">
      <DataNode
        position="top"
        nodes={data.args.length}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={data}/>
        Log
      <DataNode
        position="bottom"
        nodes={1}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={data}/>
    </Draggable>
  )
}