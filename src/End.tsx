import React, { FunctionComponent} from 'react';
import { Draggable } from './Draggable';
import { DataNode } from './DataNode';

interface EndProps {
  data: any,
  mousedDown(event: React.MouseEvent, dragInfo: any): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any): void
}

export const End: FunctionComponent<EndProps> = ({ data, mousedDown, mousedUp }) => {
  return (
    <Draggable componentId={data.id}>
      <DataNode position="top" nodes={1} mousedDown={mousedDown} mousedUp={mousedUp} dragInfo={data}/>
      End
    </Draggable>
  )
}
