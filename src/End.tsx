import React, { FunctionComponent} from 'react';
import { Draggable } from './Draggable';
import { DataNode } from './DataNode';

interface EndProps {
  data: any,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void
}

export const End: FunctionComponent<EndProps> = ({ data, mousedDown, mousedUp }) => {
  return (
    <Draggable
      componentId={data.id}
      activeColor="#FF7C7C"
      color="#FF6F6F"
      borderColor="#FF0D0D">
      <DataNode
        position="top"
        nodes={data.args.length}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={data}/>
      End
    </Draggable>
  )
}
