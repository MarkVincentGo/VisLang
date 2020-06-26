import React, { FunctionComponent, useState } from 'react';
import { Draggable } from './Draggable'
import { IOperatorInfo } from './Editor';
import styles from './Operator.module.css'


interface DataNodesProps {
  position: string,
  nodes: number,
  mousedDown?(event: React.MouseEvent): void, 
  mousedUp?(event: React.MouseEvent): void
}

export const DataNode: FunctionComponent<DataNodesProps> = ({ position, nodes, mousedDown, mousedUp }): JSX.Element => {
  const [nodeData, setNodeData] = useState<any[]>(new Array(nodes).fill(null))

  let nodePosition = position === 'top' ? {top: -5} : {bottom: -1.5}

  const mouseEnter = (event: React.MouseEvent): void => {
    event.stopPropagation()
  }
  const mouseLeave = (event: React.MouseEvent): void => {
    event.stopPropagation()
  }

  const mouseDown = (i: number, event: React.MouseEvent): void => {
    if (mousedDown) {
      mousedDown(event)
    }
  }

  const mouseUp = (i: number, event: React.MouseEvent): void => {
    const newNodeData = [...nodeData];
    newNodeData[i] = {data: ''}
    setNodeData(newNodeData);
    if (mousedUp) {
      mousedUp(event)
    }
  }

  return (
    <div 
      className={styles.nodeContainer}
      style={nodePosition}
      >
      {(new Array(nodes).fill(0)).map((el, i) => (
        <div
          key={i.toString()}
          className={[styles.node, 'dataNode'].join(' ')}
          onMouseOver={mouseEnter}
          onMouseOut={mouseLeave}
          onMouseDown={(e) => {mouseDown(i, e)}}
          onMouseUp={(e) => mouseUp(i, e)}/>
      ))}
    </div>
  )
}

interface OperatorProps {
  operator: IOperatorInfo,
  mousedDown?(event: React.MouseEvent): void, 
  mousedUp?(event: React.MouseEvent): void
}

export const Operator: FunctionComponent<OperatorProps> = ({ operator, mousedDown, mousedUp }): JSX.Element => {
  return (
    <Draggable color="#FCBB5B" activeColor="#FDAD29" borderColor="#FF5000">
      <DataNode position="top" nodes={2} mousedDown={mousedDown} mousedUp={mousedUp}/>
        {operator.type}
      <DataNode position="bottom" nodes={1} mousedDown={mousedDown} mousedUp={mousedUp}/>
    </Draggable>
  )
}


