import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable'
import { OperationInfo } from './Editor';

interface OperatorProps {
  operator: OperationInfo
}

export const Operator: FunctionComponent<OperatorProps> = ({ operator }): JSX.Element => {
  return (
    <Draggable color="#FCBB5B" activeColor="#FDAD29" borderColor="#FF5000">
      {operator.type}
    </Draggable>
  )
}
