import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable';
import { IVarReference  } from './Editor';

interface VarReferenceProps {
  data: IVarReference
}

export const VarReference: FunctionComponent<VarReferenceProps> = ({ data }) => {
  return ( !data.deleted ?
    <Draggable>
      {data.variableReferenced.name}
    </Draggable>
    :
    <></>
  )
}
