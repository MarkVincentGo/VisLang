import React, { FunctionComponent, useState } from 'react';
import { Draggable } from './Draggable'
import { IOperatorInfo } from './Editor';
import styles from './Operator.module.css'


interface DataNodesProps {
  position: string,
  nodes: number
}

const DataNode: FunctionComponent<DataNodesProps> = ({ position, nodes }): JSX.Element => {
  let nodePosition = position === 'top' ? {top: -5} : {bottom: -1.5}

  const mouseEnter = (event: React.MouseEvent): void => {
    event.stopPropagation()
  }
  const mouseLeave = (event: React.MouseEvent): void => {
    event.stopPropagation()
  }

  return (
    <div 
      className={styles.nodeContainer}
      style={nodePosition}>
      {(new Array(nodes).fill(0)).map((el, i) => (
        <div
          key={i.toString()}
          className={styles.node}
          onMouseOver={mouseEnter}
          onMouseLeave={mouseLeave}/>
      ))}
    </div>
  )
}

interface OperatorProps {
  operator: IOperatorInfo
}

export const Operator: FunctionComponent<OperatorProps> = ({ operator }): JSX.Element => {
  return (
    <Draggable color="#FCBB5B" activeColor="#FDAD29" borderColor="#FF5000">
      <DataNode position="top" nodes={2}/>
        {operator.type}
      <DataNode position="bottom" nodes={1}/>
    </Draggable>
  )
}


