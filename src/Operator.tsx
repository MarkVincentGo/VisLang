import React, { FunctionComponent } from 'react';
import { Draggable } from './Draggable'
import { IOperatorInfo } from './Editor';

interface OperatorProps {
  operator: IOperatorInfo
}

export const Operator: FunctionComponent<OperatorProps> = ({ operator }): JSX.Element => {
  return (
    <Draggable color="#FCBB5B" activeColor="#FDAD29" borderColor="#FF5000">
      {operator.type}
    </Draggable>
  )
}
