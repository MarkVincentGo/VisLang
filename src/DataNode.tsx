import React, { FunctionComponent, useState } from 'react';
import styles from './Operator.module.css';
import { IFunctionInfo, IVariableInfo, IVarReference, IConstantInfo, ILoop } from './Interfaces';
import classNames from 'classnames';


interface DataNodesProps {
  position: string,
  nodes: number,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void,
  dragInfo: IFunctionInfo | IVariableInfo | IVarReference | IConstantInfo | ILoop,
  style?: any,
}

export const DataNode: FunctionComponent<DataNodesProps> = ({ position, nodes, mousedDown, mousedUp, dragInfo, style = {} }): JSX.Element => {
  let nodePosition = position === 'top' ? {top: -4.5} : {bottom: -0.5};

  const mouseDown = (i: number, event: React.MouseEvent): void => {
    if (mousedDown && dragInfo) {
      mousedDown(event, {...dragInfo, position}, i);
    }
  }

  const mouseUp = (i: number, event: React.MouseEvent): void => {
    if (mousedUp) {
      mousedUp(event, {...dragInfo, position}, i);
    }
  }

  return (
    <div 
      className={styles.nodeContainer}
      style={{...nodePosition, ...style}}
      >
      {(new Array(nodes).fill(0)).map((el, i) => (
        <div
          key={i.toString()}
          className={[styles.node, 'dataNode', 'DN', position].join(' ')}
          data-node={dragInfo.id}
          onMouseOver={e => e.stopPropagation()}
          onMouseOut={e => e.stopPropagation()}
          onMouseDown={(e) => {mouseDown(i, e)}}
          onMouseUp={(e) => mouseUp(i, e)}/>
      ))}
    </div>
  )
}

interface DataNodesLoopProps extends DataNodesProps {
  cx: number,
  cy: number,
}

export const DataNodeLoop: FunctionComponent<DataNodesLoopProps> = ({ position, nodes, mousedDown, mousedUp, dragInfo, style = {}, cx, cy }): JSX.Element => {
  const [hover, setHover] = useState(false)

  const mouseEnter = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setHover(true);
  }

  const mouseLeave = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setHover(false);
  }

  const mouseDown = (i: number, event: React.MouseEvent): void => {
    if (mousedDown && dragInfo) {
      mousedDown(event, {...dragInfo, position}, i);
    }
  }

  const mouseUp = (i: number, event: React.MouseEvent): void => {
    if (mousedUp) {
      mousedUp(event, {...dragInfo, position}, i);
    }
  }

  return (
    <>
      {(new Array(nodes).fill(0)).map((el, i) => (
        <circle
          key={i.toString()}
          className={classNames(styles.nodeLoop, 'dataNode', 'DN', position)}
          r={hover ? '4' : '3'}
          cx={cx}
          cy={cy}
          fill="red"
          data-node={dragInfo.id}
          onMouseOver={mouseEnter}
          onMouseOut={mouseLeave}
          onMouseDown={(e) => {mouseDown(i, e)}}
          onMouseUp={(e) => mouseUp(i, e)}/>
      ))}
    </>
  )
}