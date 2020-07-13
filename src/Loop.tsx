import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import { makeDraggable } from './utilityFunctions';
import { DataNode } from './DataNode'
import { ILoop } from './Interfaces'


interface LoopProps {
  data: ILoop,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void,
  edit(loop: ILoop, key: string, value: any): void,
  //handleOperatorDropDown(option: string, opData: IFunctionInfo): void
}

export const LoopPrototype: FunctionComponent<LoopProps> = ({ data, mousedDown, mousedUp, edit }): JSX.Element => {
  const [circleXPos, setcircleXPos] = useState(0);
  const [circleYPos, setcircleYPos] = useState(0)
  const loopRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let loopEl = loopRef.current
    let circleEl = circleRef.current
    let setIntHighlight: any = null
    if (loopEl && circleEl) {
      // makeDraggable returns a setInterval, cleared on unmount
      setIntHighlight = makeDraggable(
        loopEl, () => {}, 
        true, 
        (arr: number[]) => {
          edit(data, 'enclosedComponents', new Set<number>(arr))
          console.log(arr)
        });
    }
    if (circleEl) {
      makeDraggable(circleEl, (x: number, y: number) => {
        setcircleXPos(x);
        setcircleYPos(y)
      })
    }
    return (() => {
      clearInterval(setIntHighlight);
    })
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div ref={loopRef} 
        style={{
          backgroundColor: 'rgba(0,0,0,0)',
          width: circleXPos + 50,
          height: circleYPos + 50,
          position: 'absolute',
          border: '6px solid purple',
          }}>
        <DataNode
          position="top"
          nodes={data.args.length}
          mousedDown={mousedDown}
          mousedUp={mousedUp}
          dragInfo={data}
          style={{top: -9}}/>
        <div ref={circleRef} 
          style={{
            backgroundColor: 'red',
            borderRadius:'50%',
            width: 20,
            height: 20,
            position: 'absolute',
            bottom: -(16 - circleYPos),
            right: -(16 - circleXPos),
          }}></div>
      </div>
    </>
  )
}