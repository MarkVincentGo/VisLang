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
  const [circleYPos, setcircleYPos] = useState(0);
  const [rectXPos, setrectXPos] = useState(0);
  const [rectYPos, setrectYPos] = useState(0);

  const loopRef = useRef<SVGRectElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    let loopEl = loopRef.current
    let circleEl = circleRef.current
    let setIntHighlight: any = null
    if (loopEl && circleEl) {
      // makeDraggable returns a setInterval, cleared on unmount
      setIntHighlight = makeDraggable(
        loopEl,
        (x: number, y: number) => {
          setrectXPos(x);
          setrectYPos(y)
        }, 
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
      <rect ref={loopRef} x={33} y={117} height={circleYPos + 50} width={circleXPos + 50} style={{fill: 'none', strokeWidth: 6, stroke: 'black', cursor: 'pointer'}}/>
      <circle ref={circleRef} r="10" cx={circleXPos + rectXPos + 89} cy={circleYPos + rectYPos + 173}/>
      {/* <div 
        className="draggable loop"
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
        <div 
          style={{
            backgroundColor: 'red',
            borderRadius:'50%',
            width: 20,
            height: 20,
            position: 'absolute',
            bottom: -(16 - circleYPos),
            right: -(16 - circleXPos),
          }}></div>
      </div> */}
    </>
  )
}