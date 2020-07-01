import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable';
import { DataNode } from './DataNode';
import { IVarReference  } from './Editor';

interface VarReferenceProps {
  data: IVarReference,
  handleReferenceDropDown(option: string, refData: IVarReference): void,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void
}

export const VarReference: FunctionComponent<VarReferenceProps> = ({ data, handleReferenceDropDown, mousedDown, mousedUp }) => {
  const handleDropDown = (option: string):void => {
    handleReferenceDropDown(option, data)
  }

  return ( !data.deleted ?
    <Draggable
      componentId={data.id}
      contextMenu={['Copy Reference', 'Delete Reference']}
      onContextMenu={e => e.preventDefault()}
      contextMenuClick={handleDropDown}>
      {data.variableReferenced.name}
      <DataNode
        position="bottom"
        nodes={1}
        mousedDown={mousedDown}
        mousedUp={mousedUp}
        dragInfo={data}/>
    </Draggable>
    :
    <></>
  )
}
