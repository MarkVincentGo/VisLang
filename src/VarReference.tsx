import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable';
import { IVarReference  } from './Editor';

interface VarReferenceProps {
  data: IVarReference,
  handleReferenceDropDown(option: string, refData: IVarReference): void
}

export const VarReference: FunctionComponent<VarReferenceProps> = ({ data, handleReferenceDropDown }) => {
  const handleDropDown = (option: string):void => {
    handleReferenceDropDown(option, data)
  }
  
  return ( !data.deleted ?
    <Draggable
      contextMenu={['Copy Reference', 'Delete Reference']}
      onContextMenu={e => e.preventDefault()}
      contextMenuClick={handleDropDown}>
      {data.variableReferenced.name}
    </Draggable>
    :
    <></>
  )
}
