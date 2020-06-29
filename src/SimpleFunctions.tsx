import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable';
import { DataNode } from './DataNode';
import { IConsoleLog } from './Editor'

interface ConsoleLogProps {
  data: IConsoleLog,
  mousedDown(event: React.MouseEvent, dragInfo: any): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any): void
}

export const ConsoleLog: FunctionComponent<ConsoleLogProps> = ({data, mousedDown, mousedUp}): JSX.Element => {
  return (
    <Draggable componentId={data.id} color="lightgreen" borderColor="seaGreen" activeColor="#A7FF59">
      <DataNode position="top" nodes={1} mousedDown={mousedDown} mousedUp={mousedUp} dragInfo={data}/>
        Log To Console
      <DataNode position="bottom" nodes={1} mousedDown={mousedDown} mousedUp={mousedUp} dragInfo={data}/>
    </Draggable>
  )
}