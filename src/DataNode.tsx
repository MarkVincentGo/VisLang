import React, { FunctionComponent, useState } from 'react';
import styles from './Operator.module.css';
import { IFunctionInfo, IVariableInfo, IVarReference } from './Editor';



interface DataNodesProps {
  position: string,
  nodes: number,
  mousedDown(event: React.MouseEvent, dragInfo: any): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any): void,
  dragInfo: IFunctionInfo | IVariableInfo | IVarReference
}

export const DataNode: FunctionComponent<DataNodesProps> = ({ position, nodes, mousedDown, mousedUp, dragInfo }): JSX.Element => {
  const [nodeData, setNodeData] = useState<any[]>(new Array(nodes).fill(null));

  let nodePosition = position === 'top' ? {top: -5} : {bottom: -1.5};

  const mouseEnter = (event: React.MouseEvent): void => {
    event.stopPropagation();
  }

  const mouseLeave = (event: React.MouseEvent): void => {
    event.stopPropagation();
  }

  const mouseDown = (i: number, event: React.MouseEvent): void => {
    if (mousedDown && dragInfo) {
      mousedDown(event, {...dragInfo, position});
    }
  }

  const mouseUp = (i: number, event: React.MouseEvent): void => {
    const newNodeData = [...nodeData];
    newNodeData[i] = {data: ''}
    setNodeData(newNodeData);
    if (mousedUp) {
      mousedUp(event, {...dragInfo, position})
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