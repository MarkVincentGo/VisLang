import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable';
import { IVariableInfo } from './Editor';

interface VarReferenceProps {
  // this is the id for the REFERENCE, not for the variable information
  readonly referenceId: number,
  // this is the object for the variable information
  readonly variableReferenced: IVariableInfo
}

export const VarReference: FunctionComponent<VarReferenceProps> = ({ referenceId, variableReferenced }) => {
  return (
    <Draggable>
      {variableReferenced.name}
    </Draggable>
  )
}
