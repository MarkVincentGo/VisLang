import React, { useState, useRef, useEffect } from 'react';
import { makeDraggable } from './utilityFunctions';


export const LoopPrototype = (): JSX.Element => {
  const [circleXPos, setcircleXPos] = useState(0);
  const [circleYPos, setcircleYPos] = useState(0)
  const loopRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let loopEl = loopRef.current
    let circleEl = circleRef.current
    let setIntHighlight: any = null
    if (loopEl && circleEl) {
      setIntHighlight = makeDraggable(loopEl, () => {}, true, (id) => console.log(id));
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
          width: circleXPos + 100,
          height: circleYPos + 100,
          position: 'absolute',
          border: '6px solid purple',
          }}>
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